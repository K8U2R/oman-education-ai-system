/**
 * Utility Types - أنواع مساعدة متقدمة
 *
 * Utility Types متقدمة للاستخدام في المشروع
 */

/**
 * Deep Partial - جزئي عميق
 *
 * يجعل جميع الحقول (بما في ذلك المتداخلة) اختيارية
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep Required - مطلوب عميق
 *
 * يجعل جميع الحقول (بما في ذلك المتداخلة) مطلوبة
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Deep Readonly - للقراءة فقط عميق
 *
 * يجعل جميع الحقول (بما في ذلك المتداخلة) للقراءة فقط
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Deep Mutable - قابل للتعديل عميق
 *
 * يجعل جميع الحقول (بما في ذلك المتداخلة) قابلة للتعديل
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

/**
 * Pick By Type - اختيار حسب النوع
 *
 * يختار الحقول من نوع معين
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Omit By Type - حذف حسب النوع
 *
 * يحذف الحقول من نوع معين
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Keys Of Type - مفاتيح من نوع معين
 *
 * يحصل على مفاتيح الحقول من نوع معين
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Values Of Type - قيم من نوع معين
 *
 * يحصل على قيم الحقول من نوع معين
 */
export type ValuesOfType<T, U> = T[KeysOfType<T, U>];

/**
 * Function Keys - مفاتيح الدوال
 *
 * يحصل على مفاتيح الحقول التي هي دوال
 */
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

/**
 * Non Function Keys - مفاتيح غير الدوال
 *
 * يحصل على مفاتيح الحقول التي ليست دوال
 */
export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K;
}[keyof T];

/**
 * Optional Keys - مفاتيح اختيارية
 *
 * يحصل على مفاتيح الحقول الاختيارية
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Required Keys - مفاتيح مطلوبة
 *
 * يحصل على مفاتيح الحقول المطلوبة
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Readonly Keys - مفاتيح للقراءة فقط
 *
 * يحصل على مفاتيح الحقول للقراءة فقط
 */
export type ReadonlyKeys<T> = {
  [K in keyof T]: IfEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] },
    never,
    K
  >;
}[keyof T];

/**
 * If Equals - إذا كان متساوي
 *
 * Utility type للمقارنة
 */
type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

/**
 * Writable Keys - مفاتيح قابلة للكتابة
 *
 * يحصل على مفاتيح الحقول القابلة للكتابة
 */
export type WritableKeys<T> = {
  [K in keyof T]: IfEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] },
    K,
    never
  >;
}[keyof T];

/**
 * Array To Union - تحويل Array إلى Union
 *
 * يحول array type إلى union type
 */
export type ArrayToUnion<T extends readonly unknown[]> = T[number];

/**
 * Union To Intersection - تحويل Union إلى Intersection
 *
 * يحول union type إلى intersection type
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

/**
 * Tuple To Union - تحويل Tuple إلى Union
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * Prettify - تحسين العرض
 *
 * يحسن عرض الأنواع المعقدة في IDE
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & object;

/**
 * Brand - علامة تجارية
 *
 * لإضافة علامة تجارية للنوع (Type Branding)
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Nominal - اسمي
 *
 * لإنشاء أنواع اسمية (Nominal Types)
 */
export type Nominal<T, B> = T & { readonly __nominal: B };

/**
 * Opaque - معتم
 *
 * لإنشاء أنواع معتمة (Opaque Types)
 */
export type Opaque<T, K> = T & { readonly __opaque: K };

/**
 * Awaited - منتظر
 *
 * يحصل على النوع من Promise (مشابه لـ Awaited المدمج لكن مع دعم أعمق)
 */
export type Awaited<T> =
  T extends Promise<infer U>
    ? U extends Promise<infer V>
      ? Awaited<V>
      : U
    : T;

/**
 * Async Return Type - نوع الإرجاع غير المتزامن
 *
 * يحصل على نوع الإرجاع من دالة غير متزامنة
 */
export type AsyncReturnType<
  T extends (...args: unknown[]) => Promise<unknown>,
> = Awaited<ReturnType<T>>;

/**
 * Non Nullable - غير قابل للقيمة null
 *
 * يحذف null و undefined من النوع
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Non Undefined - غير قابل للقيمة undefined
 *
 * يحذف undefined من النوع
 */
export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Non Null - غير قابل للقيمة null
 *
 * يحذف null من النوع
 */
export type NonNull<T> = T extends null ? never : T;

/**
 * Extract Promise - استخراج Promise
 *
 * يستخرج النوع من Promise
 */
export type ExtractPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Unwrap Promise - فك Promise
 *
 * يفك Promise (مشابه لـ Awaited)
 */
export type UnwrapPromise<T> =
  T extends Promise<infer U> ? UnwrapPromise<U> : T;

/**
 * Function Parameters - معاملات الدالة
 *
 * يحصل على معاملات الدالة (مشابه لـ Parameters المدمج)
 */
export type FunctionParameters<T extends (...args: unknown[]) => unknown> =
  Parameters<T>;

/**
 * Function Return - إرجاع الدالة
 *
 * يحصل على نوع الإرجاع من الدالة (مشابه لـ ReturnType المدمج)
 */
export type FunctionReturn<T extends (...args: unknown[]) => unknown> =
  ReturnType<T>;

/**
 * Record Keys - مفاتيح السجل
 *
 * يحصل على مفاتيح Record
 */
export type RecordKeys<T extends Record<string, unknown>> = keyof T;

/**
 * Record Values - قيم السجل
 *
 * يحصل على قيم Record
 */
export type RecordValues<T extends Record<string, unknown>> = T[keyof T];

/**
 * Make Optional - جعل اختياري
 *
 * يجعل حقول محددة اختيارية
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Make Required - جعل مطلوب
 *
 * يجعل حقول محددة مطلوبة
 */
export type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make Readonly - جعل للقراءة فقط
 *
 * يجعل حقول محددة للقراءة فقط
 */
export type MakeReadonly<T, K extends keyof T> = Omit<T, K> &
  Readonly<Pick<T, K>>;

/**
 * Make Mutable - جعل قابل للتعديل
 *
 * يجعل حقول محددة قابلة للتعديل
 */
export type MakeMutable<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P];
};

/**
 * Paths - المسارات
 *
 * يحصل على جميع المسارات في كائن متداخل
 */
export type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/**
 * Path Value - قيمة المسار
 *
 * يحصل على قيمة من مسار معين
 */
export type PathValue<
  T,
  P extends Paths<T>,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Paths<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Type Guard - حارس النوع
 *
 * نوع للـ Type Guard functions
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Predicate - مسند
 *
 * نوع للدوال المسندة
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator - مقارن
 *
 * نوع لدوال المقارنة
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Mapper - محول
 *
 * نوع لدوال التحويل
 */
export type Mapper<T, U> = (value: T) => U;

/**
 * Reducer - مختزل
 *
 * نوع لدوال الاختزال
 */
export type Reducer<T, U> = (
  accumulator: U,
  currentValue: T,
  index: number,
  array: T[],
) => U;
