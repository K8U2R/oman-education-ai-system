/**
 * Schema validation للرسائل
 */
export interface MessageSchema {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
  editedAt?: string | Date;
  isEdited?: boolean;
  originalContent?: string;
}

/**
 * Schema validation لجلسة المحادثة
 */
export interface ChatSessionSchema {
  id: string;
  title: string;
  messages: MessageSchema[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * نتيجة التحقق
 */
export interface ValidationResult<T = unknown> {
  valid: boolean;
  error?: string;
  sanitized?: T;
}

/**
 * التحقق من صحة رسالة
 */
export function validateMessage(data: unknown): ValidationResult<MessageSchema> {
  // التحقق من وجود البيانات
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: البيانات فارغة أو غير صالحة',
    };
  }

  // التحقق من ID
  if (typeof data.id !== 'string' || data.id.length === 0) {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: معرف الرسالة غير صالح',
    };
  }

  // التحقق من Role
  if (!['user', 'assistant'].includes(data.role)) {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: نوع الرسالة غير صالح',
    };
  }

  // التحقق من Content
  if (typeof data.content !== 'string') {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: محتوى الرسالة غير صالح',
    };
  }

  // التحقق من الطول
  if (data.content.length > 100000) {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: المحتوى طويل جداً (أكثر من 100,000 حرف)',
    };
  }

  if (data.content.length === 0) {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: المحتوى فارغ',
    };
  }

  // التحقق من Timestamp
  if (!data.timestamp) {
    return {
      valid: false,
      error: 'الرسالة غير صحيحة: تاريخ الرسالة غير موجود',
    };
  }

  // تنظيف البيانات
  const sanitized: MessageSchema = {
    id: String(data.id).trim(),
    role: data.role,
    content: String(data.content).trim(),
    timestamp: data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp),
  };

  // إضافة الحقول الاختيارية إذا كانت موجودة
  if (data.editedAt) {
    sanitized.editedAt = data.editedAt instanceof Date ? data.editedAt : new Date(data.editedAt);
  }

  if (typeof data.isEdited === 'boolean') {
    sanitized.isEdited = data.isEdited;
  }

  if (data.originalContent && typeof data.originalContent === 'string') {
    sanitized.originalContent = String(data.originalContent).trim();
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * التحقق من صحة جلسة محادثة
 */
export function validateSession(data: unknown): ValidationResult<ChatSessionSchema> {
  // التحقق من وجود البيانات
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'الجلسة غير صحيحة: البيانات فارغة أو غير صالحة',
    };
  }

  // التحقق من ID
  if (typeof data.id !== 'string' || data.id.length === 0) {
    return {
      valid: false,
      error: 'الجلسة غير صحيحة: معرف الجلسة غير صالح',
    };
  }

  // التحقق من Title
  if (typeof data.title !== 'string') {
    return {
      valid: false,
      error: 'الجلسة غير صحيحة: عنوان الجلسة غير صالح',
    };
  }

  // التحقق من Messages
  if (!Array.isArray(data.messages)) {
    return {
      valid: false,
      error: 'الجلسة غير صحيحة: قائمة الرسائل غير صالحة',
    };
  }

  // التحقق من عدد الرسائل
  if (data.messages.length > 1000) {
    return {
      valid: false,
      error: 'الجلسة غير صحيحة: عدد الرسائل كبير جداً (أكثر من 1000)',
    };
  }

  // التحقق من جميع الرسائل
  const validatedMessages: MessageSchema[] = [];
  for (let i = 0; i < data.messages.length; i++) {
    const msgValidation = validateMessage(data.messages[i]);
    if (!msgValidation.valid) {
      return {
        valid: false,
        error: `الجلسة غير صحيحة: رسالة رقم ${i + 1} غير صالحة - ${msgValidation.error}`,
      };
    }
    if (msgValidation.sanitized) {
      validatedMessages.push(msgValidation.sanitized);
    }
  }

  // تنظيف البيانات
  const sanitized: ChatSessionSchema = {
    id: String(data.id).trim(),
    title: String(data.title).trim().substring(0, 200), // حد أقصى 200 حرف
    messages: validatedMessages,
    createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt),
  };

  return {
    valid: true,
    sanitized,
  };
}

/**
 * تنظيف البيانات التالفة
 * 
 * يحاول إصلاح البيانات التالفة قدر الإمكان
 */
export function sanitizeSession(data: unknown): ChatSessionSchema | null {
  const validation = validateSession(data);
  
  if (validation.valid && validation.sanitized) {
    return validation.sanitized as ChatSessionSchema;
  }

  // محاولة إصلاح البيانات
  console.warn('بيانات جلسة تالفة، محاولة إصلاحها...', validation.error);

  try {
    // محاولة إصلاح أساسي
    const fixed: ChatSessionSchema = {
      id: data.id || `session-${Date.now()}`,
      title: data.title || 'محادثة غير معروفة',
      messages: Array.isArray(data.messages)
        ? data.messages
            .map((msg: unknown) => {
              const msgValidation = validateMessage(msg);
              return msgValidation.sanitized || null;
            })
            .filter((msg): msg is MessageSchema => msg !== null)
        : [],
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };

    // التحقق من البيانات المُصلحة
    const fixedValidation = validateSession(fixed);
    if (fixedValidation.valid && fixedValidation.sanitized) {
      console.info('تم إصلاح البيانات بنجاح');
      return fixedValidation.sanitized as ChatSessionSchema;
    }
  } catch (error) {
    console.error('فشل إصلاح البيانات:', error);
  }

  return null;
}

/**
 * التحقق من صحة قائمة الجلسات
 */
export function validateSessions(data: unknown): ValidationResult<ChatSessionSchema[]> {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      error: 'قائمة الجلسات غير صحيحة: البيانات ليست مصفوفة',
    };
  }

  if (data.length > 100) {
    return {
      valid: false,
      error: 'قائمة الجلسات غير صحيحة: عدد الجلسات كبير جداً (أكثر من 100)',
    };
  }

  const validatedSessions: ChatSessionSchema[] = [];
  for (let i = 0; i < data.length; i++) {
    const sessionValidation = validateSession(data[i]);
    if (!sessionValidation.valid) {
      return {
        valid: false,
        error: `قائمة الجلسات غير صحيحة: جلسة رقم ${i + 1} غير صالحة - ${sessionValidation.error}`,
      };
    }
    if (sessionValidation.sanitized) {
      validatedSessions.push(sessionValidation.sanitized as ChatSessionSchema);
    }
  }

  return {
    valid: true,
    sanitized: validatedSessions,
  };
}

