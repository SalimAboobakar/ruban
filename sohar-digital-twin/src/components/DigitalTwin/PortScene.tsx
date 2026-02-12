import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { Ship } from './Ship';
import { Truck } from './Truck';
import { Warehouse } from './Warehouse';
import { STSCrane } from './STSCrane';
import { RTGCrane } from './RTGCrane';
import { ContainerStacks } from './ContainerStacks';
import { OilRefinery } from './OilRefinery';
import { SolarPanels } from './SolarPanels';
import { WindTurbine } from './WindTurbine';
import { StorageTank } from './StorageTank';
import type { PortStatus } from '../../types';

interface PortSceneProps {
  className?: string;
  portStatus?: PortStatus | null;
}

export function PortScene({ className, portStatus }: PortSceneProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', backgroundColor: '#1a1a2e' }}>
      <Canvas
        shadows
        camera={{ position: [0, 500, 800], fov: 65 }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerspectiveCamera makeDefault position={[0, 500, 800]} fov={65} />

        {/* Sky & Lighting */}
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[200, 200, 100]} intensity={1.2} castShadow />
        <directionalLight position={[-100, 100, 50]} intensity={0.6} />
        <hemisphereLight args={['#87ceeb', '#0c4a6e', 0.7]} />

        {/* Ocean - HUGE */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -100]} receiveShadow>
          <planeGeometry args={[3000, 2000]} />
          <meshStandardMaterial color="#0c4a6e" />
        </mesh>

        {/* ============ المنطقة 1: الأرصفة والسفن (أمام البحر) ============ */}
        
        {/* Berth 1 - Container Terminal (الأكبر) */}
        <mesh position={[-200, 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[500, 5, 100]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Berth 2 - Oil Terminal */}
        <mesh position={[450, 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[350, 5, 100]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>

        {/* السفن - متباعدة */}
        <Ship position={[-400, -4, -50]} rotation={[0, Math.PI / 2, 0]} status={portStatus?.companies[0]?.status || 'normal'} name="MV Sohar Star" type="container" />
        <Ship position={[-200, -4, -50]} rotation={[0, Math.PI / 2, 0]} status={portStatus?.companies[1]?.status || 'medium'} name="MV Gulf Express" type="container" />
        <Ship position={[0, -4, -50]} rotation={[0, Math.PI / 2, 0]} status={portStatus?.companies[2]?.status || 'normal'} name="MV Oman Pride" type="container" />
        <Ship position={[350, -4, -50]} rotation={[0, Math.PI / 2, 0]} status={portStatus?.companies[3]?.status || 'high'} name="MT Arabian Oil" type="tanker" />
        <Ship position={[550, -4, -50]} rotation={[0, Math.PI / 2, 0]} status={portStatus?.companies[4]?.status || 'medium'} name="MT Gulf Trader" type="tanker" />

        {/* ============ المنطقة 2: رافعات STS على حافة الرصيف ============ */}
        <STSCrane position={[-400, 0, 80]} status={portStatus?.companies[0]?.status || 'normal'} name="STS-1" companyName="Hutchison" />
        <STSCrane position={[-250, 0, 80]} status={portStatus?.companies[0]?.status || 'medium'} name="STS-2" companyName="Hutchison" />
        <STSCrane position={[-100, 0, 80]} status={portStatus?.companies[1]?.status || 'normal'} name="STS-3" companyName="Hutchison" />
        <STSCrane position={[50, 0, 80]} status={portStatus?.companies[2]?.status || 'normal'} name="STS-4" companyName="Steinweg" />
        <STSCrane position={[450, 0, 80]} status={portStatus?.companies[3]?.status || 'high'} name="STS-5" companyName="Oil Terminal" />

        {/* ============ المنطقة 3: ساحات الحاويات (منظمة بصفوف واضحة) ============ */}
        
        {/* الصف الأول - قريب من الرافعات */}
        <ContainerStacks position={[-450, 0, 200]} status="normal" rows={5} columns={8} height={4} />
        <ContainerStacks position={[-330, 0, 200]} status="medium" rows={5} columns={8} height={5} />
        <ContainerStacks position={[-210, 0, 200]} status="normal" rows={5} columns={8} height={4} />
        <ContainerStacks position={[-90, 0, 200]} status="high" rows={5} columns={8} height={5} />
        <ContainerStacks position={[30, 0, 200]} status="normal" rows={5} columns={8} height={4} />
        <ContainerStacks position={[150, 0, 200]} status="medium" rows={5} columns={8} height={4} />
        
        {/* الصف الثاني - أبعد قليلاً */}
        <ContainerStacks position={[-400, 0, 300]} status="normal" rows={4} columns={7} height={3} />
        <ContainerStacks position={[-280, 0, 300]} status="normal" rows={4} columns={7} height={4} />
        <ContainerStacks position={[-160, 0, 300]} status="medium" rows={4} columns={7} height={3} />
        <ContainerStacks position={[-40, 0, 300]} status="normal" rows={4} columns={7} height={4} />
        <ContainerStacks position={[80, 0, 300]} status="high" rows={4} columns={7} height={5} />

        {/* رافعات RTG في ساحات الحاويات */}
        <RTGCrane position={[-400, 0, 230]} status={portStatus?.companies[0]?.status || 'normal'} name="RTG-1" companyName="Yard-A" />
        <RTGCrane position={[-250, 0, 230]} status={portStatus?.companies[0]?.status || 'medium'} name="RTG-2" companyName="Yard-A" />
        <RTGCrane position={[-100, 0, 230]} status={portStatus?.companies[1]?.status || 'normal'} name="RTG-3" companyName="Yard-B" />
        <RTGCrane position={[50, 0, 230]} status={portStatus?.companies[2]?.status || 'high'} name="RTG-4" companyName="Yard-C" />

        {/* ============ المنطقة 4: المستودعات (صف واضح في الخلف) ============ */}
        <Warehouse position={[-450, 15, 450]} size={[80, 30, 50]} status={portStatus?.companies[0]?.status || 'normal'} name="Sohar Aluminum" />
        <Warehouse position={[-280, 15, 460]} size={[75, 28, 48]} status={portStatus?.companies[1]?.status || 'medium'} name="Jindal Shadeed" />
        <Warehouse position={[-110, 15, 450]} size={[85, 30, 52]} status={portStatus?.companies[2]?.status || 'high'} name="Vale Oman" />
        <Warehouse position={[70, 15, 460]} size={[70, 26, 45]} status={portStatus?.companies[3]?.status || 'normal'} name="Logistics Hub" />
        <Warehouse position={[220, 15, 450]} size={[80, 28, 50]} status={portStatus?.companies[4]?.status || 'medium'} name="Freezone" />

        {/* ============ المنطقة 5: مصفاة النفط والخزانات (الجانب الأيمن) ============ */}
        
        {/* Oil Refinery - واضحة ومنفصلة */}
        <OilRefinery position={[700, 0, 250]} status={portStatus?.companies[3]?.status || 'high'} />
        
        {/* Oil Storage Tanks - منظمة بصفوف */}
        <StorageTank position={[850, 10, 150]} color="#8b0000" size={14} />
        <StorageTank position={[850, 10, 200]} color="#8b0000" size={14} />
        <StorageTank position={[850, 10, 250]} color="#8b0000" size={14} />
        <StorageTank position={[920, 10, 175]} color="#c0c0c0" size={12} />
        <StorageTank position={[920, 10, 225]} color="#c0c0c0" size={12} />
        <StorageTank position={[920, 10, 275]} color="#c0c0c0" size={12} />

        {/* ============ المنطقة 6: الطاقة المتجددة (الجانب الأيسر - واضحة) ============ */}
        
        {/* Solar Panels - مزرعتين واضحتين */}
        <SolarPanels position={[-750, 0, 200]} />
        <SolarPanels position={[-750, 0, 330]} />
        
        {/* Wind Turbines - صف منظم */}
        <WindTurbine position={[-900, 0, 150]} />
        <WindTurbine position={[-900, 0, 250]} />
        <WindTurbine position={[-900, 0, 350]} />
        <WindTurbine position={[-980, 0, 200]} />
        <WindTurbine position={[-980, 0, 300]} />

        {/* ============ الطرق - شبكة واضحة ============ */}
        
        {/* الطريق الرئيسي أمام الأرصفة */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0.3, 140]} receiveShadow>
          <planeGeometry args={[1200, 15]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        
        {/* طريق إلى المستودعات */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-100, 0.3, 330]} receiveShadow>
          <planeGeometry args={[800, 12]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* طريق للمصفاة */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[600, 0.3, 220]} receiveShadow>
          <planeGeometry args={[12, 300]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        
        {/* طرق عمودية متصلة */}
        {[-400, -200, 0, 200].map((x, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.3, 270]} receiveShadow>
            <planeGeometry args={[12, 260]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        ))}

        {/* ============ الشاحنات المتحركة (5 فقط) ============ */}
        <Truck position={[-300, 0, 140]} color="#fbbf24" isMoving route="road1" />
        <Truck position={[0, 0, 140]} color="#3b82f6" isMoving route="road1" />
        <Truck position={[300, 0, 140]} color="#10b981" isMoving route="road1" />
        <Truck position={[-200, 0, 330]} color="#ef4444" isMoving route="road2" />
        <Truck position={[100, 0, 330]} color="#8b5cf6" isMoving route="road2" />

        {/* ============ مرافق الميناء ============ */}
        
        {/* برج المراقبة - واضح في موقع مركزي */}
        <group position={[-600, 0, 300]}>
          <mesh castShadow>
            <cylinderGeometry args={[12, 15, 60, 16]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
          <mesh position={[0, 35, 0]} castShadow>
            <cylinderGeometry args={[10, 10, 12, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 35, 0]}>
            <cylinderGeometry args={[10.2, 10.2, 11, 16]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
          </mesh>
          {/* Radar */}
          <mesh position={[0, 43, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 6, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
          <pointLight position={[0, 45, 0]} color="#ef4444" intensity={60} distance={100} />
        </group>

        {/* بوابة الأمن */}
        <group position={[-650, 0, 140]}>
          <mesh castShadow>
            <boxGeometry args={[8, 10, 2]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 10, 0]}>
            <boxGeometry args={[12, 4, 2]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>

        {/* أعمدة الإنارة - صف منظم */}
        {Array.from({ length: 16 }).map((_, i) => {
          const x = -650 + (i * 90);
          return (
            <group key={`light-${i}`} position={[x, 0, 110]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.6, 0.9, 28, 8]} />
                <meshStandardMaterial color="#4b5563" metalness={0.7} />
              </mesh>
              <mesh position={[0, 14, 0]}>
                <sphereGeometry args={[1.5, 12, 12]} />
                <meshStandardMaterial 
                  color="#fef3c7" 
                  emissive="#fef3c7" 
                  emissiveIntensity={0.6}
                />
              </mesh>
              <pointLight position={[0, 14, 0]} color="#fef3c7" intensity={60} distance={70} />
            </group>
          );
        })}

        {/* Grid Helper للمقياس */}
        <gridHelper args={[3000, 60, '#1e40af', '#1e3a8a']} position={[0, -2.5, 200]} />

        {/* Controls - موقع أفضل للكاميرا */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={200}
          maxDistance={1500}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0, 200]}
        />
      </Canvas>

      {/* معلومات الميناء - محسّنة */}
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-95 p-4 rounded-xl text-white text-sm shadow-2xl border border-primary/30">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <p className="font-bold text-primary text-base">⚡ ميناء صحار الذكي</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-primary">🚢</span>
            <span>السفن: <strong>5</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-warning">🏗️</span>
            <span>الرافعات: <strong>9</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">📦</span>
            <span>الحاويات: <strong>11 ساحة</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-danger">🏭</span>
            <span>المستودعات: <strong>5</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-danger">🛢️</span>
            <span>مصفاة نفط: <strong>1</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🚛</span>
            <span>الشاحنات: <strong>5</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">☀️</span>
            <span>طاقة شمسية: <strong>192 لوح</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">💨</span>
            <span>طاقة رياح: <strong>5 توربين</strong></span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-700 flex items-center gap-2">
          <span className="text-xs text-success">♻️ مبادرة الطاقة المتجددة 2024</span>
        </div>
      </div>

      {/* مفاتيح التحكم */}
      <div className="absolute top-20 right-4 bg-gray-900 bg-opacity-90 p-3 rounded-lg text-white text-xs">
        <p className="font-bold mb-2">🎮 التحكم:</p>
        <p>🖱️ اسحب: تدوير</p>
        <p>🔍 العجلة: تكبير</p>
        <p>👆 انقر: اختيار</p>
      </div>
    </div>
  );
}
