import React, { useEffect, useState } from 'react';
import { getInstallments } from '../services/installmentService';
import { Installment } from '../types';
import { format, isFuture, parseISO } from 'date-fns';

const UpcomingInstallments = () => {
  const [upcoming, setUpcoming] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const allInstallments = await getInstallments();
        
        const upcomingInstallments = allInstallments
          .filter(inst => {
            if (!inst.expected_payment_date || inst.status === 'Paid') {
              return false;
            }
            const dueDate = parseISO(inst.expected_payment_date);
            return isFuture(dueDate);
          })
          .sort((a, b) => new Date(a.expected_payment_date!).getTime() - new Date(b.expected_payment_date!).getTime())
          .slice(0, 5); // Get top 5

        setUpcoming(upcomingInstallments);
      } catch (err) {
        setError('Failed to fetch upcoming installments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white h-full">
      <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
      {upcoming.length === 0 ? (
        <p className="text-gray-400">No upcoming deadlines found.</p>
      ) : (
        <ul className="space-y-4">
          {upcoming.map(inst => (
            <li key={inst.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{inst.projects?.project_name}</p>
                <p className="text-sm text-gray-400">
                  Due: {format(parseISO(inst.expected_payment_date!), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(inst.amount)}
                </p>
                <p className={`text-sm font-semibold ${inst.status === 'Pending' ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {inst.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingInstallments;
