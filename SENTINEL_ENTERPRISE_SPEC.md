# Sovereign Sentinel Core - Enterprise Specification

**Version:** 2.0.0-enterprise  
**Status:** Architecture Phase  
**Classification:** Internal Development Tool  
**Compliance:** Law 7 (Diagnostic Protocol), Law 12 (Operational Excellence)

---

## Executive Summary

The **Sovereign Sentinel Core** is an enterprise-grade, self-diagnostic monitoring system designed to provide real-time visibility into application health, performance, and compliance. This system transforms the current `StyleSentinel` component into a comprehensive "black box" solution that meets the diagnostic standards of Fortune 500 companies.

**Key Objectives:**

- **Zero Silent Failures:** Every error, lag, or anomaly is detected and surfaced immediately
- **Production Safety:** Dev-only activation with zero performance impact on end users
- **Comprehensive Coverage:** UI, Network, Performance, and System-wide monitoring
- **Actionable Intelligence:** Not just detection, but guided remediation

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Sovereign Sentinel Core                    │
│                     (Dev Mode Only)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Visual    │  │   Network   │  │ Performance │         │
│  │  Guardian   │  │ Interceptor │  │   Vitals    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │ Sentinel  │                            │
│                    │   Core    │                            │
│                    │  Engine   │                            │
│                    └─────┬─────┘                            │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │ Sovereign │                            │
│                    │    HUD    │                            │
│                    │ (Overlay) │                            │
│                    └───────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Module 1: Visual Guardian (الحارس البصري)

### Mission

Ensure pixel-perfect compliance with Sovereign Architecture visual standards across all viewport sizes and color schemes.

### Capabilities

#### 1.1 Color Compliance Scanner (Current + Enhanced)

**Status:** ✅ Implemented (v1.0)  
**Enhancements:**

- Real-time detection of Hex colors in computed styles
- Contrast ratio validation (WCAG 2.1 AAA)
- Color blindness simulation detection

**Algorithm:**

```typescript
interface ColorViolation {
  token: string;
  hexValue: string;
  location: {
    file: string;      // Detected via sourcemap analysis
    line: number;
    column: number;
  };
  severity: 'critical' | 'error' | 'warning';
  contrastRatio?: number;
  wcagCompliance: 'AAA' | 'AA' | 'fail';
}
```

#### 1.2 Z-Index Conflict Detector

**Status:** 🆕 New Feature  
**Purpose:** Prevent modal/overlay stacking issues

**Detection Logic:**

```typescript
interface ZIndexConflict {
  element1: {
    selector: string;
    zIndex: number;
    position: 'fixed' | 'absolute' | 'relative' | 'sticky';
  };
  element2: {
    selector: string;
    zIndex: number;
    position: string;
  };
  conflictType: 'overlap' | 'inappropriate-stacking';
  recommendation: string;
}
```

**Rules:**

- Modals: 9000-9999
- Toasts/Notifications: 8000-8999
- Dropdowns: 7000-7999
- Fixed Headers: 6000-6999
- Content: 1-999

#### 1.3 Layout Overflow Inspector

**Status:** 🆕 New Feature  
**Purpose:** Detect unexpected horizontal scrollbars and overflows

**Implementation:**

```typescript
interface LayoutViolation {
  element: string;
  type: 'horizontal-overflow' | 'vertical-overflow' | 'content-clip';
  scrollWidth: number;
  clientWidth: number;
  overflow: number; // scrollWidth - clientWidth
  location: DOMRect;
}
```

**Scan Strategy:**

1. Traverse all elements with `getBoundingClientRect()`
2. Compare `scrollWidth` vs `clientWidth`
3. Flag elements exceeding viewport by >5px
4. Provide CSS fix suggestions

#### 1.4 Dark Mode Integrity Checker

**Status:** 🆕 New Feature  
**Purpose:** Ensure all components render correctly in both light/dark modes

