/**
 * Common Types
 * أنواع مشتركة للوحدة
 */

// Function Types
export type AnyFunction = (...args: unknown[]) => unknown;
export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>;
export type FunctionWithReturn<T> = (...args: unknown[]) => T;
export type AsyncFunctionWithReturn<T> = (...args: unknown[]) => Promise<T>;

// Object Types
export type AnyObject = Record<string, unknown>;
export type StringRecord = Record<string, string>;
export type NumberRecord = Record<string, number>;
export type BooleanRecord = Record<string, boolean>;

// Array Types
export type AnyArray = unknown[];
export type StringArray = string[];
export type NumberArray = number[];

// Component Types
export type ComponentProps = Record<string, unknown>;
export type ComponentState = Record<string, unknown>;

// Generic Types
export type Optional<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

