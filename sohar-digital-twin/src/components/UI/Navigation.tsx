import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Boxes, 
  Zap, 
  Building2, 
  BarChart3, 
  Bell,
  Leaf
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'لوحة التحكم', icon: Home },
  { path: '/digital-twin', label: 'التوأم الرقمي', icon: Boxes },
  { path: '/energy', label: 'مصادر الطاقة', icon: Zap },
  { path: '/companies', label: 'الشركات', icon: Building2 },
  { path: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { path: '/alerts', label: 'التنبيهات', icon: Bell },
  { path: '/sustainability', label: 'الاستدامة', icon: Leaf },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-dark-secondary border-b border-primary/20 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
              SP
            </div>
            <div className="hidden md:block">
              <h1 className="text-white font-bold text-lg">ميناء صحار الذكي</h1>
              <p className="text-gray-400 text-xs">Sohar Smart Port</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                      ${isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:block text-sm font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success text-sm font-medium hidden md:block">
              Live
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

