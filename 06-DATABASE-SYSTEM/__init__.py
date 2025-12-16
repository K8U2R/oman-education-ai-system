"""
Database System
06-DATABASE-SYSTEM

نظام قاعدة البيانات المتكامل
Integrated Database System

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import sys
from pathlib import Path
import importlib.util

__version__ = "1.0.0"
__author__ = "Oman Education AI System"

# Base path
_base_path = Path(__file__).parent

# Helper function to load modules with hyphens
def _load_module(module_name, file_path):
    """تحميل وحدة من مسار"""
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    if spec and spec.loader:
        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)
        return module
    return None

# Load core components
try:
    # Relational Databases
    postgres_path = _base_path / "relational-databases" / "postgres-manager.py"
    if postgres_path.exists():
        _postgres_module = _load_module("postgres_manager", postgres_path)
        PostgresManager = _postgres_module.PostgresManager if _postgres_module else None
    else:
        PostgresManager = None
    
    mysql_path = _base_path / "relational-databases" / "mysql-manager.py"
    if mysql_path.exists():
        _mysql_module = _load_module("mysql_manager", mysql_path)
        MySQLManager = _mysql_module.MySQLManager if _mysql_module else None
    else:
        MySQLManager = None
    
    sqlite_path = _base_path / "relational-databases" / "sqlite-manager.py"
    if sqlite_path.exists():
        _sqlite_module = _load_module("sqlite_manager", sqlite_path)
        SQLiteManager = _sqlite_module.SQLiteManager if _sqlite_module else None
    else:
        SQLiteManager = None
    
    # NoSQL Databases
    mongo_path = _base_path / "nosql-databases" / "mongodb-manager.py"
    if mongo_path.exists():
        _mongo_module = _load_module("mongodb_manager", mongo_path)
        MongoDBManager = _mongo_module.MongoDBManager if _mongo_module else None
    else:
        MongoDBManager = None
    
    redis_path = _base_path / "nosql-databases" / "redis-manager.py"
    if redis_path.exists():
        _redis_module = _load_module("redis_manager", redis_path)
        RedisManager = _redis_module.RedisManager if _redis_module else None
    else:
        RedisManager = None
    
    elasticsearch_path = _base_path / "nosql-databases" / "elasticsearch-manager.py"
    if elasticsearch_path.exists():
        _elasticsearch_module = _load_module("elasticsearch_manager", elasticsearch_path)
        ElasticsearchManager = _elasticsearch_module.ElasticsearchManager if _elasticsearch_module else None
    else:
        ElasticsearchManager = None
    
    # Database Operations
    pool_path = _base_path / "database-operations" / "connection-pool.py"
    if pool_path.exists():
        _pool_module = _load_module("connection_pool", pool_path)
        ConnectionPool = _pool_module.ConnectionPool if _pool_module else None
    else:
        ConnectionPool = None
    
    txn_path = _base_path / "database-operations" / "transaction-manager.py"
    if txn_path.exists():
        _txn_module = _load_module("transaction_manager", txn_path)
        TransactionManager = _txn_module.TransactionManager if _txn_module else None
    else:
        TransactionManager = None
    
    optimizer_path = _base_path / "database-operations" / "query-optimizer.py"
    if optimizer_path.exists():
        _optimizer_module = _load_module("query_optimizer", optimizer_path)
        QueryOptimizer = _optimizer_module.QueryOptimizer if _optimizer_module else None
    else:
        QueryOptimizer = None
    
    migration_path = _base_path / "database-operations" / "migration-manager.py"
    if migration_path.exists():
        _migration_module = _load_module("migration_manager", migration_path)
        MigrationManager = _migration_module.MigrationManager if _migration_module else None
    else:
        MigrationManager = None
    
    backup_path = _base_path / "database-operations" / "backup-manager.py"
    if backup_path.exists():
        _backup_module = _load_module("backup_manager", backup_path)
        BackupManager = _backup_module.BackupManager if _backup_module else None
    else:
        BackupManager = None

except Exception as e:
    # Fallback - set to None if loading fails
    PostgresManager = None
    MongoDBManager = None
    RedisManager = None
    ConnectionPool = None
    TransactionManager = None
    QueryOptimizer = None
    MigrationManager = None
    BackupManager = None

__all__ = [
    "PostgresManager",
    "MySQLManager",
    "SQLiteManager",
    "MongoDBManager",
    "RedisManager",
    "ElasticsearchManager",
    "ConnectionPool",
    "TransactionManager",
    "QueryOptimizer",
    "MigrationManager",
    "BackupManager"
]
