"""
Project Models
project-models.py

نماذج المشاريع - تعريفات نماذج بيانات المشاريع
Project Models - Project data model definitions

هذا الملف جزء من نظام مساعد ذكي عربي للتعلم والبناء العملي
This file is part of the Oman Education AI System
"""

import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class ProjectStatus(Enum):
    """حالة المشروع"""
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectType(Enum):
    """نوع المشروع"""
    WEB_APP = "web_app"
    MOBILE_APP = "mobile_app"
    API = "api"
    DESKTOP_APP = "desktop_app"
    OTHER = "other"


@dataclass
class ProjectFile:
    """ملف مشروع"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    path: str = ""
    content: str = ""
    file_type: str = ""
    size: int = 0
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "file_type": self.file_type,
            "size": self.size,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


@dataclass
class Project:
    """نموذج مشروع"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    name: str = ""
    description: str = ""
    project_type: ProjectType = ProjectType.OTHER
    status: ProjectStatus = ProjectStatus.DRAFT
    tech_stack: List[str] = field(default_factory=list)
    files: List[ProjectFile] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        """تحويل إلى dict"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "project_type": self.project_type.value,
            "status": self.status.value,
            "tech_stack": self.tech_stack,
            "files": [f.to_dict() for f in self.files],
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Project':
        """إنشاء من dict"""
        project = cls()
        project.id = data.get("id", str(uuid.uuid4()))
        project.user_id = data.get("user_id", "")
        project.name = data.get("name", "")
        project.description = data.get("description", "")
        project.project_type = ProjectType(data.get("project_type", "other"))
        project.status = ProjectStatus(data.get("status", "draft"))
        project.tech_stack = data.get("tech_stack", [])
        project.metadata = data.get("metadata", {})
        
        if "files" in data:
            project.files = [ProjectFile(**f) for f in data["files"]]
        
        if "created_at" in data:
            project.created_at = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            project.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return project


# PostgreSQL Schema (للميتاداتا)
POSTGRES_PROJECT_SCHEMA = """
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) DEFAULT 'other',
    status VARCHAR(50) DEFAULT 'draft',
    tech_stack TEXT[],
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
"""

# MongoDB Schema (للملفات والمحتوى)
MONGODB_PROJECT_SCHEMA = {
    "collection": "project_files",
    "indexes": [
        {"fields": [("project_id", 1), ("path", 1)]},
        {"fields": [("project_id", 1)]}
    ]
}