**Test Matrix:**

```typescript
interface DarkModeTest {
  component: string;
  lightMode: {
    backgroundColor: string;
    textColor: string;
    contrast: number;
  };
  darkMode: {
    backgroundColor: string;
    textColor: string;
    contrast: number;
  };
  passed: boolean;
  issues: string[];
}
```

**Validation:**

- Auto-toggle between light/dark every 100ms
- Screenshot comparison (visual regression)
- Contrast ratio verification in both modes

---

## Module 2: Network Interceptor (معترض الشبكة)

### Mission

Provide complete transparency into all HTTP traffic, with focus on latency, failures, and silent timeout detection.

### Architecture

```typescript
class NetworkInterceptor {
  private requests: Map<string, RequestMetrics>;
  private failureThreshold = 3000; // 3s
  
  intercept(config: AxiosRequestConfig): AxiosRequestConfig {
    const requestId = generateId();
    this.trackRequest(requestId, config);
    return config;
  }
  
  onResponse(response: AxiosResponse): AxiosResponse {
    this.recordSuccess(response);
    return response;
  }
  
  onError(error: AxiosError): void {
    this.recordFailure(error);
    this.notifySentinel(error);
  }
}
```

### Capabilities

#### 2.1 Request Logger

**Data Captured:**

```typescript
interface RequestLog {
  id: string;
  timestamp: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
  
  // Timing
  startTime: number;
  endTime?: number;
  latency?: number; // ms
  
  // Response
  status?: number;
  statusText?: string;
  responseSize?: number; // bytes
  
  // Failure Detection
  error?: {
    type: 'timeout' | 'network' | 'server' | 'client';
    message: string;
    stack?: string;
  };
}
```

#### 2.2 Latency Analytics

**Metrics Tracked:**

- **DNS Lookup Time**
- **TCP Connection Time**
- **TLS Handshake Time** (HTTPS)
- **Server Processing Time**
- **Content Download Time**

**Visualization:**

```
Request Timeline:
|----DNS----|--TCP--|--TLS--|=========Server========|--Download--|
0ms      50ms    80ms   120ms                    2100ms       2300ms

Total: 2300ms ⚠️ (Threshold: 2000ms)
```

#### 2.3 Silent Failure Detector

**Problem:** Network requests that fail without triggering error handlers

**Detection Strategy:**

1. **Timeout Detection:** Requests exceeding 30s with no response
2. **5xx Silent Failures:** Server errors not displayed to user
3. **CORS Issues:** Pre-flight failures
4. **Aborted Requests:** User navigation before completion

**Alert Format:**

```typescript
interface SilentFailureAlert {
  severity: 'critical';
  requestId: string;
  url: string;
  failureType: 'timeout' | '5xx' | 'cors' | 'aborted';
  timestamp: number;
  userImpact: 'high' | 'medium' | 'low';
  suggestedAction: string;
}
```

#### 2.4 API Health Dashboard

**Real-time Metrics:**

- **Success Rate:** (2xx responses / total requests) * 100
- **Average Latency:** Mean response time over last 100 requests
- **Error Rate:** (4xx + 5xx) / total requests
- **Slowest Endpoints:** Top 10 by latency

---

## Module 3: Performance Vitals (مؤشرات الأداء)

### Mission

Monitor and optimize runtime performance to ensure 60 FPS rendering and minimal memory footprint.

### Core Metrics

#### 3.1 FPS (Frames Per Second) Monitor

**Target:** 60 FPS (16.67ms per frame)  
**Alert Threshold:** < 30 FPS for > 1 second

**Implementation:**

