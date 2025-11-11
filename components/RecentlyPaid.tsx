import React, { useEffect, useState } from 'react';
import { getInstallments } from '../services/installmentService';
import { Installment } from '../types';
import { format, parseISO } from 'date-fns';

const RecentlyPaid = () => {
  const [recent, setRecent] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const allInstallments = await getInstallments();
        
        const recentlyPaidInstallments = allInstallments
          .filter(inst => inst.status === 'Paid' && inst.updated_at)
          .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
          .slice(0, 5); // Get top 5

        setRecent(recentlyPaidInstallments);
      } catch (err) {
        setError('Failed to fetch recently paid installments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white h-full">
      <h2 className="text-xl font-semibold mb-4">Recently Paid</h2>
      {recent.length === 0 ? (
        <p className="text-gray-400">No recently paid items found.</p>
      ) : (
        <ul className="space-y-4">
          {recent.map(inst => (
            <li key={inst.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{inst.projects?.project_name}</p>
                <p className="text-sm text-gray-400">
                  Paid on: {format(parseISO(inst.updated_at!), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-400">
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(inst.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentlyPaid;
