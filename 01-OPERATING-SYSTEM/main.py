"""
Main Entry Point - نقطة الدخول الرئيسية
Main entry point for the Operating System module
"""

import asyncio
import sys
import logging
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Import from modules (they handle hyphenated file names internally)
from system_core import SystemInitializer, ServiceManager, ProcessScheduler
from system_monitoring import SystemHealthCheck


async def main():
    """Main function"""
    print("🚀 Starting Oman Education AI Operating System...")
    print("=" * 60)
    
    try:
        # Initialize system
        initializer = SystemInitializer()
        init_result = await initializer.initialize()
        
        print(f"\n✅ System initialized successfully!")
        print(f"   Initialization time: {init_result.get('initialization_time', 0):.2f} seconds")
        print(f"   Components initialized: {len(init_result.get('components', {}))}")
        
        # Start service manager
        service_manager = ServiceManager()
        
        # Start process scheduler
        scheduler = ProcessScheduler(max_concurrent=10)
        await scheduler.start()
        
        # Perform health check
        health_check = SystemHealthCheck()
        health_report = health_check.check_system_health()
        
        print(f"\n🏥 System Health: {health_report['overall_status'].upper()}")
        print(f"   CPU: {health_report['metrics']['cpu']['status']}")
        print(f"   Memory: {health_report['metrics']['memory']['status']}")
        print(f"   Disk: {health_report['metrics']['disk']['status']}")
        
        print("\n" + "=" * 60)
        print("✅ System is ready!")
        print("=" * 60)
        
        # Keep system running
        try:
            await asyncio.sleep(3600)  # Run for 1 hour (or until interrupted)
        except KeyboardInterrupt:
            print("\n\n🛑 Shutting down system...")
        
        # Shutdown
        await scheduler.stop()
        await initializer.shutdown()
        
        print("✅ System shutdown complete")
        
    except Exception as e:
        print(f"\n❌ Failed to start system: {e}")
        logging.exception("System startup failed")
        sys.exit(1)


if __name__ == "__main__":
    # Fix encoding for Windows console
    import sys
    import io
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    
    # Setup basic logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Run main
    asyncio.run(main())

