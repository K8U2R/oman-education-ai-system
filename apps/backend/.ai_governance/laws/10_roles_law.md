# 10_roles_law: User Roles & Permissions Specification

## 1. Goal (الهدف)
To define the user hierarchy as specified in the **Project README**, ensuring that AI acts as the primary educator and eliminating the concept of a human "Teacher" role.

## 2. Technical Specification (المواصفات الفنية)
### Roles Table (From README)
| Role Code | Description | Core Responsibility |
|---|---|---|
| `student` | Standard User | Learning via AI |
| `parent`  | Observer | Monitoring Progress |
| `admin`   | System Admin | Content & User Management |
| `developer`| Technical Support | Maintenance & Debugging |

### Constraints
- **Architecture:** The system MUST NOT contain logic for a 'teacher' role.
- **AI-First:** All educational content delivery is the responsibility of the AI Engine.

## 3. Compliance Criteria (معايير الامتثال)
- [ ] Database `UserRole` enum matches the table above.
- [ ] No `TeacherDashboard` components exist.
- [ ] Auth logic rejects unknown roles.

## 4. Failure Scenarios (حالات الفشل المتوقعة)
| Scenario | Detection | Mitigation |
|---|---|---|
| Role Injection | Integrity Check | Block commit/deployment |
| Privilege Escalation | Audit Logs | Account Suspension |
