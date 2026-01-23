import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectService } from '@/application/services/project/ProjectService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'
import { CreateProjectRequest } from '@/domain/types/project.types'

// Mock DatabaseCoreAdapter
const mockDatabaseAdapter = {
    insert: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
} as unknown as DatabaseCoreAdapter

describe('ProjectService', () => {
    let projectService: ProjectService

    beforeEach(() => {
        vi.clearAllMocks()
        projectService = new ProjectService(mockDatabaseAdapter)
    })

    describe('createProject', () => {
        it('should create a project successfully', async () => {
            const createData: CreateProjectRequest = {
                title: 'New Project',
                type: 'educational',
                subject: 'Math',
                grade_level: 'Grade 10'
            }

            const userId = 'user-123'
            const createdDate = new Date().toISOString()

            const expectedProject = {
                id: 'proj-123',
                ...createData,
                description: null,
                status: 'draft',
                progress: 0,
                requirements: [],
                lessons: [],
                files: [],
                reports: [],
                created_by: userId,
                created_at: createdDate,
                updated_at: createdDate
            }

            vi.spyOn(mockDatabaseAdapter, 'insert').mockResolvedValue({
                ...expectedProject,
                requirements: null, // DB might return null/string
                lessons: null,
                files: null,
                reports: null
            })

            const result = await projectService.createProject(createData, userId)

            expect(mockDatabaseAdapter.insert).toHaveBeenCalledWith('projects', expect.objectContaining({
                title: createData.title,
                created_by: userId
            }))
            expect(result.title).toBe(createData.title)
            expect(result.status).toBe('draft')
        })
    })

    describe('getProjects', () => {
        it('should return projects with filters', async () => {
            const filters = {
                type: 'educational',
                page: 1,
                per_page: 10
            }

            const dbProjects = [
                { id: '1', title: 'P1', type: 'educational', requirements: '[]' },
                { id: '2', title: 'P2', type: 'educational', requirements: '[]' }
            ]

            vi.spyOn(mockDatabaseAdapter, 'find').mockResolvedValue(dbProjects)
            vi.spyOn(mockDatabaseAdapter, 'count').mockResolvedValue(2)

            const result = await projectService.getProjects(filters)

            expect(mockDatabaseAdapter.find).toHaveBeenCalledWith('projects',
                expect.objectContaining({ type: 'educational' }),
                expect.anything()
            )
            expect(result.projects).toHaveLength(2)
            expect(result.total).toBe(2)
        })
    })
})
