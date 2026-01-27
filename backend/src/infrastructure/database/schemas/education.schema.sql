-- Education Module Schema
-- Version: 1.0.0
-- Law: Foreign Key Constraints & JSONB for flexible metadata

-- 1. Enums
CREATE TYPE lesson_status AS ENUM ('DRAFT', 'GENERATING_AI', 'REVIEW_REQUIRED', 'PUBLISHED');
CREATE TYPE education_level AS ENUM (
    'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 
    'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12'
);

-- 2. Educational Tracks (The Root)
CREATE TABLE educational_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL, -- FK to users table (implies teacher existence)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level education_level NOT NULL,
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for teacher's dashboard performance
CREATE INDEX idx_tracks_teacher ON educational_tracks(teacher_id);
CREATE INDEX idx_tracks_level_subject ON educational_tracks(level, subject);

-- 3. Educational Units (The Container)
CREATE TABLE educational_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES educational_tracks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    topics TEXT[] DEFAULT '{}', -- Array of strings for AI context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_units_track ON educational_units(track_id);

-- 4. Educational Lessons (The Content)
CREATE TABLE educational_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES educational_units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT DEFAULT '', -- Markdown/HTML content
    status lesson_status DEFAULT 'DRAFT',
    ai_metadata JSONB DEFAULT NULL, -- Stores { model, promptUsed, tokens, version }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lessons_unit ON educational_lessons(unit_id);
CREATE INDEX idx_lessons_status ON educational_lessons(status);

-- 5. Helper Function for Updating Timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_tracks_timestamp BEFORE UPDATE ON educational_tracks FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_units_timestamp BEFORE UPDATE ON educational_units FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_lessons_timestamp BEFORE UPDATE ON educational_lessons FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