```typescript
class FPSMonitor {
  private frameTimestamps: number[] = [];
  private rafId: number;
  
  start() {
    const measureFrame = () => {
      this.frameTimestamps.push(performance.now());
      
      // Keep last 60 frames (1 second at 60 FPS)
      if (this.frameTimestamps.length > 60) {
        this.frameTimestamps.shift();
      }
      
      const fps = this.calculateFPS();
      if (fps < 30) {
        this.reportJank(fps);
      }
      
      this.rafId = requestAnimationFrame(measureFrame);
    };
    
    this.rafId = requestAnimationFrame(measureFrame);
  }
  
  calculateFPS(): number {
    if (this.frameTimestamps.length < 2) return 60;
    
    const timeDelta = this.frameTimestamps[this.frameTimestamps.length - 1] 
                     - this.frameTimestamps[0];
    return (this.frameTimestamps.length / timeDelta) * 1000;
  }
}
```

#### 3.2 Re-render Tracker

**Purpose:** Detect unnecessary component re-renders (React performance killer)

**Strategy:**

```typescript
// React DevTools Profiler Integration
import { Profiler } from 'react';

<Profiler id="AppRoot" onRender={onRenderCallback}>
  <App />
</Profiler>

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (phase === 'update' && actualDuration > 16) {
    // Render took longer than 1 frame
    SentinelCore.reportSlowRender({
      component: id,
      duration: actualDuration,
      timestamp: commitTime
    });
  }
}
```

**Alert Example:**

```
⚠️ Excessive Re-renders Detected
Component: <UserProfile>
Renders in last 5s: 47
Potential Cause: Missing React.memo() or unstable props
Recommendation: Wrap with memo() and use useCallback for handlers
```

#### 3.3 Memory Leak Detector

**Method:** Track `performance.memory` (Chrome) over time

**Implementation:**

```typescript
class MemoryMonitor {
  private baseline: number;
  private checkInterval = 30000; // 30s
  
  start() {
    this.baseline = this.getMemoryUsage();
    
    setInterval(() => {
      const current = this.getMemoryUsage();
      const growth = current - this.baseline;
      
      if (growth > 50 * 1024 * 1024) { // 50MB growth
        this.alertMemoryLeak(growth);
      }
      
      this.baseline = current; // Reset for next check
    }, this.checkInterval);
  }
  
  getMemoryUsage(): number {
    return (performance as any).memory?.usedJSHeapSize || 0;
  }
}
```

**Leak Indicators:**

- **Linear Growth:** Memory increases steadily over time
- **Event Listener Accumulation:** Same event bound multiple times
- **Detached DOM Nodes:** Elements removed from DOM but still in memory

#### 3.4 Bundle Size Analyzer

**Real-time Code Splitting Metrics:**

```typescript
interface BundleMetrics {
  initialLoad: {
    size: number; // bytes
    gzipped: number;
    loadTime: number; // ms
  };
  lazyChunks: Array<{
    name: string;
    size: number;
    loaded: boolean;
    loadTime?: number;
  }>;
  totalSize: number;
  recommendations: string[];
}
```

---

## Module 4: Sovereign HUD (واجهة العرض الرأسية)

### Mission

Provide an in-app, developer-only UI for real-time system diagnostics without leaving the application context.

### Design Specifications

#### 4.1 Visual Design

**Position:** Fixed overlay (bottom-right corner)  
**Activation:** Press `Ctrl + Shift + S` (Sovereign)  
**Collapse State:** Mini-badge showing issue count

```
┌──────────────────────────────────────────────┐
│  🛡️ Sovereign Sentinel                      │
│  ────────────────────────────────────────  │
│                                              │
│  📊 Visual    🌐 Network   ⚡ Performance   │
│  ═══════════                                 │
│                                              │
│  ✅ 0 Hex Violations                        │
│  ⚠️  3 Z-Index Conflicts                    │
│  ❌ 1 Layout Overflow                       │
│                                              │
│  📍 Details:                                │
│  • Modal (#user-modal) z-index collision    │
│  • Sidebar overflow: +23px                  │
│                                              │
│  [Fix All] [Ignore] [ X Close]              │
└──────────────────────────────────────────────┘
```

