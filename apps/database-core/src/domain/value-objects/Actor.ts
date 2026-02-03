/**
 * Actor - الفاعل
 *
 * Value Object يمثل المستخدم أو النظام الذي ينفذ العملية
 */

export class Actor {
  private readonly id: string
  private readonly type: 'user' | 'system' | 'service'
  private readonly role?: string
  private readonly permissions?: string[]

  constructor(
    id: string,
    type: 'user' | 'system' | 'service' = 'user',
    role?: string,
    permissions?: string[]
  ) {
    if (!id || !id.trim()) {
      throw new Error('Actor ID is required')
    }

    this.id = id.trim()
    this.type = type
    this.role = role
    this.permissions = permissions
  }

  getId(): string {
    return this.id
  }

  getType(): 'user' | 'system' | 'service' {
    return this.type
  }

  getRole(): string | undefined {
    return this.role
  }

  getPermissions(): string[] | undefined {
    return this.permissions
  }

  hasPermission(permission: string): boolean {
    if (this.type === 'system') {
      return true // System actors have all permissions
    }
    return this.permissions?.includes(permission) ?? false
  }

  static system(): Actor {
    return new Actor('system', 'system')
  }

  static service(serviceName: string): Actor {
    return new Actor(serviceName, 'service')
  }

  toJSON(): {
    id: string
    type: 'user' | 'system' | 'service'
    role?: string
    permissions?: string[]
  } {
    return {
      id: this.id,
      type: this.type,
      role: this.role,
      permissions: this.permissions,
    }
  }
}
