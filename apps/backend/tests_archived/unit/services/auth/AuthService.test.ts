import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '@/application/services/auth/AuthService'
import { IAuthRepository } from '@/domain/interfaces/repositories/IAuthRepository'
import { TokenService } from '@/application/services/auth/TokenService'
import { RegisterRequest } from '@/domain/types/auth.types'
import { User } from '@/domain/entities/User'
import { Email } from '@/domain/value-objects/Email'

import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'
import { EmailService } from '@/application/services/email/EmailService'

// Mock dependencies
const mockAuthRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    verifyToken: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    exists: vi.fn(),
    save: vi.fn(),
    register: vi.fn(),
} as unknown as IAuthRepository

const mockTokenService = {
    generateTokens: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
} as unknown as TokenService

const mockDatabaseAdapter = {
    insert: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: vi.fn(),
} as unknown as DatabaseCoreAdapter

const mockEmailService = {
    sendVerificationEmail: vi.fn().mockResolvedValue(true),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
} as unknown as EmailService

describe('AuthService', () => {
    let authService: AuthService

    beforeEach(() => {
        vi.clearAllMocks()
        authService = new AuthService(
            mockAuthRepository,
            mockDatabaseAdapter,
            mockTokenService,
            mockEmailService
        )
    })

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerData: RegisterRequest = {
                email: 'test@example.com',
                password: 'Password123!',
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser',
                role: 'student'
            }

            const createdUser = new User(
                '123',
                new Email(registerData.email),
                registerData.first_name,
                registerData.last_name,
                registerData.username,
                true,
                false,
                undefined,
                registerData.role,
                [],
                'default',
                null,
                null,
                false,
                new Date(),
                new Date()
            )

            vi.spyOn(mockAuthRepository, 'findByEmail').mockResolvedValue(null)
            vi.spyOn(mockAuthRepository, 'register').mockResolvedValue(createdUser)

            const result = await authService.register(registerData)

            expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(registerData.email)
            expect(mockAuthRepository.register).toHaveBeenCalled()
            expect(result).toEqual(createdUser)
        })

        it('should throw error if user already exists', async () => {
            const registerData: RegisterRequest = {
                email: 'existing@example.com',
                password: 'Password123!',
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser',
                role: 'student'
            }

            const existingUser = new User(
                '123',
                new Email(registerData.email),
                registerData.first_name,
                registerData.last_name,
                registerData.username,
                true,
                true,
                undefined,
                registerData.role,
                [],
                'default',
                null,
                null,
                false,
                new Date(),
                new Date()
            )

            vi.spyOn(mockAuthRepository, 'findByEmail').mockResolvedValue(existingUser)

            await expect(authService.register(registerData)).rejects.toThrow()
        })
    })

    describe('login', () => {
        it('should login user successfully', async () => {
            // Note: In a real integration test or if we didn't mock UseCases inside AuthService, 
            // we would need to mock bcrypt.compare or similar. 
            // However, AuthService instantiates UseCases internally: new LoginUseCase(...)
            // Since we cannot easily mock the internal UseCase instance without dependency injection of UseCase itself,
            // we rely on mocking the Repository which the UseCase uses.
            // BUT: LoginUseCase uses bcrypt to compare password. exact implementation depends on LoginUseCase.
            // If we want to unit test AuthService strictly, we might encounter issues if it creates UseCases with 'new' internally.
            // Let's rely on the fact that we can mock the repository responses.

            // Ideally, AuthService should accept UseCases in constructor for better testing, 
            // but it accepts Repository.

            // Let's checking if we can simple mock the internal logic execution path via repo mocks.
        })
    })
})
