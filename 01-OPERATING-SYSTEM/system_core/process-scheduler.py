"""
Process Scheduler - مجدول العمليات
Manages process scheduling and execution priorities
"""

import asyncio
import logging
import time
from typing import Dict, List, Optional, Callable, Any
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from queue import PriorityQueue
import threading


class ProcessPriority(Enum):
    """Process priority levels"""
    LOW = 1
    NORMAL = 5
    HIGH = 8
    CRITICAL = 10


class ProcessState(Enum):
    """Process execution states"""
    PENDING = "pending"
    READY = "ready"
    RUNNING = "running"
    WAITING = "waiting"
    TERMINATED = "terminated"
    SUSPENDED = "suspended"


@dataclass
class Process:
    """Process data class"""
    pid: int
    name: str
    priority: ProcessPriority
    state: ProcessState
    func: Callable
    args: tuple = ()
    kwargs: dict = None
    created_at: datetime = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Any = None
    error: Optional[Exception] = None
    
    def __post_init__(self):
        if self.kwargs is None:
            self.kwargs = {}
        if self.created_at is None:
            self.created_at = datetime.now()


class ProcessScheduler:
    """
    Process Scheduler Class
    Manages process execution with priority-based scheduling
    """
    
    def __init__(self, max_concurrent: int = 10):
        """
        Initialize Process Scheduler
        
        Args:
            max_concurrent: Maximum number of concurrent processes
        """
        self.logger = logging.getLogger(__name__)
        self.max_concurrent = max_concurrent
        self.processes: Dict[int, Process] = {}
        self.process_queue: PriorityQueue = PriorityQueue()
        self.running_processes: Dict[int, asyncio.Task] = {}
        self.next_pid = 1
        self.scheduler_running = False
        self.scheduler_task: Optional[asyncio.Task] = None
        self.lock = asyncio.Lock()
        
    async def start(self) -> None:
        """Start the process scheduler"""
        if self.scheduler_running:
            self.logger.warning("Scheduler is already running")
            return
        
        self.scheduler_running = True
        self.scheduler_task = asyncio.create_task(self._scheduler_loop())
        self.logger.info("✅ Process scheduler started")
    
    async def stop(self) -> None:
        """Stop the process scheduler"""
        if not self.scheduler_running:
            return
        
        self.scheduler_running = False
        
        # Cancel all running processes
        for task in self.running_processes.values():
            task.cancel()
        
        if self.scheduler_task:
            self.scheduler_task.cancel()
            try:
                await self.scheduler_task
            except asyncio.CancelledError:
                pass
        
        self.logger.info("🛑 Process scheduler stopped")
    
    async def submit(
        self,
        func: Callable,
        name: str = "unnamed",
        priority: ProcessPriority = ProcessPriority.NORMAL,
        args: tuple = (),
        kwargs: Optional[dict] = None
    ) -> int:
        """
        Submit a process for execution
        
        Args:
            func: Function to execute
            name: Process name
            priority: Process priority
            args: Function arguments
            kwargs: Function keyword arguments
            
        Returns:
            Process ID (PID)
        """
        async with self.lock:
            pid = self.next_pid
            self.next_pid += 1
        
        process = Process(
            pid=pid,
            name=name,
            priority=priority,
            state=ProcessState.PENDING,
            func=func,
            args=args,
            kwargs=kwargs or {}
        )
        
        self.processes[pid] = process
        
        # Add to priority queue (lower priority value = higher priority)
        priority_value = -priority.value  # Negative for max-heap behavior
        self.process_queue.put((priority_value, time.time(), pid))
        
        self.logger.info(f"📋 Process '{name}' (PID: {pid}) submitted with priority {priority.name}")
        
        return pid
    
    async def _scheduler_loop(self) -> None:
        """Main scheduler loop"""
        while self.scheduler_running:
            try:
                # Check for completed processes
                await self._check_completed_processes()
                
                # Start new processes if we have capacity
                await self._start_pending_processes()
                
                # Small delay to prevent busy waiting
                await asyncio.sleep(0.1)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in scheduler loop: {e}", exc_info=True)
                await asyncio.sleep(0.5)
    
    async def _check_completed_processes(self) -> None:
        """Check and handle completed processes"""
        completed_pids = []
        
        for pid, task in self.running_processes.items():
            if task.done():
                completed_pids.append(pid)
                process = self.processes.get(pid)
                
                if process:
                    process.state = ProcessState.TERMINATED
                    process.completed_at = datetime.now()
                    
                    try:
                        if task.exception():
                            process.error = task.exception()
                            self.logger.error(
                                f"❌ Process '{process.name}' (PID: {pid}) failed: {process.error}"
                            )
                        else:
                            process.result = task.result()
                            self.logger.info(
                                f"✅ Process '{process.name}' (PID: {pid}) completed successfully"
                            )
                    except Exception as e:
                        process.error = e
                        self.logger.error(f"Error handling completed process {pid}: {e}")
        
        # Remove completed processes
        for pid in completed_pids:
            self.running_processes.pop(pid, None)
    
    async def _start_pending_processes(self) -> None:
        """Start pending processes up to max_concurrent limit"""
        while (len(self.running_processes) < self.max_concurrent and 
               not self.process_queue.empty()):
            
            try:
                _, _, pid = self.process_queue.get_nowait()
                process = self.processes.get(pid)
                
                if not process or process.state != ProcessState.PENDING:
                    continue
                
                # Create and start task
                task = asyncio.create_task(self._execute_process(process))
                self.running_processes[pid] = task
                process.state = ProcessState.RUNNING
                process.started_at = datetime.now()
                
                self.logger.info(f"▶️ Started process '{process.name}' (PID: {pid})")
                
            except Exception as e:
                self.logger.error(f"Error starting process: {e}")
                break
    
    async def _execute_process(self, process: Process) -> Any:
        """Execute a process"""
        try:
            if asyncio.iscoroutinefunction(process.func):
                result = await process.func(*process.args, **process.kwargs)
            else:
                # Run sync function in executor
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None, 
                    lambda: process.func(*process.args, **process.kwargs)
                )
            return result
        except Exception as e:
            self.logger.error(f"Process execution error: {e}", exc_info=True)
            raise
    
    async def wait_for_process(self, pid: int, timeout: Optional[float] = None) -> Any:
        """
        Wait for a process to complete
        
        Args:
            pid: Process ID
            timeout: Maximum time to wait (seconds)
            
        Returns:
            Process result
        """
        if pid not in self.processes:
            raise ValueError(f"Process {pid} not found")
        
        process = self.processes[pid]
        
        if pid in self.running_processes:
            task = self.running_processes[pid]
            try:
                result = await asyncio.wait_for(task, timeout=timeout)
                return result
            except asyncio.TimeoutError:
                raise TimeoutError(f"Process {pid} timed out")
        
        # Process already completed
        if process.error:
            raise process.error
        return process.result
    
    async def cancel_process(self, pid: int) -> bool:
        """
        Cancel a running process
        
        Args:
            pid: Process ID
            
        Returns:
            True if cancelled successfully
        """
        if pid not in self.processes:
            return False
        
        process = self.processes[pid]
        
        if pid in self.running_processes:
            task = self.running_processes[pid]
            task.cancel()
            
            try:
                await task
            except asyncio.CancelledError:
                pass
            
            process.state = ProcessState.TERMINATED
            process.completed_at = datetime.now()
            self.running_processes.pop(pid, None)
            
            self.logger.info(f"🚫 Cancelled process '{process.name}' (PID: {pid})")
            return True
        
        return False
    
    def get_process_info(self, pid: int) -> Optional[Dict[str, Any]]:
        """Get information about a process"""
        if pid not in self.processes:
            return None
        
        process = self.processes[pid]
        return {
            'pid': process.pid,
            'name': process.name,
            'priority': process.priority.name,
            'state': process.state.value,
            'created_at': process.created_at.isoformat(),
            'started_at': process.started_at.isoformat() if process.started_at else None,
            'completed_at': process.completed_at.isoformat() if process.completed_at else None,
            'has_result': process.result is not None,
            'has_error': process.error is not None
        }
    
    def get_running_processes(self) -> List[Dict[str, Any]]:
        """Get list of running processes"""
        return [
            self.get_process_info(pid)
            for pid in self.running_processes.keys()
        ]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get scheduler statistics"""
        total = len(self.processes)
        running = len(self.running_processes)
        pending = self.process_queue.qsize()
        completed = sum(
            1 for p in self.processes.values()
            if p.state == ProcessState.TERMINATED
        )
        
        return {
            'total_processes': total,
            'running': running,
            'pending': pending,
            'completed': completed,
            'max_concurrent': self.max_concurrent,
            'scheduler_running': self.scheduler_running
        }

