"""
Transaction Manager
transaction-manager.py

مدير المعاملات - إدارة المعاملات في قواعد البيانات
Transaction Manager - Manages database transactions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Callable
from datetime import datetime
from enum import Enum
from contextlib import asynccontextmanager
from dataclasses import dataclass

logger = logging.getLogger(__name__)


class TransactionStatus(Enum):
    """حالة المعاملة"""
    PENDING = "pending"
    COMMITTED = "committed"
    ROLLED_BACK = "rolled_back"
    FAILED = "failed"


@dataclass
class Transaction:
    """معاملة"""
    id: str
    operations: List[Dict]
    status: TransactionStatus
    started_at: datetime
    committed_at: Optional[datetime] = None
    error: Optional[str] = None


class TransactionManager:
    """
    مدير المعاملات
    يدير المعاملات في قواعد البيانات المختلفة
    """
    
    def __init__(self):
        """تهيئة مدير المعاملات"""
        self.name = "Transaction Manager"
        self.version = "1.0.0"
        self.transactions: Dict[str, Transaction] = {}
        self.active_transactions: Dict[str, Any] = {}
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    @asynccontextmanager
    async def transaction(self, transaction_id: Optional[str] = None):
        """
        سياق معاملة
        
        Usage:
            async with transaction_manager.transaction() as txn:
                await txn.execute("INSERT INTO users ...")
                await txn.execute("UPDATE accounts ...")
        """
        if transaction_id is None:
            transaction_id = f"txn_{datetime.now().timestamp()}"
        
        transaction = Transaction(
            id=transaction_id,
            operations=[],
            status=TransactionStatus.PENDING,
            started_at=datetime.now()
        )
        
        self.transactions[transaction_id] = transaction
        
        try:
            # بدء المعاملة
            logger.info(f"بدء معاملة: {transaction_id}")
            
            # إنشاء كائن معاملة
            txn_obj = TransactionContext(transaction_id, self)
            self.active_transactions[transaction_id] = txn_obj
            
            yield txn_obj
            
            # تأكيد المعاملة
            transaction.status = TransactionStatus.COMMITTED
            transaction.committed_at = datetime.now()
            logger.info(f"✅ تم تأكيد المعاملة: {transaction_id}")
            
        except Exception as e:
            # التراجع عن المعاملة
            transaction.status = TransactionStatus.ROLLED_BACK
            transaction.error = str(e)
            logger.error(f"❌ تم التراجع عن المعاملة {transaction_id}: {e}")
            raise
        finally:
            if transaction_id in self.active_transactions:
                del self.active_transactions[transaction_id]
    
    async def commit(self, transaction_id: str) -> bool:
        """
        تأكيد معاملة
        
        Args:
            transaction_id: معرف المعاملة
            
        Returns:
            bool: True إذا نجح التأكيد
        """
        if transaction_id not in self.transactions:
            logger.error(f"المعاملة غير موجودة: {transaction_id}")
            return False
        
        transaction = self.transactions[transaction_id]
        
        try:
            # تنفيذ جميع العمليات
            for operation in transaction.operations:
                await self._execute_operation(operation)
            
            transaction.status = TransactionStatus.COMMITTED
            transaction.committed_at = datetime.now()
            logger.info(f"✅ تم تأكيد المعاملة: {transaction_id}")
            return True
            
        except Exception as e:
            transaction.status = TransactionStatus.FAILED
            transaction.error = str(e)
            logger.error(f"❌ فشل في تأكيد المعاملة {transaction_id}: {e}")
            return False
    
    async def rollback(self, transaction_id: str) -> bool:
        """
        التراجع عن معاملة
        
        Args:
            transaction_id: معرف المعاملة
            
        Returns:
            bool: True إذا نجح التراجع
        """
        if transaction_id not in self.transactions:
            logger.error(f"المعاملة غير موجودة: {transaction_id}")
            return False
        
        transaction = self.transactions[transaction_id]
        transaction.status = TransactionStatus.ROLLED_BACK
        logger.info(f"✅ تم التراجع عن المعاملة: {transaction_id}")
        return True
    
    async def _execute_operation(self, operation: Dict):
        """تنفيذ عملية"""
        # سيتم تنفيذها حسب نوع العملية
        pass
    
    def get_transaction(self, transaction_id: str) -> Optional[Transaction]:
        """
        الحصول على معاملة
        
        Args:
            transaction_id: معرف المعاملة
            
        Returns:
            Transaction أو None
        """
        return self.transactions.get(transaction_id)
    
    def get_stats(self) -> Dict:
        """الحصول على الإحصائيات"""
        return {
            "total_transactions": len(self.transactions),
            "committed": sum(1 for t in self.transactions.values() if t.status == TransactionStatus.COMMITTED),
            "rolled_back": sum(1 for t in self.transactions.values() if t.status == TransactionStatus.ROLLED_BACK),
            "failed": sum(1 for t in self.transactions.values() if t.status == TransactionStatus.FAILED),
            "active": len(self.active_transactions)
        }


class TransactionContext:
    """سياق المعاملة"""
    
    def __init__(self, transaction_id: str, manager: TransactionManager):
        self.transaction_id = transaction_id
        self.manager = manager
        self.operations: List[Dict] = []
    
    async def execute(self, operation: str, params: Optional[Dict] = None):
        """
        تنفيذ عملية في المعاملة
        
        Args:
            operation: العملية
            params: المعاملات
        """
        self.operations.append({
            "operation": operation,
            "params": params,
            "timestamp": datetime.now()
        })
        
        if self.transaction_id in self.manager.transactions:
            self.manager.transactions[self.transaction_id].operations = self.operations


if __name__ == "__main__":
    async def main():
        manager = TransactionManager()
        
        # مثال على استخدام المعاملة
        async with manager.transaction("test_txn") as txn:
            await txn.execute("INSERT INTO users (name) VALUES ($1)", {"name": "Test"})
            await txn.execute("UPDATE accounts SET balance = balance - 100 WHERE user_id = $1", {"user_id": 1})
        
        stats = manager.get_stats()
        print(f"\n📊 إحصائيات المعاملات:")
        print(f"  إجمالي: {stats['total_transactions']}")
        print(f"  المؤكدة: {stats['committed']}")
    
    asyncio.run(main())
