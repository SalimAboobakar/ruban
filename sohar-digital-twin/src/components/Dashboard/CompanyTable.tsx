import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import type { PortStatus } from '../../types';
import { formatPower } from '../../utils/formatters';
import { Badge } from '../UI/Badge';
import { Card } from '../UI/Card';
import { getCompanyProfileById } from '../../data/companyEnergyProfiles';

interface CompanyTableProps {
  currentStatus: PortStatus | null;
  onViewProfile?: (companyName: string) => void;
}

type SortKey = 'company_name' | 'current_power_mw' | 'status';
type SortOrder = 'asc' | 'desc';

export function CompanyTable({ currentStatus, onViewProfile }: CompanyTableProps) {
  if (!currentStatus) return null;
  
  const companies = currentStatus.companies;
  const [sortKey, setSortKey] = useState<SortKey>('current_power_mw');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [companies, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown size={14} className="text-gray-500" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-primary" />
    ) : (
      <ArrowDown size={14} className="text-primary" />
    );
  };

  return (
    <Card title="Company Energy Status" subtitle={`${companies.length} companies monitored`}>
      <div className="overflow-y-auto max-h-[250px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th
                className="text-left px-3 py-2 text-gray-300 font-semibold cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('company_name')}
              >
                <div className="flex items-center gap-2">
                  Company
                  <SortIcon columnKey="company_name" />
                </div>
              </th>
              <th
                className="text-right px-3 py-2 text-gray-300 font-semibold cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('current_power_mw')}
              >
                <div className="flex items-center justify-end gap-2">
                  Power
                  <SortIcon columnKey="current_power_mw" />
                </div>
              </th>
              <th
                className="text-center px-3 py-2 text-gray-300 font-semibold cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center gap-2">
                  Status
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="text-center px-3 py-2 text-gray-300 font-semibold">
                Trend
              </th>
              <th className="text-center px-3 py-2 text-gray-300 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => {
              // Try to find profile by company name
              const profileId = company.company_name === 'Sohar Aluminum' ? 'SA-001' : null;
              const hasProfile = profileId !== null;
              
              return (
                <tr
                  key={company.meter_id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-3 py-2 text-white font-medium">
                    {company.company_name}
                  </td>
                  <td className="px-3 py-2 text-right text-white font-mono">
                    {formatPower(company.current_power_mw)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge variant={company.status}>
                      {company.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-gray-400">
                      {company.trend === 'increasing' && '↗'}
                      {company.trend === 'decreasing' && '↘'}
                      {company.trend === 'stable' && '→'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {hasProfile && onViewProfile && (
                      <button
                        onClick={() => onViewProfile(company.company_name)}
                        className="flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye size={14} />
                        View Profile
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

