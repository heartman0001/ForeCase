import React, { useEffect, useState } from 'react';
import { getInstallments } from '../services/installmentService';

const KeyMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    outstandingRevenue: 0,
    overdueCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        setLoading(true);
        const installments = await getInstallments();

        let totalRevenue = 0;
        let outstandingRevenue = 0;
        let overdueCount = 0;

        installments.forEach(inst => {
          if (inst.status === 'Paid') {
            totalRevenue += inst.amount;
          } else {
            outstandingRevenue += inst.amount;
            if (inst.status === 'Overdue') {
              overdueCount++;
            }
          }
        });

        setMetrics({ totalRevenue, outstandingRevenue, overdueCount });
      } catch (err) {
        setError('Failed to calculate key metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    calculateMetrics();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);

  if (loading) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md text-[#2826a9]">
        Loading Metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#2826a9]">Key Metrics</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Total Revenue (Paid)</p>
          <p className="text-2xl font-bold text-[#2b71ed]">
            {formatCurrency(metrics.totalRevenue)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Outstanding Revenue</p>
          <p className="text-2xl font-bold text-[#2826a9]">
            {formatCurrency(metrics.outstandingRevenue)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Overdue Installments</p>
          <p className="text-2xl font-bold text-red-600">{metrics.overdueCount}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
