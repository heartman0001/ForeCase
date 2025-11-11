import React, { useEffect, useState } from 'react';
import { getInstallments } from '../services/installmentService';
import { isPast, parseISO } from 'date-fns';

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

  const formatCurrency = (amount: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);

  if (loading) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">Loading Metrics...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white h-full">
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Total Revenue (Paid)</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(metrics.totalRevenue)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Outstanding Revenue</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(metrics.outstandingRevenue)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Overdue Installments</p>
          <p className="text-2xl font-bold text-red-500">{metrics.overdueCount}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
