import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortScene } from './components/DigitalTwin/PortScene';
import { SimpleTestScene } from './components/DigitalTwin/SimpleTestScene';
import { LiveMetrics } from './components/Dashboard/LiveMetrics';
import { EnergyChart } from './components/Dashboard/EnergyChart';
import { CompanyTable } from './components/Dashboard/CompanyTable';
import { AlertsPanel } from './components/Dashboard/AlertsPanel';
import { PredictionsView } from './components/Analytics/PredictionsView';
import { TimeControl } from './components/UI/TimeControl';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { useRealTimeData } from './hooks/useRealTimeData';
import { generatePredictions } from './data/predictions';

function App() {
  const [testMode, setTestMode] = useState(false);
  
  const {
    currentStatus,
    historicalData,
    isRunning,
    currentTime,
    speedMultiplier,
    start,
    pause,
    setSpeed,
    jumpTime,
  } = useRealTimeData({
    updateInterval: 5000,
    autoStart: true,
  });

  // Generate AI predictions
  const predictions = useMemo(() => {
    if (!currentStatus) return [];
    return generatePredictions(currentStatus);
  }, [currentStatus]);

  const handlePlayPause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  // Show loading screen while data initializes
  if (!currentStatus) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-screen h-screen bg-dark overflow-hidden flex flex-col"
      >
      {/* Header */}
      <header className="h-16 bg-dark border-b border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sohar Port Digital Twin</h1>
            <p className="text-xs text-gray-400">Real-time Energy Monitoring System</p>
          </div>
        </div>

        {/* Time Controls & Status */}
        <div className="flex items-center gap-6">
          <TimeControl
            isRunning={isRunning}
            currentTime={currentTime}
            speedMultiplier={speedMultiplier}
            onPlayPause={handlePlayPause}
            onSpeedChange={setSpeed}
            onJumpTime={jumpTime}
          />

          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-300">{isRunning ? 'Live' : 'Paused'}</span>
          </div>
          
          {/* Test Mode Toggle */}
          <button
            onClick={() => setTestMode(!testMode)}
            className="px-3 py-1 text-xs bg-warning text-dark rounded hover:bg-orange-500"
          >
            {testMode ? 'Full Port' : 'Test 3D'}
          </button>
        </div>
      </header>

      {/* Main 3D View - Takes up most of the screen */}
      <div style={{ height: 'calc(100vh - 64px - 120px)' }}>
        {testMode ? (
          <SimpleTestScene />
        ) : (
          <PortScene className="w-full h-full" portStatus={currentStatus} />
        )}
      </div>

      {/* Compact Bottom Panel */}
      <div className="h-[120px] bg-dark border-t border-gray-700 overflow-hidden">
        <LiveMetrics portStatus={currentStatus} />
      </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
