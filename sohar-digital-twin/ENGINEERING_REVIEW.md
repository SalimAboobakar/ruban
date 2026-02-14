# 🔬 المراجعة الهندسية لمشروع التوأم الرقمي لميناء صحار

## 📋 **ملخص المشاكل المكتشفة**

### ❌ **1. السعة الكلية غير منطقية**
- **المشكلة**: `PORT_CAPACITY_MW = 585 MW`
- **الحمل الأساسي الكلي**: 609 MW (145+112+90+45+18+32+15+28+52+38+22+12)
- **الخطأ**: السعة أقل من الحمل الأساسي! 
- **التصحيح المطلوب**: السعة يجب أن تكون على الأقل 750-800 MW (بهامش احتياطي 15-30%)

### ❌ **2. استهلاك Sohar Aluminum غير واقعي**
- **الحالي**: 145 MW
- **الواقع الهندسي**: 
  - مصانع الألمنيوم تستهلك 13-15 kWh/kg ألمنيوم
  - إنتاج Sohar Aluminum: ~360,000 طن/سنة = ~41 طن/ساعة
  - الاستهلاك الحقيقي: 41,000 kg × 14 kWh/kg = 574 MW!
- **التصحيح**: يجب أن يكون على الأقل 400-600 MW أو تقليل الإنتاج المفترض

### ❌ **3. حساب CO₂ خاطئ**
- **الحالي**: `cleanEnergyMW * 0.92 = طن CO₂/ساعة`
- **المعامل 0.92 غير صحيح!**
- **التصحيح الهندسي**:
  - الغاز الطبيعي ينتج ~0.45 طن CO₂/MWh
  - الفحم ينتج ~0.9 طن CO₂/MWh
  - عُمان تستخدم الغاز بشكل أساسي
  - **الصحيح**: 45 MW × 0.45 = 20.25 طن CO₂/ساعة

### ❌ **4. معدل تكلفة الكهرباء غير دقيق**
- **الحالي**: 80 $/MWh
- **الواقع في عُمان**: 30-50 $/MWh للقطاع الصناعي
- **التصحيح**: استخدام 45 $/MWh كمتوسط

### ❌ **5. حالات الحمل (Status Thresholds) خطيرة**
- **الحالي**: 
  - Normal: 0-70%
  - Medium: 70-85%
  - High: 85-100%+
- **المشكلة**: تشغيل معدات كهربائية فوق 85% خطر!
- **التصحيح الهندسي**:
  - Normal: 0-75% (تشغيل آمن)
  - Medium: 75-90% (يحتاج مراقبة)
  - High/Critical: 90-100%+ (خطر - يحتاج تدخل فوري)

### ❌ **6. عدد الشركات غير متطابق**
- **المذكور**: 280+ شركة
- **الموجود في الكود**: 12 شركة فقط!
- **التصحيح**: إما إضافة بقية الشركات (بأحمال صغيرة) أو تعديل الوصف

### ❌ **7. معامل الذروة (Peak Factor) يحتاج مراجعة**
- **الحالي**: 
  - Peak (8am-6pm): 1.3× (زيادة 30%)
  - Off-peak: 0.85× (انخفاض 15%)
- **التحقق**: هل هذه النسب واقعية للصناعات الثقيلة؟
- **ملاحظة**: الصناعات الثقيلة (ألمنيوم، حديد) تعمل 24/7 بحمل شبه ثابت!
- **التصحيح**: 
  - صناعات ثقيلة: peak factor 1.0-1.1 (تقريباً ثابت)
  - صناعات خفيفة/لوجستية: peak factor 1.2-1.4

---

## ✅ **الإصلاحات المطلوبة**

### 1. تصحيح السعة الكلية
```typescript
// companies.ts
export const PORT_CAPACITY_MW = 800; // بدلاً من 585
```

### 2. تصحيح استهلاك الشركات الكبرى
```typescript
// companies.ts
{
  id: 'MTR-001',
  name: 'Sohar Aluminum',
  base_load_mw: 500, // بدلاً من 145
},
{
  id: 'MTR-002',
  name: 'Jindal Shadeed',
  base_load_mw: 180, // بدلاً من 112
},
{
  id: 'MTR-003',
  name: 'Vale Oman',
  base_load_mw: 120, // بدلاً من 90
}
```

### 3. تصحيح حساب CO₂
```typescript
// DigitalTwinPage.tsx
const co2EmissionFactor = 0.45; // طن CO2/MWh للغاز الطبيعي
const co2Saved = cleanEnergyMW * co2EmissionFactor;
```

### 4. تصحيح معدل التكلفة
```typescript
// calculations.ts
export function calculateCost(powerMW: number, ratePerMWh: number = 45): number {
  return powerMW * ratePerMWh;
}
```

### 5. تصحيح حدود الحالات
```typescript
// statusColors.ts
export function getStatus(currentMW: number, baseMW: number): EquipmentStatus {
  if (currentMW <= 0.01) return 'idle';
  
  const loadPercentage = (currentMW / baseMW) * 100;
  
  if (loadPercentage >= 90) return 'high';     // Critical level
  if (loadPercentage >= 75) return 'medium';   // Warning level
  return 'normal';                              // Safe operating range
}
```

### 6. تحسين معامل الذروة حسب نوع الصناعة
```typescript
// namaApiSimulator.ts
export function getPeakFactorByIndustry(hour: number, industry: Industry): number {
  const isPeakHour = hour >= 8 && hour <= 17;
  
  // Heavy industries operate 24/7 with minimal variation
  if (industry === 'Metals' || industry === 'Petrochemicals') {
    return getRandomVariance(0.95, 1.05); // ±5% only
  }
  
  // Light industries and logistics follow demand patterns
  if (industry === 'Logistics' || industry === 'Manufacturing') {
    return isPeakHour ? 1.3 : 0.75;
  }
  
  return isPeakHour ? 1.2 : 0.85; // Default
}
```

---

## 📊 **معلومات إضافية للمحكمين**

### معامل القدرة (Power Factor)
```typescript
// إضافة إلى types/index.ts
export interface CompanyReading {
  // ... existing fields
  power_factor?: number;  // 0.85-0.95 typical for industrial loads
  reactive_power_mvar?: number; // Reactive power in MVAr
}
```

### كفاءة النظام (System Efficiency)
```typescript
export interface PortStatus {
  // ... existing fields
  system_efficiency: number;  // 85-95% typical
  transmission_losses_mw: number; // 2-5% of total power
}
```

---

## 🎯 **الخلاصة**

المشروع يحتاج:
1. ✅ تصحيح السعة الكلية
2. ✅ تصحيح استهلاك الشركات الكبرى
3. ✅ تصحيح معادلة CO₂
4. ✅ تصحيح معدل التكلفة
5. ✅ تصحيح حدود الحالات
6. ✅ إضافة واقعية لمعامل الذروة حسب نوع الصناعة

---

**المراجع الهندسية:**
- International Aluminum Institute - Aluminum Smelting Energy Data
- ASHRAE Standards for Power Systems
- IEEE Standards for Electrical Power Systems
- Oman Power and Water Procurement Company (OPWP) Data

