# 14_commercial_law: Commercial Plan Sovereignty Protocol

## 1. Goal (الهدف)
To strictly enforce the separation of features based on subscription tiers (Free, Pro, Premium) as defined in the **Oman Education AI System README**. This ensures that the ID of the user does not determine access, but rather their subscription status.

## 2. Technical Specification (المواصفات الفنية)
### Tiers Definition (From README)
| Plan Code | Description | Key Features |
|---|---|---|
| `FREE` | Basic Access | Limited AI, Community Support |
| `PRO` | Advanced | Unlimitied Advanced Lessons, Detailed AI Explanations, Code Examples |
| `PREMIUM` | VIP Experience | All Pro Features, Interactive Mind Maps, Explainer Videos, Priority Support |

### Architecture Constraints
- **Law 14 Compliance:** All features MUST check `useUserTier()` (Frontend) or `SubscriptionGuard` (Backend).
- **No Role Bypass:** Being an 'Admin' does NOT automatically grant 'Premium' content features unless explicitly defined for testing.

## 3. Compliance Criteria (معايير الامتثال)
- [ ] `User` entity has `planTier` property.
- [ ] No hardcoded `tier-premium` in UI (applies to all users).
- [ ] Backend endpoints for Pro/Premium features are guarded.

## 4. Failure Scenarios (حالات الفشل المتوقعة)
| Scenario | Detection | Mitigation |
|---|---|---|
| Plan Bypass | Automated Tests | CI Failure |
| Expired Subscription | Middleware Check | Degradation to FREE |
