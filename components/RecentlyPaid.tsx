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
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md text-[#2826a9]">
        Loading...
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
      <h2 className="text-xl font-semibold mb-4 text-[#2826a9]">Recently Paid</h2>
      {recent.length === 0 ? (
        <p className="text-gray-500">No recently paid items found.</p>
      ) : (
        <ul className="space-y-4">
          {recent.map(inst => (
            <li key={inst.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <p className="font-semibold text-[#2b71ed]">{inst.projects?.project_name}</p>
                <p className="text-sm text-gray-500">
                  Paid on: {format(parseISO(inst.updated_at!), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">
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
