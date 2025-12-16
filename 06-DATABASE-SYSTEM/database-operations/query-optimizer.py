"""
Query Optimizer
query-optimizer.py

محسن الاستعلامات - تحسين أداء استعلامات قاعدة البيانات
Query Optimizer - Optimizes database query performance

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import logging
import re
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class QueryAnalysis:
    """تحليل الاستعلام"""
    query: str
    execution_time: float
    rows_returned: int
    indexes_used: List[str]
    suggestions: List[str]
    is_optimized: bool = False


class QueryOptimizer:
    """
    محسن الاستعلامات
    يحلل ويحسن استعلامات قاعدة البيانات
    """
    
    def __init__(self):
        """تهيئة محسن الاستعلامات"""
        self.name = "Query Optimizer"
        self.version = "1.0.0"
        self.query_cache: Dict[str, QueryAnalysis] = {}
        self.slow_query_threshold: float = 1.0  # ثانية
        
        logger.info(f"تم تهيئة {self.name} v{self.version}")
    
    def analyze_query(self, query: str) -> QueryAnalysis:
        """
        تحليل استعلام
        
        Args:
            query: الاستعلام SQL
            
        Returns:
            QueryAnalysis: تحليل الاستعلام
        """
        query_normalized = self._normalize_query(query)
        
        # التحقق من الكاش
        if query_normalized in self.query_cache:
            return self.query_cache[query_normalized]
        
        analysis = QueryAnalysis(
            query=query,
            execution_time=0.0,
            rows_returned=0,
            indexes_used=[],
            suggestions=[]
        )
        
        # تحليل الاستعلام
        suggestions = []
        
        # 1. التحقق من SELECT *
        if re.search(r'SELECT\s+\*', query, re.IGNORECASE):
            suggestions.append("تجنب استخدام SELECT * - حدد الأعمدة المطلوبة فقط")
        
        # 2. التحقق من عدم وجود WHERE
        if re.search(r'SELECT.*FROM', query, re.IGNORECASE) and not re.search(r'WHERE', query, re.IGNORECASE):
            if not re.search(r'LIMIT', query, re.IGNORECASE):
                suggestions.append("أضف شرط WHERE أو LIMIT لتقليل عدد الصفوف")
        
        # 3. التحقق من JOIN بدون فهارس
        if re.search(r'JOIN', query, re.IGNORECASE):
            suggestions.append("تأكد من وجود فهارس على أعمدة JOIN")
        
        # 4. التحقق من ORDER BY بدون فهرس
        order_by_match = re.search(r'ORDER\s+BY\s+(\w+)', query, re.IGNORECASE)
        if order_by_match:
            column = order_by_match.group(1)
            suggestions.append(f"فكر في إنشاء فهرس على العمود {column} المستخدم في ORDER BY")
        
        # 5. التحقق من LIKE بدون فهرس
        if re.search(r'LIKE\s+[\'"]%', query, re.IGNORECASE):
            suggestions.append("استخدام LIKE '%...' يمنع استخدام الفهارس - استخدم LIKE '...%' إذا أمكن")
        
        # 6. التحقق من GROUP BY
        if re.search(r'GROUP\s+BY', query, re.IGNORECASE):
            suggestions.append("تأكد من وجود فهارس على أعمدة GROUP BY")
        
        analysis.suggestions = suggestions
        self.query_cache[query_normalized] = analysis
        
        return analysis
    
    def optimize_query(self, query: str) -> str:
        """
        تحسين استعلام
        
        Args:
            query: الاستعلام الأصلي
            
        Returns:
            str: الاستعلام المحسن
        """
        optimized = query
        
        # 1. إزالة المسافات الزائدة
        optimized = re.sub(r'\s+', ' ', optimized).strip()
        
        # 2. إضافة LIMIT إذا لم يكن موجوداً في SELECT بسيط
        if re.match(r'SELECT.*FROM.*WHERE', optimized, re.IGNORECASE) and not re.search(r'LIMIT', optimized, re.IGNORECASE):
            if not re.search(r'(GROUP|ORDER|UNION)', optimized, re.IGNORECASE):
                optimized += " LIMIT 1000"
                logger.info("تم إضافة LIMIT تلقائياً")
        
        return optimized
    
    def suggest_indexes(self, query: str) -> List[Dict[str, str]]:
        """
        اقتراح فهارس
        
        Args:
            query: الاستعلام
            
        Returns:
            list: قائمة الفهارس المقترحة
        """
        indexes = []
        
        # استخراج أعمدة WHERE
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|$)', query, re.IGNORECASE)
        if where_match:
            where_clause = where_match.group(1)
            columns = re.findall(r'(\w+)\s*[=<>]', where_clause)
            for col in columns:
                indexes.append({
                    "table": self._extract_table_name(query),
                    "column": col,
                    "type": "BTREE",
                    "reason": "يستخدم في WHERE"
                })
        
        # استخراج أعمدة JOIN
        join_matches = re.finditer(r'JOIN\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)', query, re.IGNORECASE)
        for match in join_matches:
            table1, col1, table2, col2 = match.group(2), match.group(3), match.group(4), match.group(5)
            indexes.append({
                "table": table1,
                "column": col1,
                "type": "BTREE",
                "reason": "يستخدم في JOIN"
            })
            indexes.append({
                "table": table2,
                "column": col2,
                "type": "BTREE",
                "reason": "يستخدم في JOIN"
            })
        
        # استخراج أعمدة ORDER BY
        order_match = re.search(r'ORDER\s+BY\s+(\w+)', query, re.IGNORECASE)
        if order_match:
            col = order_match.group(1)
            indexes.append({
                "table": self._extract_table_name(query),
                "column": col,
                "type": "BTREE",
                "reason": "يستخدم في ORDER BY"
            })
        
        return indexes
    
    def _normalize_query(self, query: str) -> str:
        """تطبيع الاستعلام"""
        # إزالة المسافات الزائدة
        normalized = re.sub(r'\s+', ' ', query).strip()
        # تحويل إلى أحرف صغيرة
        normalized = normalized.lower()
        # إزالة القيم
        normalized = re.sub(r'[\'"][^\'"]*[\'"]', '?', normalized)
        normalized = re.sub(r'\d+', '?', normalized)
        return normalized
    
    def _extract_table_name(self, query: str) -> str:
        """استخراج اسم الجدول"""
        match = re.search(r'FROM\s+(\w+)', query, re.IGNORECASE)
        if match:
            return match.group(1)
        return "unknown"
    
    def log_slow_query(self, query: str, execution_time: float):
        """
        تسجيل استعلام بطيء
        
        Args:
            query: الاستعلام
            execution_time: وقت التنفيذ
        """
        if execution_time > self.slow_query_threshold:
            logger.warning(f"⚠️ استعلام بطيء ({execution_time:.2f}s): {query[:100]}")
            analysis = self.analyze_query(query)
            if analysis.suggestions:
                logger.info(f"💡 اقتراحات التحسين: {', '.join(analysis.suggestions[:3])}")
    
    def get_stats(self) -> Dict:
        """الحصول على الإحصائيات"""
        return {
            "cached_queries": len(self.query_cache),
            "slow_query_threshold": self.slow_query_threshold
        }


if __name__ == "__main__":
    optimizer = QueryOptimizer()
    
    # مثال على تحليل استعلام
    query = "SELECT * FROM users WHERE email = 'test@example.com' ORDER BY created_at"
    analysis = optimizer.analyze_query(query)
    
    print(f"\n📊 تحليل الاستعلام:")
    print(f"  الاستعلام: {query}")
    print(f"  الاقتراحات: {analysis.suggestions}")
    
    # اقتراح فهارس
    indexes = optimizer.suggest_indexes(query)
    print(f"\n📑 الفهارس المقترحة:")
    for idx in indexes:
        print(f"  - {idx['table']}.{idx['column']} ({idx['reason']})")
