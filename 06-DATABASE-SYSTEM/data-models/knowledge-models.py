"""
Knowledge Models
knowledge-models.py

نماذج المعرفة - تعريفات نماذج بيانات المعرفة
Knowledge Models - Knowledge data model definitions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class KnowledgeType(Enum):
    """نوع المعرفة"""
    CONCEPT = "concept"
    FACT = "fact"
    RULE = "rule"
    PROCEDURE = "procedure"
    THEORY = "theory"


class KnowledgeSource(Enum):
    """مصدر المعرفة"""
    USER_INPUT = "user_input"
    AI_GENERATED = "ai_generated"
    DOCUMENT = "document"
    WEB = "web"
    DATABASE = "database"


@dataclass
class KnowledgeNode:
    """عقدة معرفة"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    type: KnowledgeType = KnowledgeType.CONCEPT
    description: str = ""
    content: str = ""
    source: KnowledgeSource = KnowledgeSource.USER_INPUT
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type.value,
            "description": self.description,
            "content": self.content,
            "source": self.source.value,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'KnowledgeNode':
        """إنشاء من dict"""
        node = cls()
        node.id = data.get("id", str(uuid.uuid4()))
        node.name = data.get("name", "")
        node.type = KnowledgeType(data.get("type", "concept"))
        node.description = data.get("description", "")
        node.content = data.get("content", "")
        node.source = KnowledgeSource(data.get("source", "user_input"))
        node.metadata = data.get("metadata", {})
        
        if "created_at" in data:
            node.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            node.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return node


@dataclass
class KnowledgeRelation:
    """علاقة معرفة"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    source_id: str = ""
    target_id: str = ""
    relation_type: str = ""  # RELATED_TO, SUBCATEGORY_OF, PREREQUISITE, etc.
    strength: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "source_id": self.source_id,
            "target_id": self.target_id,
            "relation_type": self.relation_type,
            "strength": self.strength,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'KnowledgeRelation':
        """إنشاء من dict"""
        relation = cls()
        relation.id = data.get("id", str(uuid.uuid4()))
        relation.source_id = data.get("source_id", "")
        relation.target_id = data.get("target_id", "")
        relation.relation_type = data.get("relation_type", "")
        relation.strength = data.get("strength", 1.0)
        relation.metadata = data.get("metadata", {})
        
        if "created_at" in data:
            relation.created_at = datetime.fromisoformat(data["created_at"])
        
        return relation


# Neo4j Schema (للرسم البياني المعرفي)
NEO4J_KNOWLEDGE_SCHEMA = """
// إنشاء عقد المعرفة
CREATE CONSTRAINT knowledge_node_id IF NOT EXISTS
FOR (n:KnowledgeNode) REQUIRE n.id IS UNIQUE;

// إنشاء فهارس
CREATE INDEX knowledge_node_name IF NOT EXISTS
FOR (n:KnowledgeNode) ON (n.name);

CREATE INDEX knowledge_node_type IF NOT EXISTS
FOR (n:KnowledgeNode) ON (n.type);

// أمثلة على العلاقات
(:KnowledgeNode {id: "1", name: "الذكاء الاصطناعي"})
-[:RELATED_TO]->
(:KnowledgeNode {id: "2", name: "التعلم الآلي"})
-[:SUBCATEGORY_OF]->
(:KnowledgeNode {id: "3", name: "التكنولوجيا"})
"""

# MongoDB Schema (للمحتوى التفصيلي)
MONGODB_KNOWLEDGE_SCHEMA = {
    "collection": "knowledge_nodes",
    "indexes": [
        {"fields": [("name", 1)]},
        {"fields": [("type", 1)]},
        {"fields": [("source", 1)]},
        {"fields": [("created_at", -1)]}
    ]
}
