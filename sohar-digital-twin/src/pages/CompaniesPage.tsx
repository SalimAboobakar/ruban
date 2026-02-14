import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Zap, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { EnergyHealthScore } from '../components/UI/EnergyHealthScore';
import { CompanyProfile } from '../components/Dashboard/CompanyProfile';
import { getAllCompanyProfiles, getCompanyProfileById } from '../data/companyEnergyProfiles';
import type { CompanyEnergyProfile } from '../types';

export function CompaniesPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const profiles = getAllCompanyProfiles();

  // Calculate total port load
  const totalPortLoad = profiles.reduce((sum, p) => sum + p.averageLoadMW, 0);
  const totalPeakLoad = profiles.reduce((sum, p) => sum + p.peakLoadMW, 0);

  if (selectedProfileId) {
    const profile = getCompanyProfileById(selectedProfileId);
    if (profile) {
      return <CompanyProfile profile={profile} onBack={() => setSelectedProfileId(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Company Energy Profiles
          </h1>
          <p className="text-gray-400">
            Detailed energy profiles for 10 major industrial tenants in Sohar Port
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Building2 className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Companies</p>
                <p className="text-3xl font-bold text-white">{profiles.length}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Zap className="text-success" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Average Load</p>
                <p className="text-3xl font-bold text-white">{totalPortLoad.toFixed(0)}</p>
                <p className="text-xs text-gray-400">MW</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Peak Load</p>
                <p className="text-3xl font-bold text-white">{totalPeakLoad.toFixed(0)}</p>
                <p className="text-xs text-gray-400">MW</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Activity className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Avg Load Factor</p>
                <p className="text-3xl font-bold text-white">
                  {(profiles.reduce((sum, p) => sum + p.loadFactor, 0) / profiles.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:border-primary/50 transition-all h-full"
                onClick={() => setSelectedProfileId(profile.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{profile.companyName}</h3>
                    <p className="text-gray-400 text-sm">{profile.sector}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">#{profile.peakContributionRanking}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Average Load</span>
                    <span className="text-white font-semibold">{profile.averageLoadMW.toFixed(1)} MW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Peak Load</span>
                    <span className="text-white font-semibold">{profile.peakLoadMW.toFixed(1)} MW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Load Share</span>
                    <span className="text-white font-semibold">{profile.loadShareOfPort.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Load Factor</span>
                    <span className="text-white font-semibold">{profile.loadFactor.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <EnergyHealthScore score={profile.energyHealthScore} size="sm" />
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-medium">View Profile</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

