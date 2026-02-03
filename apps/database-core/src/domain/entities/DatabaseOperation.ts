/**
 * DatabaseOperation - عملية قاعدة البيانات
 *
 * Entity تمثل عملية على قاعدة البيانات
 */

import { OperationType } from '../value-objects/OperationType'
import { QueryOptions } from '../value-objects/QueryOptions'
import { Actor } from '../value-objects/Actor'

export interface DatabaseOperationParams {
  operation: OperationType
  entity: string
  conditions?: Record<string, unknown>
  payload?: Record<string, unknown>
  actor: Actor | string
  options?: QueryOptions
}

export class DatabaseOperation {
  private readonly operation: OperationType
  private readonly entity: string
  private readonly conditions: Record<string, unknown>
  private readonly payload: Record<string, unknown> | undefined
  private readonly actor: Actor
  private readonly options: QueryOptions | undefined
  private readonly timestamp: Date

  constructor(params: DatabaseOperationParams) {
    // Validate entity
    if (!params.entity || !params.entity.trim()) {
      throw new Error('Entity name is required')
    }

    // Validate operation
    if (!params.operation) {
      throw new Error('Operation type is required')
    }

    // Validate and convert actor
    if (!params.actor) {
      throw new Error('Actor is required')
    }
    this.actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)

    this.operation = params.operation
    this.entity = params.entity.trim()
    this.conditions = params.conditions || {}
    this.payload = params.payload
    this.options = params.options
    this.timestamp = new Date()
  }

  getOperation(): OperationType {
    return this.operation
  }

  getEntity(): string {
    return this.entity
  }

  getConditions(): Record<string, unknown> {
    return { ...this.conditions }
  }

  getPayload(): Record<string, unknown> | undefined {
    return this.payload ? { ...this.payload } : undefined
  }

  getActor(): Actor {
    return this.actor
  }

  getOptions(): QueryOptions | undefined {
    return this.options
  }

  getTimestamp(): Date {
    return new Date(this.timestamp)
  }

  isReadOperation(): boolean {
    return this.operation === OperationType.FIND
  }

  isWriteOperation(): boolean {
    return (
      this.operation === OperationType.INSERT ||
      this.operation === OperationType.UPDATE ||
      this.operation === OperationType.DELETE
    )
  }

  toJSON(): {
    operation: OperationType
    entity: string
    conditions: Record<string, unknown>
    payload?: Record<string, unknown>
    actor: ReturnType<Actor['toJSON']>
    options?: ReturnType<QueryOptions['toJSON']>
    timestamp: string
  } {
    return {
      operation: this.operation,
      entity: this.entity,
      conditions: this.conditions,
      payload: this.payload,
      actor: this.actor.toJSON(),
      options: this.options?.toJSON(),
      timestamp: this.timestamp.toISOString(),
    }
  }
}
