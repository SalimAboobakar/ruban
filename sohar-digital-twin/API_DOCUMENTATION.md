# 🔌 توثيق API - منصة التوأم الرقمي لميناء صحار

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المحاكي الحالي](#المحاكي-الحالي)
3. [واجهة API المقترحة](#واجهة-api-المقترحة)
4. [أنواع البيانات](#أنواع-البيانات)
5. [أمثلة الاستخدام](#أمثلة-الاستخدام)
6. [معالجة الأخطاء](#معالجة-الأخطاء)
7. [المصادقة](#المصادقة)

---

## 🎯 نظرة عامة

حالياً، المشروع يستخدم **محاكي API** (`namaApiSimulator.ts`) لتوليد البيانات. هذا المستند يوثق:

1. الواجهة الحالية للمحاكي
2. واجهة API المقترحة للتكامل المستقبلي
3. أنواع البيانات والهياكل

---

## 🎭 المحاكي الحالي

### الموقع

`src/data/namaApiSimulator.ts`

### الدوال المتاحة

#### 1. `generateCompanyReading()`

توليد قراءة طاقة لشركة واحدة.

**التوقيع:**
```typescript
function generateCompanyReading(
  companyId: string,
  simulatedTime?: Date
): CompanyReading
```

**المعاملات:**
- `companyId` (string): معرف الشركة (مثال: 'MTR-001')
- `simulatedTime` (Date, اختياري): الوقت المحاكى (افتراضي: الآن)

**القيمة المُرجعة:**
```typescript
{
  meter_id: string;
  company_name: string;
  current_power_mw: number;
  status: 'normal' | 'medium' | 'high' | 'idle';
  trend: 'increasing' | 'stable' | 'decreasing';
  timestamp: string; // ISO 8601
}
```

**مثال:**
```typescript
import { generateCompanyReading } from './data/namaApiSimulator';

const reading = generateCompanyReading('MTR-001', new Date());
console.log(reading);
// {
//   meter_id: 'MTR-001',
//   company_name: 'Sohar Aluminum',
//   current_power_mw: 487.5,
//   status: 'normal',
//   trend: 'stable',
//   timestamp: '2024-12-15T10:30:00.000Z'
// }
```

#### 2. `generateAllReadings()`

توليد قراءات لجميع الشركات.

**التوقيع:**
```typescript
function generateAllReadings(
  simulatedTime?: Date
): CompanyReading[]
```

**مثال:**
```typescript
const readings = generateAllReadings(new Date());
// Array of 12 CompanyReading objects
```

#### 3. `generatePortStatus()`

توليد حالة الميناء الكاملة مع الإحصائيات.

**التوقيع:**
```typescript
function generatePortStatus(
  simulatedTime?: Date
): PortStatus
```

**القيمة المُرجعة:**
```typescript
{
  timestamp: string;
  total_power_mw: number;
  capacity_mw: number;
  utilization_percent: number;
  companies: CompanyReading[];
  active_alerts: number;
  cost_per_hour: number;
}
```

**مثال:**
```typescript
const status = generatePortStatus(new Date());
console.log(`Total Power: ${status.total_power_mw} MW`);
console.log(`Utilization: ${status.utilization_percent}%`);
```

#### 4. `generateHistoricalData()`

توليد بيانات تاريخية للرسوم البيانية.

**التوقيع:**
```typescript
function generateHistoricalData(
  hours?: number,
  intervalMinutes?: number
): PortStatus[]
```

**المعاملات:**
- `hours` (number, اختياري): عدد الساعات (افتراضي: 24)
- `intervalMinutes` (number, اختياري): الفترة بين النقاط بالدقائق (افتراضي: 30)

**مثال:**
```typescript
// بيانات آخر 48 ساعة كل ساعة
const history = generateHistoricalData(48, 60);

// بيانات آخر 24 ساعة كل 15 دقيقة
const detailedHistory = generateHistoricalData(24, 15);
```

#### 5. `resetSimulator()`

إعادة تعيين المحاكي (مفيد عند القفز في الزمن).

**التوقيع:**
```typescript
function resetSimulator(): void
```

**مثال:**
```typescript
resetSimulator();
// الآن القراءات السابقة محذوفة
```

---

## 🌐 واجهة API المقترحة

### Base URL

```
https://api.sohar-port.om/v1
```

### Endpoints

#### 1. GET `/port/status`

الحصول على حالة الميناء الحالية.

**الاستجابة:**
```json
{
  "timestamp": "2024-12-15T10:30:00.000Z",
  "total_power_mw": 987.5,
  "capacity_mw": 1100,
  "utilization_percent": 89.8,
  "companies": [
    {
      "meter_id": "MTR-001",
      "company_name": "Sohar Aluminum",
      "current_power_mw": 487.5,
      "status": "normal",
      "trend": "stable",
      "timestamp": "2024-12-15T10:30:00.000Z"
    }
    // ... المزيد
  ],
  "active_alerts": 2,
  "cost_per_hour": 44437
}
```

**مثال الاستخدام:**
```typescript
const response = await fetch('https://api.sohar-port.om/v1/port/status', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const status = await response.json();
```

#### 2. GET `/companies`

الحصول على قائمة جميع الشركات.

**الاستجابة:**
```json
{
  "companies": [
    {
      "id": "MTR-001",
      "name": "Sohar Aluminum",
      "industry": "Metals",
      "base_load_mw": 450,
      "location": {
        "x": -50,
        "y": 0,
        "z": 150
      },
      "criticality": "high"
    }
    // ... المزيد
  ],
  "total": 12
}
```

#### 3. GET `/companies/:id/readings`

الحصول على قراءات شركة محددة.

**المعاملات:**
- `id` (path): معرف الشركة
- `from` (query, اختياري): تاريخ البداية (ISO 8601)
- `to` (query, اختياري): تاريخ النهاية (ISO 8601)
- `interval` (query, اختياري): الفترة (minutes, hours, days)

**مثال:**
```typescript
const url = new URL('https://api.sohar-port.om/v1/companies/MTR-001/readings');
url.searchParams.append('from', '2024-12-15T00:00:00Z');
url.searchParams.append('to', '2024-12-15T23:59:59Z');
url.searchParams.append('interval', 'hours');

const response = await fetch(url);
const readings = await response.json();
```

**الاستجابة:**
```json
{
  "company_id": "MTR-001",
  "company_name": "Sohar Aluminum",
  "readings": [
    {
      "timestamp": "2024-12-15T00:00:00.000Z",
      "power_mw": 450.2,
      "status": "normal"
    }
    // ... المزيد
  ],
  "count": 24
}
```

#### 4. GET `/port/history`

الحصول على البيانات التاريخية للميناء.

**المعاملات:**
- `hours` (query): عدد الساعات (افتراضي: 24)
- `interval` (query): الفترة (minutes, hours) (افتراضي: minutes)

**مثال:**
```typescript
const response = await fetch(
  'https://api.sohar-port.om/v1/port/history?hours=48&interval=hours'
);
const history = await response.json();
```

#### 5. GET `/alerts`

الحصول على التنبيهات النشطة.

**الاستجابة:**
```json
{
  "alerts": [
    {
      "id": "alert-001",
      "type": "critical",
      "message": "High power consumption detected",
      "company_id": "MTR-001",
      "company_name": "Sohar Aluminum",
      "timestamp": "2024-12-15T10:30:00.000Z",
      "severity": "high"
    }
    // ... المزيد
  ],
  "count": 2
}
```

#### 6. GET `/predictions`

الحصول على التنبؤات والتحليلات.

**الاستجابة:**
```json
{
  "predictions": [
    {
      "id": "pred-001",
      "type": "peak",
      "message": "Peak expected at 14:00 - 1050 MW",
      "confidence": 0.87,
      "timestamp": "2024-12-15T10:30:00.000Z"
    }
    // ... المزيد
  ]
}
```

---

## 📊 أنواع البيانات

### CompanyReading

```typescript
interface CompanyReading {
  meter_id: string;
  company_name: string;
  current_power_mw: number;
  status: 'normal' | 'medium' | 'high' | 'idle';
  trend: 'increasing' | 'stable' | 'decreasing';
  timestamp: string; // ISO 8601
}
```

### PortStatus

```typescript
interface PortStatus {
  timestamp: string;
  total_power_mw: number;
  capacity_mw: number;
  utilization_percent: number;
  companies: CompanyReading[];
  active_alerts: number;
  cost_per_hour: number;
}
```

### Company

```typescript
interface Company {
  id: string;
  name: string;
  industry: 'Metals' | 'Petrochemicals' | 'Logistics' | 'Manufacturing' | 'Energy';
  base_load_mw: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  criticality: 'high' | 'medium' | 'low';
}
```

### Alert

```typescript
interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  company_id: string;
  timestamp: string;
  severity?: 'high' | 'medium' | 'low';
}
```

### Prediction

```typescript
interface Prediction {
  id: string;
  type: 'peak' | 'anomaly' | 'recommendation';
  message: string;
  confidence: number; // 0-1
  timestamp: string;
}
```

---

## 💡 أمثلة الاستخدام

### مثال 1: Service Class

```typescript
// src/services/api.ts
class NamaApiService {
  private baseUrl: string;
  private token: string;
  
  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  async getPortStatus(): Promise<PortStatus> {
    const response = await fetch(`${this.baseUrl}/port/status`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getCompanyReadings(
    companyId: string,
    from?: Date,
    to?: Date
  ): Promise<CompanyReading[]> {
    const url = new URL(`${this.baseUrl}/companies/${companyId}/readings`);
    
    if (from) url.searchParams.append('from', from.toISOString());
    if (to) url.searchParams.append('to', to.toISOString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.readings;
  }
}

export const apiService = new NamaApiService(
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.VITE_API_TOKEN
);
```

### مثال 2: استخدام في Hook

```typescript
// src/hooks/useRealTimeData.ts
import { apiService } from '../services/api';

export function useRealTimeData() {
  const [status, setStatus] = useState<PortStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getPortStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch port status:', err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { currentStatus: status, error };
}
```

### مثال 3: WebSocket للبيانات المباشرة

```typescript
// src/services/websocket.ts
class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<(data: PortStatus) => void> = new Set();
  
  connect(url: string, token: string) {
    this.ws = new WebSocket(`${url}?token=${token}`);
    
    this.ws.onmessage = (event) => {
      const data: PortStatus = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket closed');
      // إعادة الاتصال بعد 5 ثوان
      setTimeout(() => this.connect(url, token), 5000);
    };
  }
  
  subscribe(listener: (data: PortStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
```

---

## ⚠️ معالجة الأخطاء

### رموز الحالة HTTP

- `200 OK`: الطلب نجح
- `400 Bad Request`: بيانات غير صحيحة
- `401 Unauthorized`: غير مصرح
- `403 Forbidden`: محظور
- `404 Not Found`: غير موجود
- `500 Internal Server Error`: خطأ في الخادم
- `503 Service Unavailable`: الخدمة غير متاحة

### مثال معالجة الأخطاء

```typescript
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error('غير مصرح - يرجى تسجيل الدخول');
        case 403:
          throw new Error('غير مسموح - لا تملك الصلاحيات');
        case 404:
          throw new Error('البيانات غير موجودة');
        case 500:
          throw new Error('خطأ في الخادم - يرجى المحاولة لاحقاً');
        default:
          throw new Error(`خطأ: ${response.statusText}`);
      }
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('خطأ في الاتصال - تحقق من الإنترنت');
    }
    throw error;
  }
}
```

---

## 🔐 المصادقة

### طريقة المصادقة المقترحة

استخدام **Bearer Token** في رأس الطلب:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### الحصول على Token

```typescript
// POST /auth/login
const response = await fetch('https://api.sohar-port.om/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user@example.com',
    password: 'password'
  })
});

const { token, expires_in } = await response.json();
// حفظ Token في localStorage أو secure storage
```

### تحديث Token

```typescript
// POST /auth/refresh
const response = await fetch('https://api.sohar-port.om/v1/auth/refresh', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${refreshToken}`
  }
});

const { token } = await response.json();
```

---

## 📝 ملاحظات إضافية

### Rate Limiting

قد يكون هناك حد أقصى لعدد الطلبات:
- **1000 طلب/ساعة** لكل مستخدم
- عند تجاوز الحد: `429 Too Many Requests`

### Caching

يُنصح بتخزين البيانات مؤقتاً:
- البيانات الحالية: 5 ثوان
- البيانات التاريخية: 1 دقيقة
- بيانات الشركات: 1 ساعة

### Versioning

API يستخدم versioning:
- الإصدار الحالي: `v1`
- التغييرات الكبيرة: `v2`, `v3`, إلخ

---

**آخر تحديث**: ديسمبر 2024
**الإصدار**: 1.0.0



