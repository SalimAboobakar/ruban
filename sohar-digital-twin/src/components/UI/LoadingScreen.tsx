import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Loader2 size={48} className="text-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Initializing Digital Twin
        </h2>
        <p className="text-gray-400">Loading port infrastructure and real-time data...</p>
        
        <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