#### 4.2 Tab Structure

**Tab 1: Visual Guardian**

- Color violations list
- Z-index conflict tree
- Layout overflow map
- Dark mode test results

**Tab 2: Network**

- Request waterfall chart
- Failed requests (red highlight)
- Latency heatmap
- Silent failure alerts

**Tab 3: Performance**

- Live FPS graph
- Re-render timeline
- Memory usage chart
- Bundle size breakdown

**Tab 4: System**

- Console log aggregation
- React error boundaries
- Global state snapshot
- Browser compatibility warnings

#### 4.3 Interaction Features

**Quick Actions:**

```typescript
interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
  badge?: number; // Issue count
}

const actions: QuickAction[] = [
  {
    label: 'Fix All Hex',
    icon: '🎨',
    action: () => autoConvertToOKLCH(),
    badge: hexViolationsCount
  },
  {
    label: 'Clear Console',
    icon: '🗑️',
    action: () => console.clear()
  },
  {
    label: 'Force Re-render',
    icon: '🔄',
    action: () => window.location.reload()
  }
];
```

**Export Report:**

```typescript
function exportDiagnosticReport(): DiagnosticReport {
  return {
    timestamp: new Date().toISOString(),
    environment: {
      browser: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      colorScheme: document.documentElement.getAttribute('data-theme')
    },
    visual: visualGuardian.getReport(),
    network: networkInterceptor.getReport(),
    performance: performanceVitals.getReport(),
    recommendations: generateRecommendations()
  };
}
```

#### 4.4 Theming

**HUD adapts to app theme:**

- Light Mode: Semi-transparent white background
- Dark Mode: Semi-transparent dark background
- Glassmorphism effect: `backdrop-filter: blur(12px)`

---

## Module 5: Integration Plan (خطة الدمج)

### Production Safety Protocol

#### 5.1 Environment Detection

**Activation Rules:**

```typescript
const SENTINEL_ENABLED = 
  process.env.NODE_ENV === 'development' ||
  localStorage.getItem('ENABLE_SENTINEL') === 'true';

// Production override (emergency debugging)
// Only accessible with secret key
if (window.location.search.includes('?sentinel_key=')) {
  const key = new URLSearchParams(window.location.search).get('sentinel_key');
  if (key === process.env.VITE_SENTINEL_SECRET) {
    SENTINEL_ENABLED = true;
  }
}
```

#### 5.2 Performance Impact Mitigation

**Strategy:** Lazy Loading + Code Splitting

```typescript
// App.tsx
const SentinelCore = lazy(() => 
  import('./infrastructure/diagnostics/SentinelCore')
);

function App() {
  const [sentinelEnabled] = useState(checkSentinelEnabled());
  
  return (
    <>
      <Routes>...</Routes>
      
      {sentinelEnabled && (
        <Suspense fallback={null}>
          <SentinelCore />
        </Suspense>
      )}
    </>
  );
}
```

**Bundle Strategy:**

- Main bundle: 0 bytes impact (lazy loaded)
- Sentinel bundle: Separate chunk (~50KB gzipped)
- Load on demand: Only when activated

#### 5.3 Data Privacy

**No User Data Collection:**

```typescript
interface SentinelDataPolicy {
  collect: {
    technicalMetrics: true;    // FPS, latency, errors
    codeLocations: true;       // File paths, line numbers
    browserInfo: true;         // User agent, viewport
  };
  doNotCollect: {
    userData: true;            // ❌ No form inputs
    apiResponses: true;        // ❌ No API payloads
    personalInfo: true;        // ❌ No PII
  };
}
```

#### 5.4 Deployment Strategy

**Phase 1: Internal Alpha (Week 1-2)**

- Deploy to dev environment only
- Team-wide dogfooding
- Bug fixes and UX refinements

**Phase 2: Staging Beta (Week 3)**

