#!/bin/bash

echo "Fixing LessonDetail imports..."
LESSON_COMPONENTS="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/learning/LessonDetailPage/components"
find $LESSON_COMPONENTS -name "*.tsx" -exec sed -i "s|useLessonDetailLogic|useLessonDetail|g" {} +

# Fix Tools Imports (Convert relative to absolute to be safe)
echo "Fixing Tools Imports..."
TOOLS_DIR="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/tools"
find $TOOLS_DIR -name "*.tsx" -exec sed -i "s|from '@/presentation/components/common'|from '@/presentation/components/common'|g" {} +
# If they used relative ../../components/common, it's now ../../../components/common.
# But better to replace relative with absolute.
find $TOOLS_DIR -name "*.tsx" -exec sed -i "s|from '../../components|from '@/presentation/components|g" {} +
find $TOOLS_DIR -name "*.tsx" -exec sed -i "s|from '../../../components|from '@/presentation/components|g" {} +

# Fix Teacher Routes
echo "Fixing Teacher Routes..."
sed -i "s|import('@/presentation/pages/learning/LessonsPage')|import('@/presentation/pages/learning/LessonsPage/LessonsPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/teacher/teacher.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentFormPage')|import('@/presentation/pages/learning/AssessmentFormPage/AssessmentFormPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/teacher/teacher.routes.tsx

echo "Fixes v2 applied."
