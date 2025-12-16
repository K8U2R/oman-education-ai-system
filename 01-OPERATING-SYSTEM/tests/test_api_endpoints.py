"""
Test API Endpoints - اختبار نقاط النهاية
Manual and automated tests for API endpoints
"""

import pytest
import httpx
import asyncio
from typing import Dict, Any


BASE_URL = "http://localhost:8001"


class TestAPIEndpoints:
    """Test suite for API endpoints"""
    
    @pytest.fixture
    def client(self):
        """Create HTTP client"""
        return httpx.AsyncClient(base_url=BASE_URL, timeout=30.0)
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_health_endpoint(self, client):
        """Test health endpoint"""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    @pytest.mark.asyncio
    async def test_system_status(self, client):
        """Test system status endpoint"""
        response = await client.get("/api/v1/system/status")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "initialized" in data
    
    @pytest.mark.asyncio
    async def test_system_health(self, client):
        """Test system health endpoint"""
        response = await client.get("/api/v1/system/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "health_report" in data
    
    @pytest.mark.asyncio
    async def test_system_info(self, client):
        """Test system info endpoint"""
        response = await client.get("/api/v1/system/info")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
    
    @pytest.mark.asyncio
    async def test_monitoring_health(self, client):
        """Test monitoring health endpoint"""
        response = await client.get("/api/v1/monitoring/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_monitoring_performance(self, client):
        """Test monitoring performance endpoint"""
        response = await client.get("/api/v1/monitoring/performance")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_monitoring_resources(self, client):
        """Test monitoring resources endpoint"""
        response = await client.get("/api/v1/monitoring/resources")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_services_list(self, client):
        """Test services list endpoint"""
        response = await client.get("/api/v1/services/list")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "data" in data
    
    @pytest.mark.asyncio
    async def test_processes_list(self, client):
        """Test processes list endpoint"""
        response = await client.get("/api/v1/processes/list")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data


async def manual_test_all_endpoints():
    """Manual test function for all endpoints"""
    print("🧪 Testing all API endpoints...\n")
    
    client = httpx.AsyncClient(base_url=BASE_URL, timeout=30.0)
    
    endpoints = [
        ("GET", "/", "Root endpoint"),
        ("GET", "/health", "Health check"),
        ("GET", "/api/v1/system/status", "System status"),
        ("GET", "/api/v1/system/health", "System health"),
        ("GET", "/api/v1/system/info", "System info"),
        ("GET", "/api/v1/monitoring/health", "Monitoring health"),
        ("GET", "/api/v1/monitoring/performance", "Monitoring performance"),
        ("GET", "/api/v1/monitoring/resources", "Monitoring resources"),
        ("GET", "/api/v1/services/list", "Services list"),
        ("GET", "/api/v1/processes/list", "Processes list"),
    ]
    
    results = {"passed": 0, "failed": 0, "errors": []}
    
    for method, path, description in endpoints:
        try:
            if method == "GET":
                response = await client.get(path)
            else:
                response = await client.request(method, path)
            
            if response.status_code == 200:
                print(f"✅ {description}: {path} - OK")
                results["passed"] += 1
            else:
                print(f"❌ {description}: {path} - Status {response.status_code}")
                results["failed"] += 1
                results["errors"].append(f"{path}: {response.status_code}")
        except Exception as e:
            print(f"❌ {description}: {path} - Error: {e}")
            results["failed"] += 1
            results["errors"].append(f"{path}: {str(e)}")
    
    await client.aclose()
    
    print(f"\n📊 Results: {results['passed']} passed, {results['failed']} failed")
    if results["errors"]:
        print("\n⚠️ Errors:")
        for error in results["errors"]:
            print(f"  - {error}")
    
    return results


if __name__ == "__main__":
    asyncio.run(manual_test_all_endpoints())

