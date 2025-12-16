"""
Auto Recovery - استعادة تلقائية
Automatic system recovery mechanisms
"""

import logging
import asyncio
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class RecoveryAction(Enum):
    """Recovery action types"""
    RESTART_SERVICE = "restart_service"
    CLEAR_CACHE = "clear_cache"
    FREE_MEMORY = "free_memory"
    RESTART_PROCESS = "restart_process"
    ROLLBACK_CONFIG = "rollback_config"
    RESET_CONNECTION = "reset_connection"


@dataclass
class RecoveryPlan:
    """Recovery plan data"""
    plan_id: str
    condition: str
    action: RecoveryAction
    priority: int
    enabled: bool = True
    max_attempts: int = 3
    cooldown_seconds: int = 60


class AutoRecovery:
    """
    Auto Recovery Class
    Handles automatic system recovery
    """
    
    def __init__(self):
        """Initialize Auto Recovery"""
        self.logger = logging.getLogger(__name__)
        self.recovery_plans: List[RecoveryPlan] = []
        self.recovery_history: List[Dict] = []
        self.action_handlers: Dict[RecoveryAction, Callable] = {}
        self._setup_default_plans()
        
    def _setup_default_plans(self) -> None:
        """Setup default recovery plans"""
        default_plans = [
            RecoveryPlan(
                plan_id="memory_low",
                condition="memory_usage > 90",
                action=RecoveryAction.FREE_MEMORY,
                priority=5
            ),
            RecoveryPlan(
                plan_id="service_failed",
                condition="service_status == 'failed'",
                action=RecoveryAction.RESTART_SERVICE,
                priority=8
            ),
        ]
        
        self.recovery_plans.extend(default_plans)
    
    def register_recovery_plan(self, plan: RecoveryPlan) -> None:
        """Register a recovery plan"""
        self.recovery_plans.append(plan)
        self.logger.info(f"Registered recovery plan: {plan.plan_id}")
    
    def register_action_handler(
        self,
        action: RecoveryAction,
        handler: Callable
    ) -> None:
        """Register handler for recovery action"""
        self.action_handlers[action] = handler
        self.logger.info(f"Registered handler for action: {action.value}")
    
    async def attempt_recovery(
        self,
        condition: str,
        context: Optional[Dict] = None
    ) -> bool:
        """
        Attempt automatic recovery
        
        Args:
            condition: Condition that triggered recovery
            context: Additional context information
            
        Returns:
            True if recovery was attempted
        """
        self.logger.info(f"🔄 Attempting recovery for condition: {condition}")
        
        # Find matching recovery plans
        matching_plans = [
            plan for plan in self.recovery_plans
            if plan.enabled and plan.condition in condition
        ]
        
        if not matching_plans:
            self.logger.warning(f"No recovery plan found for condition: {condition}")
            return False
        
        # Sort by priority
        matching_plans.sort(key=lambda p: p.priority, reverse=True)
        
        # Execute recovery plans
        for plan in matching_plans:
            success = await self._execute_recovery_plan(plan, context)
            
            if success:
                self.logger.info(f"✅ Recovery successful: {plan.plan_id}")
                return True
        
        self.logger.warning("❌ Recovery attempts failed")
        return False
    
    async def _execute_recovery_plan(
        self,
        plan: RecoveryPlan,
        context: Optional[Dict]
    ) -> bool:
        """Execute a recovery plan"""
        if plan.action not in self.action_handlers:
            self.logger.error(f"No handler for action: {plan.action.value}")
            return False
        
        handler = self.action_handlers[plan.action]
        
        try:
            if asyncio.iscoroutinefunction(handler):
                result = await handler(context or {})
            else:
                result = handler(context or {})
            
            # Record recovery attempt
            self.recovery_history.append({
                "plan_id": plan.plan_id,
                "action": plan.action.value,
                "timestamp": datetime.now().isoformat(),
                "success": result,
                "context": context
            })
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error executing recovery plan {plan.plan_id}: {e}")
            return False
    
    def get_recovery_history(self, limit: int = 50) -> List[Dict]:
        """Get recovery history"""
        return self.recovery_history[-limit:]