- Enable in staging environment
- QA team validation
- Performance benchmarking

**Phase 3: Production Opt-in (Week 4)**

- Deploy to production (disabled by default)
- Enable via localStorage flag for developers
- Emergency debug key for production issues

**Phase 4: Continuous Monitoring**

- Track Sentinel's own performance impact
- User feedback loop
- Iterative improvements

---

## Technical Stack

### Core Technologies

```typescript
{
  "framework": "React 18.3",
  "buildTool": "Vite 5",
  "http": "Axios with interceptors",
  "performance": "React Profiler + Performance API",
  "styling": "SCSS Modules (sovereign compliant)",
  "state": "Zustand (lightweight)",
  "charts": "Recharts (performance graphs)",
  "icons": "Lucide React"
}
```

### Key Dependencies

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "zustand": "^4.5.0",
    "recharts": "^2.12.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "sass": "^1.70.0"
  }
}
```

---

## Success Metrics

### KPIs (Key Performance Indicators)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Hex Detection Accuracy** | 100% | Zero false positives |
| **Network Failure Detection** | 100% | Zero silent failures |
| **FPS Monitoring Overhead** | < 1% | No visible lag |
| **Bundle Size Impact** | 0 bytes | Lazy loaded |
| **Developer Adoption Rate** | > 80% | Team survey |
| **Bug Detection Speed** | < 60s | From occurrence to alert |

---

## Compliance Matrix

| Sovereign Law | Implementation | Verification |
|---------------|----------------|--------------|
| **Law 6 (Visual Sovereign)** | Visual Guardian module | Auto-detect Hex violations |
| **Law 7 (Diagnostic Protocol)** | Entire Sentinel system | 100% error visibility |
| **Law 9 (Documentation)** | JSDoc + this spec | Code review |
| **Law 10 (Modular Sovereignty)** | 4 independent modules | Unit tests per module |
| **Law 12 (Operational Protocols)** | HUD + export reports | SLA compliance |

---

## Timeline & Milestones

### Phase 1: Foundation (Week 1-2)

- [ ] Enhanced Visual Guardian (v2.0)
- [ ] Sentinel Core Engine
- [ ] Basic HUD overlay

### Phase 2: Network & Performance (Week 3-4)

- [ ] Network Interceptor implementation
- [ ] FPS + Re-render tracking
- [ ] Memory leak detector

### Phase 3: Polish & Integration (Week 5-6)

- [ ] HUD tabs + theming
- [ ] Export functionality
- [ ] Production safety measures

### Phase 4: Documentation & Launch (Week 7)

- [ ] Developer guide
- [ ] Team training
- [ ] Production deployment

---

## Future Roadmap (Post-v2.0)

### Advanced Features

1. **AI-Powered Recommendations**
   - ML model to predict performance bottlenecks
   - Auto-suggest code optimizations

2. **Remote Monitoring**
   - Send anonymized metrics to backend
   - Team-wide dashboard (optional)

3. **Playwright Integration**
   - Automated visual regression testing
   - Screenshot diff on every deploy

4. **Mobile Diagnostics**
   - Touch event tracking
   - Device-specific performance profiles

---

## Conclusion

The **Sovereign Sentinel Core** represents our commitment to **operational excellence** and **zero-tolerance for technical debt**. By implementing this enterprise-grade diagnostic system, we ensure that every line of code, every network request, and every pixel rendered meets the highest standards of quality and performance.

This is not just a dev tool—it's the **nervous system** of the Oman Education AI System.

---

**Document Owner:** System Architect  
**Last Updated:** 2026-01-21  
**Next Review:** Upon Phase 1 completion

**Approval Required From:**

- [ ] Lead Developer
- [ ] DevOps Lead
- [ ] Product Owner

---

*"في السيادة، الدقة ليست رفاهية— بل ضرورة"*  
*"In Sovereignty, precision is not a luxury—it is a necessity."*
