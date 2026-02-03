# نموذج البيانات (Data Model)
**الميزة**: 001-core-learning-platform

## نظرة عامة
تم تصميم هذا النموذج لدعم "الذكاء الاصطناعي كمعلم". يركز على ثلاثة محاور رئيسية:
1. **المحتوى الذكي**: هيكلية مرنة للمسارات التعليمية.
2. **التقييم المستمر**: تتبع دقيق لأداء الطالب.
3. **الذاكرة**: حفظ سياق المحادثات لضمان تجربة تعليمية مخصصة.

## التغييرات المقترحة (Prisma Schema)

### 1. إدارة الاشتراكات (Subscription Management)
فصل منطق الاشتراك عن جدول المستخدم لتمكين التاريخ والسجلات.

```prisma
model subscriptions {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id     String    @db.Uuid
  plan_tier   PlanTier  @default(FREE)
  status      String    @default("active") // active, cancelled, expired
  start_date  DateTime  @default(now()) @db.Timestamptz(6)
  end_date    DateTime? @db.Timestamptz(6)
  
  // Relations
  user        users     @relation(fields: [user_id], references: [id])
  
  @@index([user_id])
}
```

### 2. هيكل التعليم (Learning Structure)
التسلسل الهرمي للمحتوى التعليمي.

```prisma
model courses {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String    @db.VarChar(255)
  slug        String    @unique
  description String?
  level       String    @default("beginner") // beginner, intermediate, advanced
  is_published Boolean  @default(false)
  
  // Relations
  modules     modules[]
  enrollments enrollments[]
  
  created_at  DateTime  @default(now()) @db.Timestamptz(6)
  updated_at  DateTime  @default(now()) @db.Timestamptz(6)
}

model modules {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  course_id   String    @db.Uuid
  title       String    @db.VarChar(255)
  order       Int       @default(0)
  
  // Relations
  course      courses   @relation(fields: [course_id], references: [id])
  lessons     lessons[]
}

model lessons {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  module_id   String    @db.Uuid
  title       String    @db.VarChar(255)
  content     String?   // Markdown content or JSON definitions
  type        String    @default("text") // text, video, interactive
  
  // Relations
  module      modules   @relation(fields: [module_id], references: [id])
}
```

### 3. محرك التقييم (Assessment Engine)
نظام مرن للامتحانات والاختبارات القصيرة.

```prisma
model assessments {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String
  type        String    @default("quiz") // quiz, exam, diagnostic
  passing_score Int     @default(60)
  
  // Content linkage (Polymorphic-like via optional fields)
  lesson_id   String?   @db.Uuid
  course_id   String?   @db.Uuid
  
  questions   questions[]
}

model questions {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  assessment_id String    @db.Uuid
  text          String
  type          String    @default("mcq") // mcq, true_false, code_input
  options       Json?     // For MCQ: ["Option A", "Option B"]
  correct_answer String   // Or JSON for complex answers
  points        Int       @default(1)
  
  assessment    assessments @relation(fields: [assessment_id], references: [id])
}

model user_assessments {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id       String    @db.Uuid
  assessment_id String    @db.Uuid
  score         Int
  status        String    @default("in_progress") // in_progress, completed, failed
  answers       Json?     // Store user answers snapshot
  
  completed_at  DateTime? @db.Timestamptz(6)
}
```

### 4. ذاكرة الذكاء الاصطناعي (AI Memory)
سجل المحادثات للتعلم المخصص.

```prisma
model conversation_threads {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id     String    @db.Uuid
  title       String?
  context     Json?     // Current AI context/state
  
  messages    chat_messages[]
  
  created_at  DateTime  @default(now()) @db.Timestamptz(6)
  updated_at  DateTime  @default(now()) @db.Timestamptz(6)
}

model chat_messages {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  thread_id   String    @db.Uuid
  role        String    // user, assistant, system
  content     String
  
  created_at  DateTime  @default(now()) @db.Timestamptz(6)
  
  thread      conversation_threads @relation(fields: [thread_id], references: [id])
}
```
