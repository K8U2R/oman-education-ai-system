#!/bin/bash

# Fix Routes (Implicit Index Issue)
echo "Fixing Routes..."
sed -i "s|import('@/presentation/pages/learning/LessonsPage')|import('@/presentation/pages/learning/LessonsPage/LessonsPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/LessonDetailPage')|import('@/presentation/pages/learning/LessonDetailPage/LessonDetailPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentsPage')|import('@/presentation/pages/learning/AssessmentsPage/AssessmentsPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentDetailPage')|import('@/presentation/pages/learning/AssessmentDetailPage/AssessmentDetailPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentTakePage')|import('@/presentation/pages/learning/AssessmentTakePage/AssessmentTakePage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentResultsPage')|import('@/presentation/pages/learning/AssessmentResultsPage/AssessmentResultsPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentFormPage')|import('@/presentation/pages/learning/AssessmentFormPage/AssessmentFormPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx

sed -i "s|import('@/presentation/pages/tools/StoragePage')|import('@/presentation/pages/tools/Storage/Storage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx
sed -i "s|import('@/presentation/pages/tools/StorageBrowserPage')|import('@/presentation/pages/tools/StorageBrowser/StorageBrowser')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/student/student.routes.tsx

sed -i "s|import('@/presentation/pages/learning/LessonsPage')|import('@/presentation/pages/learning/LessonsPage/LessonsPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/teacher/teacher.routes.tsx
sed -i "s|import('@/presentation/pages/learning/AssessmentFormPage')|import('@/presentation/pages/learning/AssessmentFormPage/AssessmentFormPage')|g" /root/oman-education-ai-system/apps/frontend/src/presentation/routing/definitions/teacher/teacher.routes.tsx

# Fix Settings Components (Moved from components/settings to pages/user/settings/components)
echo "Fixing Settings Components..."
SETTINGS_COMPONENTS="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/user/settings/components"
sed -i "s|from '../common'|from '@/presentation/components/common'|g" $SETTINGS_COMPONENTS/*.tsx
sed -i "s|from '../../common'|from '@/presentation/components/common'|g" $SETTINGS_COMPONENTS/*.tsx
sed -i "s|from '../../../common'|from '@/presentation/components/common'|g" $SETTINGS_COMPONENTS/*.tsx

# Fix Lesson Detail Page Components (Nested deeper)
echo "Fixing Lesson Detail Components..."
LESSON_COMPONENTS="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/learning/LessonDetailPage/components"
find $LESSON_COMPONENTS -name "*.tsx" -exec sed -i "s|from '@/presentation/components/common'|from '@/presentation/components/common'|g" {} +
# Fix relative imports that became deeper
find $LESSON_COMPONENTS -name "*.tsx" -exec sed -i "s|from '../../hooks|from '../../core|g" {} + 
find $LESSON_COMPONENTS -name "*.tsx" -exec sed -i "s|from '../hooks|from '../../core|g" {} +

# Fix Tools Imports
echo "Fixing Tools Imports..."
TOOLS_DIR="/root/oman-education-ai-system/apps/frontend/src/presentation/pages/tools"
find $TOOLS_DIR -name "*.tsx" -exec sed -i "s|from '@/presentation/components/common'|from '@/presentation/components/common'|g" {} +

echo "Fixes applied."
