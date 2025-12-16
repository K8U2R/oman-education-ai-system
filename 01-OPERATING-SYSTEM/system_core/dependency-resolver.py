"""
Dependency Resolver - محلل التبعيات
Resolves and manages component dependencies
"""

import logging
from typing import Dict, List, Set, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class DependencyStatus(Enum):
    """Dependency status"""
    SATISFIED = "satisfied"
    MISSING = "missing"
    CONFLICT = "conflict"
    CIRCULAR = "circular"


@dataclass
class Dependency:
    """Dependency information"""
    name: str
    version: str
    required: bool = True
    status: DependencyStatus = DependencyStatus.MISSING
    provider: Optional[str] = None


@dataclass
class Component:
    """Component with dependencies"""
    name: str
    version: str
    dependencies: List[Dependency]
    provides: List[str]  # What this component provides


class DependencyResolver:
    """
    Dependency Resolver Class
    Resolves component dependencies and detects conflicts
    """
    
    def __init__(self):
        """Initialize Dependency Resolver"""
        self.logger = logging.getLogger(__name__)
        self.components: Dict[str, Component] = {}
        self.dependency_graph: Dict[str, Set[str]] = {}
        self.providers: Dict[str, List[str]] = {}  # What provides what
        
    def register_component(
        self,
        name: str,
        version: str,
        dependencies: Optional[List[Tuple[str, str, bool]]] = None,
        provides: Optional[List[str]] = None
    ) -> bool:
        """
        Register a component with its dependencies
        
        Args:
            name: Component name
            version: Component version
            dependencies: List of (name, version, required) tuples
            provides: List of services/features this component provides
            
        Returns:
            True if registered successfully
        """
        if name in self.components:
            self.logger.warning(f"Component '{name}' already registered")
            return False
        
        deps = []
        if dependencies:
            for dep_name, dep_version, required in dependencies:
                deps.append(Dependency(
                    name=dep_name,
                    version=dep_version,
                    required=required
                ))
        
        component = Component(
            name=name,
            version=version,
            dependencies=deps,
            provides=provides or []
        )
        
        self.components[name] = component
        
        # Update dependency graph
        self.dependency_graph[name] = {dep.name for dep in deps}
        
        # Update providers
        for provided in component.provides:
            if provided not in self.providers:
                self.providers[provided] = []
            self.providers[provided].append(name)
        
        self.logger.info(f"✅ Registered component: {name} v{version}")
        return True
    
    def resolve_dependencies(self, component_name: str) -> Tuple[bool, List[str], List[str]]:
        """
        Resolve dependencies for a component
        
        Args:
            component_name: Name of component to resolve dependencies for
            
        Returns:
            Tuple of (success, resolved_order, missing_deps)
        """
        if component_name not in self.components:
            self.logger.error(f"Component '{component_name}' not found")
            return False, [], [component_name]
        
        # Check for circular dependencies
        if self._has_circular_dependency(component_name):
            self.logger.error(f"Circular dependency detected for '{component_name}'")
            return False, [], []
        
        # Topological sort to get resolution order
        resolved_order = []
        missing_deps = []
        visited = set()
        temp_visited = set()
        
        def visit(name: str):
            if name in temp_visited:
                raise ValueError(f"Circular dependency involving '{name}'")
            if name in visited:
                return
            
            temp_visited.add(name)
            
            if name not in self.components:
                missing_deps.append(name)
                temp_visited.remove(name)
                return
            
            component = self.components[name]
            for dep in component.dependencies:
                if dep.required:
                    visit(dep.name)
            
            temp_visited.remove(name)
            visited.add(name)
            resolved_order.append(name)
        
        try:
            visit(component_name)
            
            # Check if all dependencies are satisfied
            all_satisfied = len(missing_deps) == 0
            
            if all_satisfied:
                self.logger.info(
                    f"✅ Dependencies resolved for '{component_name}': {resolved_order}"
                )
            else:
                self.logger.warning(
                    f"⚠️ Missing dependencies for '{component_name}': {missing_deps}"
                )
            
            return all_satisfied, resolved_order, missing_deps
            
        except ValueError as e:
            self.logger.error(f"Circular dependency: {e}")
            return False, [], []
    
    def _has_circular_dependency(self, start_component: str) -> bool:
        """Check for circular dependencies"""
        visited = set()
        rec_stack = set()
        
        def has_cycle(component: str) -> bool:
            visited.add(component)
            rec_stack.add(component)
            
            if component not in self.components:
                rec_stack.remove(component)
                return False
            
            component_obj = self.components[component]
            for dep in component_obj.dependencies:
                if dep.name not in visited:
                    if has_cycle(dep.name):
                        return True
                elif dep.name in rec_stack:
                    return True
            
            rec_stack.remove(component)
            return False
        
        return has_cycle(start_component)
    
    def check_dependencies(self, component_name: str) -> Dict[str, DependencyStatus]:
        """
        Check dependency status for a component
        
        Args:
            component_name: Component name
            
        Returns:
            Dictionary of dependency names and their status
        """
        if component_name not in self.components:
            return {}
        
        component = self.components[component_name]
        status_map = {}
        
        for dep in component.dependencies:
            if dep.name in self.components:
                # Check version compatibility (simplified)
                dep_component = self.components[dep.name]
                if self._is_version_compatible(dep.version, dep_component.version):
                    status_map[dep.name] = DependencyStatus.SATISFIED
                    dep.status = DependencyStatus.SATISFIED
                    dep.provider = dep.name
                else:
                    status_map[dep.name] = DependencyStatus.CONFLICT
                    dep.status = DependencyStatus.CONFLICT
            else:
                # Check if provided by another component
                if dep.name in self.providers:
                    providers = self.providers[dep.name]
                    if providers:
                        status_map[dep.name] = DependencyStatus.SATISFIED
                        dep.status = DependencyStatus.SATISFIED
                        dep.provider = providers[0]
                    else:
                        status_map[dep.name] = DependencyStatus.MISSING
                        dep.status = DependencyStatus.MISSING
                else:
                    status_map[dep.name] = DependencyStatus.MISSING
                    dep.status = DependencyStatus.MISSING
        
        return status_map
    
    def _is_version_compatible(self, required: str, available: str) -> bool:
        """
        Check if versions are compatible (simplified)
        
        Args:
            required: Required version
            available: Available version
            
        Returns:
            True if compatible
        """
        # Simple version comparison (can be enhanced)
        # For now, exact match or major version match
        if required == "*" or required == "any":
            return True
        
        required_parts = required.split(".")
        available_parts = available.split(".")
        
        if len(required_parts) > 0 and len(available_parts) > 0:
            # Check major version
            return required_parts[0] == available_parts[0]
        
        return required == available
    
    def get_dependency_tree(self, component_name: str, max_depth: int = 10) -> Dict:
        """
        Get dependency tree for a component
        
        Args:
            component_name: Component name
            max_depth: Maximum depth to traverse
            
        Returns:
            Nested dictionary representing dependency tree
        """
        if component_name not in self.components:
            return {}
        
        def build_tree(name: str, depth: int) -> Dict:
            if depth > max_depth:
                return {"name": name, "depth_limit": True}
            
            if name not in self.components:
                return {"name": name, "status": "missing"}
            
            component = self.components[name]
            tree = {
                "name": name,
                "version": component.version,
                "dependencies": []
            }
            
            for dep in component.dependencies:
                dep_tree = build_tree(dep.name, depth + 1)
                dep_tree["required"] = dep.required
                dep_tree["status"] = dep.status.value
                tree["dependencies"].append(dep_tree)
            
            return tree
        
        return build_tree(component_name, 0)
    
    def get_all_components(self) -> Dict[str, Dict]:
        """Get information about all registered components"""
        return {
            name: {
                "version": component.version,
                "dependencies": [
                    {
                        "name": dep.name,
                        "version": dep.version,
                        "required": dep.required,
                        "status": dep.status.value
                    }
                    for dep in component.dependencies
                ],
                "provides": component.provides
            }
            for name, component in self.components.items()
        }
    
    def find_providers(self, service_name: str) -> List[str]:
        """Find components that provide a service"""
        return self.providers.get(service_name, [])

