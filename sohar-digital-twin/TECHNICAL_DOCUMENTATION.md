# 📚 التوثيق التقني الشامل - منصة التوأم الرقمي لميناء صحار

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية المعمارية](#البنية-المعمارية)
3. [التقنيات المستخدمة](#التقنيات-المستخدمة)
4. [هيكل المشروع](#هيكل-المشروع)
5. [المكونات الرئيسية](#المكونات-الرئيسية)
6. [إدارة الحالة](#إدارة-الحالة)
7. [التكامل مع APIs](#التكامل-مع-apis)
8. [الأداء والتحسينات](#الأداء-والتحسينات)
9. [الأمان](#الأمان)
10. [الاختبارات](#الاختبارات)

---

## 🎯 نظرة عامة

منصة التوأم الرقمي لميناء صحار هي تطبيق ويب متقدم يوفر تصوراً ثلاثي الأبعاد تفاعلياً لمراقبة استهلاك الطاقة في الميناء الصناعي. المنصة تجمع بين تقنيات الويب الحديثة والتصور ثلاثي الأبعاد لتوفير رؤية شاملة في الوقت الفعلي.

### الأهداف الرئيسية

- **المراقبة في الوقت الفعلي**: عرض استهلاك الطاقة لـ 12 شركة صناعية كبرى
- **التصور ثلاثي الأبعاد**: مشهد تفاعلي للميناء مع جميع المعدات والمرافق
- **التحليلات التنبؤية**: توقعات ذكية لاستهلاك الطاقة والكشف عن الشذوذ
- **لوحة تحكم شاملة**: عرض متكامل للمقاييس والرسوم البيانية والتنبيهات

---

## 🏗️ البنية المعمارية

### نمط التصميم

المشروع يتبع **نمط Component-Based Architecture** مع فصل واضح للاهتمامات:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + Three.js)         │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│  (Hooks + Utils + Calculations)         │
├─────────────────────────────────────────┤
│         Data Layer                      │
│  (Simulators + Types + Data)             │
└─────────────────────────────────────────┘
```

### تدفق البيانات

```
User Interaction
    ↓
React Component
    ↓
Custom Hook (useRealTimeData)
    ↓
Data Simulator (namaApiSimulator)
    ↓
Type Definitions
    ↓
Component Update
```

---

## 🛠️ التقنيات المستخدمة

### Frontend Framework
- **React 19.2.0**: مكتبة JavaScript لبناء واجهات المستخدم
- **TypeScript 5.9.3**: لغة برمجة توفر نوع البيانات الثابتة
- **Vite 7.3.1**: أداة بناء سريعة وحديثة

### 3D Graphics
- **Three.js 0.182.0**: مكتبة JavaScript لرسومات ثلاثية الأبعاد
- **@react-three/fiber 9.5.0**: رندر React لـ Three.js
- **@react-three/drei 10.7.7**: مساعدات ومكونات إضافية لـ React Three Fiber

### UI/UX
- **Tailwind CSS 3.4.16**: إطار عمل CSS utility-first
- **Framer Motion 12.34.0**: مكتبة للرسوم المتحركة
- **Lucide React 0.563.0**: مجموعة أيقونات حديثة
- **Recharts 3.7.0**: مكتبة للرسوم البيانية

### Routing & State
- **React Router DOM 7.13.0**: إدارة التنقل بين الصفحات
- **React Hooks**: إدارة الحالة المحلية

### Utilities
- **date-fns 4.1.0**: معالجة التواريخ

---

## 📁 هيكل المشروع

```
sohar-digital-twin/
├── public/                 # الملفات الثابتة
│   └── vite.svg
│
├── src/
│   ├── components/         # المكونات القابلة لإعادة الاستخدام
│   │   ├── Analytics/     # مكونات التحليلات
│   │   ├── Dashboard/     # مكونات لوحة التحكم
│   │   ├── DigitalTwin/   # مكونات المشهد ثلاثي الأبعاد
│   │   └── UI/            # مكونات واجهة المستخدم الأساسية
│   │
│   ├── data/              # البيانات والمحاكيات
│   │   ├── companies.ts           # بيانات الشركات
│   │   ├── portLayout.ts          # تخطيط الميناء
│   │   ├── namaApiSimulator.ts    # محاكي API
│   │   └── predictions.ts         # توليد التنبؤات
│   │
│   ├── hooks/             # React Hooks مخصصة
│   │   └── useRealTimeData.ts     # Hook لإدارة البيانات المباشرة
│   │
│   ├── pages/             # صفحات التطبيق
│   │   ├── Dashboard.tsx
│   │   ├── DigitalTwinPage.tsx
│   │   ├── CompaniesPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── EnergySourcesPage.tsx
│   │   └── AlertsPage.tsx
│   │
│   ├── types/             # تعريفات TypeScript
│   │   └── index.ts
│   │
│   ├── utils/             # دوال مساعدة
│   │   ├── calculations.ts       # حسابات الطاقة والتكاليف
│   │   ├── formatters.ts         # تنسيق البيانات
│   │   └── statusColors.ts       # ألوان الحالات
│   │
│   ├── styles/             # ملفات CSS
│   │   └── globals.css
│   │
│   ├── App.tsx            # المكون الرئيسي
│   ├── main.tsx           # نقطة الدخول
│   └── index.css          # أنماط عامة
│
├── dist/                  # ملفات البناء النهائية
├── node_modules/          # التبعيات
│
├── docs/                  # التوثيق
│   ├── TECHNICAL_DOCUMENTATION.md
│   ├── DEVELOPER_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   └── ARCHITECTURE.md
│
├── package.json           # إدارة التبعيات
├── tsconfig.json          # إعدادات TypeScript
├── vite.config.ts        # إعدادات Vite
├── tailwind.config.js     # إعدادات Tailwind
└── README.md              # دليل المشروع
```

---

## 🧩 المكونات الرئيسية

### 1. DigitalTwin Components

#### PortScene.tsx
المكون الرئيسي للمشهد ثلاثي الأبعاد. يجمع جميع العناصر المرئية.

**المسؤوليات:**
- إعداد Canvas ثلاثي الأبعاد
- تكوين الإضاءة والظلال
- رندر جميع عناصر الميناء
- إدارة OrbitControls للكاميرا

**الاستخدام:**
```tsx
<PortScene 
  portStatus={currentStatus} 
  className="w-full h-full" 
/>
```

#### Ship.tsx
مكون السفينة مع تفاصيل بصرية وحالة الطاقة.

**الخصائص:**
- `position`: موقع السفينة [x, y, z]
- `rotation`: دوران السفينة
- `status`: حالة الطاقة (normal, medium, high, idle)
- `name`: اسم السفينة
- `type`: نوع السفينة (container, tanker)

#### STSCrane.tsx & RTGCrane.tsx
مكونات الرافعات مع تفاصيل هندسية دقيقة.

**الخصائص:**
- `position`: موقع الرافعة
- `status`: حالة التشغيل
- `name`: اسم الرافعة
- `companyName`: اسم الشركة المالكة
- `onClick`: معالج النقر (اختياري)

### 2. Dashboard Components

#### LiveMetrics.tsx
عرض المقاييس الحية في الوقت الفعلي.

**المقاييس المعروضة:**
- إجمالي الطاقة (MW)
- معدل الاستخدام (%)
- التكلفة لكل ساعة ($)
- التنبيهات النشطة

#### EnergyChart.tsx
رسم بياني لاستهلاك الطاقة عبر الزمن.

**الميزات:**
- عرض البيانات التاريخية (24 ساعة)
- خطوط متعددة للشركات المختلفة
- تفاعل مع البيانات (hover, zoom)

#### CompanyTable.tsx
جدول تفصيلي لجميع الشركات.

**الأعمدة:**
- اسم الشركة
- الاستهلاك الحالي (MW)
- الحالة (normal, medium, high, idle)
- الاتجاه (increasing, stable, decreasing)
- آخر تحديث

### 3. Data Layer

#### namaApiSimulator.ts
محاكي API لبيانات الطاقة.

**الدوال الرئيسية:**
```typescript
// توليد قراءة لشركة واحدة
generateCompanyReading(companyId: string, simulatedTime?: Date): CompanyReading

// توليد قراءات لجميع الشركات
generateAllReadings(simulatedTime?: Date): CompanyReading[]

// توليد حالة الميناء الكاملة
generatePortStatus(simulatedTime?: Date): PortStatus

// توليد بيانات تاريخية
generateHistoricalData(hours?: number, intervalMinutes?: number): PortStatus[]
```

**المحاكاة:**
- معامل الذروة (Peak Factor): 1.25× في ساعات الذروة (8am-6pm)
- معامل غير الذروة: 0.90× في ساعات غير الذروة
- التباين العشوائي: ±10%

#### companies.ts
بيانات الشركات الصناعية.

**الهيكل:**
```typescript
interface Company {
  id: string;                    // معرف فريد
  name: string;                   // اسم الشركة
  industry: Industry;            // نوع الصناعة
  base_load_mw: number;          // الحمل الأساسي (MW)
  location: { x, y, z };        // الموقع في المشهد
  criticality: Criticality;      // الأهمية (high, medium, low)
}
```

**الشركات الرئيسية:**
- Sohar Aluminum: 450 MW
- Jindal Shadeed: 150 MW
- Vale Oman: 110 MW
- Oman Refineries: 45 MW
- ... (12 شركة إجمالاً)

### 4. Hooks

#### useRealTimeData.ts
Hook مخصص لإدارة البيانات المباشرة.

**الواجهة:**
```typescript
interface UseRealTimeDataReturn {
  currentStatus: PortStatus | null;    // الحالة الحالية
  historicalData: PortStatus[];         // البيانات التاريخية
  isRunning: boolean;                   // حالة التشغيل
  currentTime: Date;                    // الوقت المحاكى
  speedMultiplier: number;              // سرعة المحاكاة
  start: () => void;                    // بدء المحاكاة
  pause: () => void;                   // إيقاف المحاكاة
  setSpeed: (multiplier: number) => void; // تغيير السرعة
  jumpTime: (hours: number) => void;    // القفز في الزمن
}
```

**الاستخدام:**
```tsx
const { currentStatus, isRunning, start, pause } = useRealTimeData({
  updateInterval: 5000,  // تحديث كل 5 ثوان
  autoStart: true
});
```

---

## 🔄 إدارة الحالة

### الحالة المحلية (Local State)

المشروع يستخدم **React Hooks** لإدارة الحالة المحلية:

- `useState`: للحالة البسيطة
- `useEffect`: للآثار الجانبية
- `useMemo`: لحسابات مكلفة
- `useCallback`: لتحسين الأداء

### تدفق البيانات

```
Component State
    ↓
useRealTimeData Hook
    ↓
namaApiSimulator
    ↓
Type Definitions
    ↓
Component Props
```

### مثال: إدارة حالة الميناء

```tsx
// في DigitalTwinPage.tsx
const dataHook = useRealTimeData();

// الحالة الحالية
const currentStatus = dataHook.currentStatus;

// البيانات التاريخية
const historicalData = dataHook.historicalData;

// التحكم في المحاكاة
dataHook.start();   // بدء
dataHook.pause();   // إيقاف
dataHook.setSpeed(5); // سرعة 5x
```

---

## 🔌 التكامل مع APIs

### البنية الحالية

المشروع حالياً يستخدم **محاكي API** (`namaApiSimulator.ts`). 

### التكامل المستقبلي

للتكامل مع API حقيقي، يجب:

1. **إنشاء Service Layer:**
```typescript
// src/services/api.ts
export class NamaApiService {
  private baseUrl: string;
  
  async getPortStatus(): Promise<PortStatus> {
    const response = await fetch(`${this.baseUrl}/port/status`);
    return response.json();
  }
  
  async getCompanyReadings(companyId: string): Promise<CompanyReading[]> {
    const response = await fetch(`${this.baseUrl}/companies/${companyId}/readings`);
    return response.json();
  }
}
```

2. **تحديث Hook:**
```typescript
// في useRealTimeData.ts
const apiService = new NamaApiService();

useEffect(() => {
  const fetchData = async () => {
    const status = await apiService.getPortStatus();
    setCurrentStatus(status);
  };
  
  fetchData();
  const interval = setInterval(fetchData, updateInterval);
  return () => clearInterval(interval);
}, []);
```

3. **معالجة الأخطاء:**
```typescript
try {
  const status = await apiService.getPortStatus();
  setCurrentStatus(status);
} catch (error) {
  console.error('API Error:', error);
  // عرض رسالة خطأ للمستخدم
}
```

---

## ⚡ الأداء والتحسينات

### التحسينات المطبقة

1. **React.memo**: لتقليل إعادة الرندر
2. **useMemo**: لحسابات مكلفة
3. **useCallback**: لمنع إعادة إنشاء الدوال
4. **Lazy Loading**: للصفحات الكبيرة

### تحسينات Three.js

1. **Shadow Optimization:**
```typescript
shadow-mapSize-width={1024}  // بدلاً من 2048
shadow-mapSize-height={1024}
```

2. **Instancing**: للحاويات المتكررة
3. **LOD (Level of Detail)**: لنماذج معقدة

### تحسينات مقترحة

1. **Code Splitting:**
```typescript
const DigitalTwinPage = lazy(() => import('./pages/DigitalTwinPage'));
```

2. **Virtual Scrolling**: للجداول الكبيرة
3. **Web Workers**: للمعالجة الثقيلة
4. **Service Workers**: للتخزين المؤقت

---

## 🔒 الأمان

### الممارسات الحالية

1. **TypeScript**: للتحقق من الأنواع
2. **ESLint**: للتحقق من جودة الكود
3. **Input Validation**: في الدوال المساعدة

### تحسينات أمنية مقترحة

1. **API Authentication:**
```typescript
// إضافة رؤوس المصادقة
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

2. **XSS Protection**: تنظيف المدخلات
3. **CORS Configuration**: في Vite config
4. **Environment Variables**: للمفاتيح الحساسة

---

## 🧪 الاختبارات

### البنية المقترحة

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── services/
```

### أمثلة اختبارات

**اختبار مكون:**
```typescript
import { render, screen } from '@testing-library/react';
import { LiveMetrics } from '../components/Dashboard/LiveMetrics';

test('renders total power metric', () => {
  const mockStatus = {
    total_power_mw: 500,
    utilization_percent: 75,
    cost_per_hour: 22500,
    active_alerts: 2
  };
  
  render(<LiveMetrics currentStatus={mockStatus} />);
  expect(screen.getByText(/500 MW/i)).toBeInTheDocument();
});
```

**اختبار Hook:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useRealTimeData } from '../hooks/useRealTimeData';

test('starts simulation when start() is called', () => {
  const { result } = renderHook(() => useRealTimeData({ autoStart: false }));
  
  expect(result.current.isRunning).toBe(false);
  
  act(() => {
    result.current.start();
  });
  
  expect(result.current.isRunning).toBe(true);
});
```

---

## 📊 المقاييس والمراقبة

### مقاييس الأداء

1. **Time to First Paint (TTP)**
2. **Time to Interactive (TTI)**
3. **Frame Rate**: للرسوم ثلاثية الأبعاد
4. **Memory Usage**: لاستخدام الذاكرة

### أدوات المراقبة المقترحة

- **React DevTools**: لتحليل الأداء
- **Chrome DevTools Performance**: لتحليل الإطارات
- **Three.js Stats**: لعرض FPS والذاكرة

---

## 🚀 النشر

### بناء المشروع

```bash
npm run build
```

الملفات النهائية في `dist/`

### النشر على Vercel/Netlify

1. ربط المستودع
2. إعدادات البناء:
   - Build command: `npm run build`
   - Output directory: `dist`
3. متغيرات البيئة (إن وجدت)

---

## 📝 الملاحظات النهائية

هذا التوثيق التقني يوفر نظرة شاملة على بنية المشروع وتقنياته. للمزيد من التفاصيل، راجع:

- [دليل المطور](./DEVELOPER_GUIDE.md)
- [توثيق API](./API_DOCUMENTATION.md)
- [البنية المعمارية](./ARCHITECTURE.md)

---

**آخر تحديث**: ديسمبر 2024
**الإصدار**: 1.0.0



