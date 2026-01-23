/**
 * DatabaseRequest DTO - Data Transfer Object لطلبات قاعدة البيانات
 *
 * DTO لتمثيل طلبات قاعدة البيانات
 */

import { OperationType } from '../../domain/value-objects/OperationType'
import { QueryOptions } from '../../domain/value-objects/QueryOptions'
import { Actor } from '../../domain/value-objects/Actor'

export interface DatabaseRequestDto {
  operation: OperationType | string
  entity: string
  conditions?: Record<string, unknown>
  payload?: Record<string, unknown>
  actor: string | Actor
  options?: {
    limit?: number
    offset?: number
    orderBy?: { column: string; direction: 'asc' | 'desc' }
  }
}

export class DatabaseRequest {
  private readonly operation: OperationType | string
  private readonly entity: string
  private readonly conditions: Record<string, unknown>
  private readonly payload: Record<string, unknown> | undefined
  private readonly actor: Actor | string
  private readonly options: QueryOptions | undefined

  constructor(dto: DatabaseRequestDto) {
    // Validate entity
    if (!dto.entity || !dto.entity.trim()) {
      throw new Error('Entity name is required')
    }

    // Validate operation
    if (!dto.operation) {
      throw new Error('Operation type is required')
    }

    // Validate actor
    if (!dto.actor) {
      throw new Error('Actor is required')
    }

    this.operation = dto.operation
    this.entity = dto.entity.trim()
    this.conditions = dto.conditions || {}
    this.payload = dto.payload
    this.actor = dto.actor instanceof Actor ? dto.actor : new Actor(dto.actor)
    this.options = dto.options ? new QueryOptions(dto.options) : undefined
  }

  getOperation(): OperationType | string {
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
    return this.actor instanceof Actor ? this.actor : new Actor(this.actor)
  }

  getOptions(): QueryOptions | undefined {
    return this.options
  }

  toJSON(): DatabaseRequestDto {
    return {
      operation: this.operation,
      entity: this.entity,
      conditions: this.conditions,
      payload: this.payload,
      actor: this.actor instanceof Actor ? this.actor.getId() : this.actor,
      options: this.options?.toJSON(),
    }
  }
}
