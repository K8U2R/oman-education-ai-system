# Feature Specification: AI Status & Developer Diagnostics (Command Center)

## 1. Introduction
High-visibility "Command Center" in the application header that provides real-time visibility into AI service health, user token consumption, and developer diagnostics. It bridges the gap between opaque backend limits and frontend user experience.

### Problem Statement
- **Users** have no visibility into their token usage or plan limits until they hit a wall.
- **Developers** lack real-time visibility into AI errors (latency, rate limits) without checking logs.
- **System** status (OpenAI/Anthropic outages) is not communicated to end-users actively.

### Goals
1.  **Transparency:** Visualize token usage vs. quota limits in real-time.
2.  **Observability:** Provide developers with instant access to the last 5 AI-related errors/warnings.
3.  **Reliability:** Actively communicate system status (Healthy, Degraded, Down).

## 2. User Scenarios

### Scenario 1: The Power User (Free Plan)
**Actor:** Student (Free Tier)
**Action:** Opens the "AI Tools" menu.
**Outcome:** Sees a yellow ring around the AI icon (75% usage). Hovering shows "75/100 Tokens Used Used today".
**Value:** Proactively manages remaining usage or considers upgrading.

### Scenario 2: The Developer (Debugging)
**Actor:** Admin/Developer
**Action:** Encounters a slow response. Clicks the AI Icon -> "Dev Console".
**Outcome:** Sees a terminal-like log: `[429] Rate Limit Exceeded - OpenAI`.
**Value:** Instant diagnosis without SSH/Datadog.

### Scenario 3: The System Outage
**Actor:** All Users
**Action:** OpenAI API goes down.
**Outcome:** AI Icon pulses Red. Tooltip says "AI Service: Degraded (Upstream Issue)".
**Value:** Reduces support tickets by confirming the issue is known.

## 3. Functional Requirements

### 3.1. Token & Quota Management
- [ ] **Real-time Tracking:** Frontend must fetch usage `onMount` and update after every AI interaction.
- [ ] **Visual Feedback:**
    - Green Ring: 0-50% usage
    - Yellow Ring: 51-80% usage
    - Red Ring: 81-100% usage
- [ ] **Tier Awareness:** Display current plan name ("Free", "Pro", "Enterprise").

### 3.2. Developer Diagnostics (Restricted Role)
- [ ] **Error Stream:** Subscribe to a WebSocket/SSE channel for `ai.error` events (Devs only).
- [ ] **Latency Metrics:** Display P95 response time of the last request.
- [ ] **Status Lights:** Mock/Real status of connected LLM providers (e.g., OpenAI, Anthropic).

### 3.3. System Architecture
- [ ] **Backend:** New `AIHealthController` exposing `/api/ai/health` and `/api/ai/usage`.
- [ ] **Middleware:** Intercept AI requests to log latency and errors to a temporary Redis list for the "Live Console".

## 4. Technical Constraints & Assumptions
- **Assumption:** Access to Redis is available for storing ephemeral "Live Logs" (TTL 1 hour).
- **Constraint:** Dev Console features MUST be strictly gated by `Roles.DEVELOPER`.
- **Constraint:** Token usage is already tracked in `subscriptions` module (need to expose it).

## 5. Success Criteria
- **User:** "Zero surprise" limit hits (users see it coming).
- **Dev:** `< 5 seconds` to identify if a failed request was 400, 429, or 500 via the UI.
- **Perf:** Widget adds `< 50ms` overhead to initial page load.

## 6. Data Model (Draft)

### Entity: AIUsageStats
```typescript
interface AIUsageStats {
  userId: string;
  tokensUsed: number;
  tokensLimit: number;
  resetDate: string; // ISO
  tier: 'free' | 'pro' | 'enterprise';
}
```

### Entity: AIDiagnosticLog
```typescript
interface AIDiagnosticLog {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  source: 'openai' | 'anthropic' | 'internal';
  message: string;
  latencyMs?: number;
}
```
