# 👨‍💻 دليل المطور - منصة التوأم الرقمي لميناء صحار

## 📋 جدول المحتويات

1. [البدء السريع](#البدء-السريع)
2. [متطلبات النظام](#متطلبات-النظام)
3. [الإعداد والتثبيت](#الإعداد-والتثبيت)
4. [بنية الكود](#بنية-الكود)
5. [إضافة مكونات جديدة](#إضافة-مكونات-جديدة)
6. [إضافة صفحات جديدة](#إضافة-صفحات-جديدة)
7. [العمل مع البيانات](#العمل-مع-البيانات)
8. [العمل مع المشهد ثلاثي الأبعاد](#العمل-مع-المشهد-ثلاثي-الأبعاد)
9. [أفضل الممارسات](#أفضل-الممارسات)
10. [حل المشاكل الشائعة](#حل-المشاكل-الشائعة)

---

## 🚀 البدء السريع

### الخطوة 1: استنساخ المشروع

```bash
git clone <repository-url>
cd sohar-digital-twin
```

### الخطوة 2: تثبيت التبعيات

```bash
npm install
```

### الخطوة 3: تشغيل المشروع

```bash
npm run dev
```

المشروع سيكون متاحاً على `http://localhost:5173`

---

## 💻 متطلبات النظام

### البرمجيات المطلوبة

- **Node.js**: الإصدار 18 أو أحدث
- **npm**: الإصدار 9 أو أحدث
- **Git**: لأي إصدار حديث

### التحقق من الإصدارات

```bash
node --version   # يجب أن يكون v18+
npm --version    # يجب أن يكون v9+
git --version
```

### المتصفحات المدعومة

- Chrome/Edge: الإصدار 90+
- Firefox: الإصدار 88+
- Safari: الإصدار 14+

---

## ⚙️ الإعداد والتثبيت

### 1. تثبيت التبعيات

```bash
npm install
```

هذا سيثبت جميع الحزم المطلوبة من `package.json`

### 2. إعداد متغيرات البيئة (اختياري)

إنشاء ملف `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Sohar Digital Twin
```

### 3. التحقق من الإعداد

```bash
npm run lint    # فحص جودة الكود
npm run build   # بناء المشروع
```

---

## 📐 بنية الكود

### هيكل المجلدات

```
src/
├── components/      # المكونات القابلة لإعادة الاستخدام
│   ├── Analytics/   # مكونات التحليلات
│   ├── Dashboard/   # مكونات لوحة التحكم
│   ├── DigitalTwin/ # مكونات المشهد ثلاثي الأبعاد
│   └── UI/          # مكونات واجهة المستخدم الأساسية
│
├── pages/           # صفحات التطبيق
├── hooks/           # React Hooks مخصصة
├── data/            # البيانات والمحاكيات
├── types/           # تعريفات TypeScript
├── utils/           # دوال مساعدة
└── styles/          # ملفات CSS
```

### معايير التسمية

- **المكونات**: PascalCase (`PortScene.tsx`)
- **الدوال**: camelCase (`generatePortStatus`)
- **الثوابت**: UPPER_SNAKE_CASE (`PORT_CAPACITY_MW`)
- **الملفات**: camelCase أو kebab-case

---

## 🧩 إضافة مكونات جديدة

### مثال: إضافة مكون بسيط

```typescript
// src/components/UI/NewComponent.tsx
import { motion } from 'framer-motion';
import type { ComponentProps } from '../../types';

interface NewComponentProps {
  title: string;
  value: number;
  onClick?: () => void;
}

export function NewComponent({ title, value, onClick }: NewComponentProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-dark-secondary p-4 rounded-lg"
      onClick={onClick}
    >
      <h3 className="text-white font-bold">{title}</h3>
      <p className="text-primary text-2xl">{value}</p>
    </motion.div>
  );
}
```

### مثال: إضافة مكون ثلاثي الأبعاد

```typescript
// src/components/DigitalTwin/New3DComponent.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { EquipmentStatus } from '../../types';

interface New3DComponentProps {
  position: [number, number, number];
  status: EquipmentStatus;
}

export function New3DComponent({ position, status }: New3DComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // دوران مستمر
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={getStatusColor(status)} />
    </mesh>
  );
}
```

---

## 📄 إضافة صفحات جديدة

### الخطوة 1: إنشاء الصفحة

```typescript
// src/pages/NewPage.tsx
import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Card } from '../components/UI/Card';

export function NewPage() {
  const { currentStatus } = useRealTimeData();
  
  if (!currentStatus) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          صفحة جديدة
        </h1>
        
        <Card>
          {/* محتوى الصفحة */}
        </Card>
      </motion.div>
    </div>
  );
}
```

### الخطوة 2: إضافة المسار

```typescript
// src/App.tsx
import { NewPage } from './pages/NewPage';

// في Routes
<Route path="/new-page" element={<NewPage />} />
```

### الخطوة 3: إضافة رابط في Navigation

```typescript
// src/components/UI/Navigation.tsx
<Link to="/new-page" className="...">
  صفحة جديدة
</Link>
```

---

## 📊 العمل مع البيانات

### إضافة شركة جديدة

```typescript
// src/data/companies.ts
export const COMPANIES: Company[] = [
  // ... الشركات الموجودة
  {
    id: 'MTR-013',
    name: 'New Company Name',
    industry: 'Manufacturing',
    base_load_mw: 25,
    location: { x: 200, y: 0, z: 150 },
    criticality: 'medium',
  },
];
```

### إضافة معدات جديدة

```typescript
// src/data/portLayout.ts
export const PORT_EQUIPMENT: Equipment[] = [
  // ... المعدات الموجودة
  {
    id: 'EQ-001',
    type: 'STS',
    name: 'New Crane',
    company_id: 'MTR-013',
    position: { x: 200, y: 0, z: 120 },
    status: 'normal',
  },
];
```

### تخصيص المحاكاة

```typescript
// src/data/namaApiSimulator.ts

// تعديل معامل الذروة
export function getPeakFactor(hour: number): number {
  // منطق مخصص
  if (hour >= 8 && hour <= 17) {
    return 1.3; // زيادة الذروة
  }
  return 0.85;
}

// إضافة منطق مخصص للشركة
export function generateCompanyReading(
  companyId: string,
  simulatedTime: Date = new Date()
): CompanyReading {
  const company = COMPANIES.find((c) => c.id === companyId);
  
  // منطق مخصص حسب نوع الصناعة
  if (company?.industry === 'Metals') {
    // معالجة خاصة للصناعات المعدنية
  }
  
  // ... باقي الكود
}
```

---

## 🎨 العمل مع المشهد ثلاثي الأبعاد

### إضافة عنصر جديد للمشهد

```typescript
// في PortScene.tsx
import { New3DComponent } from './New3DComponent';

// داخل Canvas
<New3DComponent 
  position={[100, 0, 200]} 
  status={portStatus?.companies[0]?.status || 'normal'} 
/>
```

### إضافة تفاعل مع العناصر

```typescript
import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';

export function InteractiveComponent({ position }: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log('Clicked!');
    // فتح لوحة معلومات
  };
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
```

### إضافة حركة للعناصر

```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AnimatedComponent({ position }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // حركة دورانية
      meshRef.current.rotation.y += delta;
      
      // حركة تذبذبية
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 2;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      {/* ... */}
    </mesh>
  );
}
```

---

## ✅ أفضل الممارسات

### 1. استخدام TypeScript

```typescript
// ✅ جيد
interface Props {
  title: string;
  value: number;
}

// ❌ سيء
function Component(props: any) {
  // ...
}
```

### 2. فصل الاهتمامات

```typescript
// ✅ جيد - فصل المنطق عن العرض
const data = useRealTimeData();
const processedData = useMemo(() => processData(data), [data]);

// ❌ سيء - كل شيء في مكون واحد
function Component() {
  // منطق معقد + عرض
}
```

### 3. استخدام React.memo

```typescript
// ✅ جيد - لمنع إعادة الرندر غير الضرورية
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // ...
});

// ❌ سيء - إعادة رندر في كل مرة
export function ExpensiveComponent({ data }: Props) {
  // ...
}
```

### 4. معالجة الأخطاء

```typescript
// ✅ جيد
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  console.error('Error:', error);
  setError('فشل تحميل البيانات');
}

// ❌ سيء
const result = await fetchData(); // قد يفشل
```

### 5. تحسين الأداء

```typescript
// ✅ جيد - استخدام useMemo للحسابات المكلفة
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ❌ سيء - حساب في كل رندر
const expensiveValue = heavyCalculation(data);
```

---

## 🔧 حل المشاكل الشائعة

### المشكلة 1: المشهد ثلاثي الأبعاد لا يظهر

**الحل:**
```typescript
// تأكد من أن Canvas لديه أبعاد صحيحة
<Canvas style={{ width: '100%', height: '100vh' }}>
```

### المشكلة 2: البيانات لا تتحدث

**الحل:**
```typescript
// تأكد من أن Hook يعمل
const { currentStatus, isRunning } = useRealTimeData();

// تحقق من أن المحاكاة تعمل
useEffect(() => {
  console.log('Status:', currentStatus);
}, [currentStatus]);
```

### المشكلة 3: الأخطاء في TypeScript

**الحل:**
```typescript
// تأكد من تعريف الأنواع بشكل صحيح
interface MyComponentProps {
  // ...
}

// استخدم type assertion بحذر
const data = response as PortStatus;
```

### المشكلة 4: الأداء البطيء

**الحل:**
```typescript
// استخدم React.memo
export const Component = React.memo(({ data }: Props) => {
  // ...
});

// استخدم useMemo للحسابات المكلفة
const result = useMemo(() => expensiveCalculation(data), [data]);
```

### المشكلة 5: المشاكل في Tailwind CSS

**الحل:**
```bash
# تأكد من أن Tailwind يكتشف الملفات
# في tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

---

## 📚 موارد إضافية

### الوثائق الرسمية

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### أدوات التطوير

- **React DevTools**: إضافة متصفح لتحليل React
- **Three.js Inspector**: أداة لفحص المشاهد ثلاثية الأبعاد
- **Chrome DevTools**: أدوات مطور Chrome

---

## 🤝 المساهمة

### إرشادات الالتزام

1. إنشاء فرع جديد للميزة
2. كتابة كود نظيف ومعلق
3. اختبار التغييرات
4. إنشاء Pull Request

### معايير الكود

- استخدام ESLint
- اتباع معايير TypeScript
- كتابة تعليقات واضحة
- استخدام أسماء وصفية

---

## 📞 الدعم

للأسئلة أو المشاكل:

1. راجع [التوثيق التقني](./TECHNICAL_DOCUMENTATION.md)
2. ابحث في Issues الموجودة
3. أنشئ Issue جديد مع تفاصيل المشكلة

---

**آخر تحديث**: ديسمبر 2024

