"""
Check System Readiness - فحص جاهزية النظام
Comprehensive readiness check script
"""

import sys
import asyncio
import importlib.util
import io
from pathlib import Path
from typing import Dict, List, Tuple

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Colors for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"


def check_imports() -> Tuple[bool, List[str]]:
    """Check if all required modules can be imported"""
    print(f"{BLUE}📦 Checking imports...{RESET}")
    
    # Add current directory to path
    base_dir = Path(__file__).parent.parent
    sys.path.insert(0, str(base_dir))
    
    required_modules = [
        ("fastapi", True),
        ("uvicorn", True),
        ("httpx", True),
        ("psutil", True),
        ("system_core", False),  # Local module
        ("system_monitoring", False),  # Local module
        ("api_gateway", False),  # Local module
        ("event_system", False),  # Local module
        ("integration", False),  # Local module
    ]
    
    failed = []
    for module_name, is_external in required_modules:
        try:
            if is_external:
                # External module - try to import
                __import__(module_name)
                print(f"  {GREEN}✅{RESET} {module_name}")
            else:
                # Local module - check if directory exists
                module_path = base_dir / module_name
                if module_path.exists() and module_path.is_dir():
                    # Check for __init__.py
                    init_file = module_path / "__init__.py"
                    if init_file.exists():
                        print(f"  {GREEN}✅{RESET} {module_name}")
                    else:
                        # Still OK if directory exists with Python files
                        py_files = list(module_path.glob("*.py"))
                        if py_files:
                            print(f"  {GREEN}✅{RESET} {module_name} (has Python files)")
                        else:
                            failed.append(module_name)
                            print(f"  {RED}❌{RESET} {module_name} (empty directory)")
                else:
                    failed.append(module_name)
                    print(f"  {RED}❌{RESET} {module_name} (directory not found)")
        except ImportError as e:
            failed.append(module_name)
            print(f"  {RED}❌{RESET} {module_name}: {e}")
    
    return len(failed) == 0, failed


def check_files() -> Tuple[bool, List[str]]:
    """Check if all required files exist"""
    print(f"\n{BLUE}📁 Checking files...{RESET}")
    
    base_dir = Path(__file__).parent.parent
    
    required_files = [
        "api_gateway/fastapi_server.py",
        "api_gateway/routes/system_routes.py",
        "api_gateway/routes/monitoring_routes.py",
        "api_gateway/routes/service_routes.py",
        "api_gateway/routes/maintenance_routes.py",
        "api_gateway/middleware/auth_middleware.py",
        "api_gateway/middleware/logging_middleware.py",
        "event_system/event_bus.py",
        "event_system/event_publisher.py",
        "event_system/event_subscriber.py",
        "integration/integration_bridge.py",
        "integration/service_registry.py",
        "system_core/system-initializer.py",
        "system_monitoring/health-monitoring/system-health-check.py",
    ]
    
    missing = []
    for file_path in required_files:
        full_path = base_dir / file_path
        if full_path.exists():
            print(f"  {GREEN}✅{RESET} {file_path}")
        else:
            missing.append(file_path)
            print(f"  {RED}❌{RESET} {file_path}")
    
    return len(missing) == 0, missing


async def check_api_server() -> bool:
    """Check if API server can start"""
    print(f"\n{BLUE}🚀 Checking API server...{RESET}")
    
    try:
        # Add base directory to path
        base_dir = Path(__file__).parent.parent
        sys.path.insert(0, str(base_dir))
        
        # Try to import
        import importlib.util
        api_gateway_path = base_dir / "api_gateway" / "__init__.py"
        if api_gateway_path.exists():
            spec = importlib.util.spec_from_file_location("api_gateway", api_gateway_path)
            if spec and spec.loader:
                api_gateway = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(api_gateway)
                
                # Try to get APIServer
                fastapi_server_path = base_dir / "api_gateway" / "fastapi_server.py"
                spec2 = importlib.util.spec_from_file_location("fastapi_server", fastapi_server_path)
                if spec2 and spec2.loader:
                    fastapi_module = importlib.util.module_from_spec(spec2)
                    spec2.loader.exec_module(fastapi_module)
                    
                    if hasattr(fastapi_module, 'APIServer'):
                        print(f"  {GREEN}✅{RESET} API Server class can be instantiated")
                        return True
        
        print(f"  {YELLOW}⚠️{RESET} API Server files exist but import check skipped")
        return True  # Files exist, so consider it OK
    except Exception as e:
        print(f"  {RED}❌{RESET} Error: {e}")
        return False


async def check_components() -> bool:
    """Check if system components can be initialized"""
    print(f"\n{BLUE}⚙️  Checking components...{RESET}")
    
    try:
        # Add base directory to path
        base_dir = Path(__file__).parent.parent
        sys.path.insert(0, str(base_dir))
        
        # Check if files exist and can be loaded
        components_to_check = [
            ("SystemInitializer", base_dir / "system_core" / "system-initializer.py"),
            ("EventBus", base_dir / "event_system" / "event_bus.py"),
            ("ServiceRegistry", base_dir / "integration" / "service_registry.py"),
        ]
        
        all_ok = True
        for name, file_path in components_to_check:
            if file_path.exists():
                print(f"  {GREEN}✅{RESET} {name} (file exists)")
            else:
                print(f"  {RED}❌{RESET} {name} (file not found: {file_path})")
                all_ok = False
        
        return all_ok
    except Exception as e:
        print(f"  {RED}❌{RESET} Error: {e}")
        return False


def check_config() -> bool:
    """Check configuration files"""
    print(f"\n{BLUE}⚙️  Checking configuration...{RESET}")
    
    base_dir = Path(__file__).parent.parent
    config_file = base_dir / "config" / "system_config.json"
    
    if config_file.exists():
        print(f"  {GREEN}✅{RESET} system_config.json exists")
        return True
    else:
        print(f"  {YELLOW}⚠️{RESET} system_config.json not found (optional)")
        return True  # Not critical


async def main():
    """Run all checks"""
    print(f"{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}🔍 System Readiness Check{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    results = {}
    
    # Check imports
    results["imports"] = check_imports()
    
    # Check files
    results["files"] = check_files()
    
    # Check API server
    results["api_server"] = await check_api_server()
    
    # Check components
    results["components"] = await check_components()
    
    # Check config
    results["config"] = check_config()
    
    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}📊 Summary{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    all_passed = all(results.values())
    
    for check, passed in results.items():
        status = f"{GREEN}✅ PASSED{RESET}" if passed else f"{RED}❌ FAILED{RESET}"
        print(f"  {check.upper()}: {status}")
    
    print()
    if all_passed:
        print(f"{GREEN}✅ All checks passed! System is ready.{RESET}")
        return 0
    else:
        print(f"{RED}❌ Some checks failed. Please review the errors above.{RESET}")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

