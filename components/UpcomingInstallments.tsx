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
      <h2 className="text-xl font-semibold mb-4 text-[#2826a9]">Upcoming Deadlines</h2>
      {upcoming.length === 0 ? (
        <p className="text-gray-500">No upcoming deadlines found.</p>
      ) : (
        <ul className="space-y-4">
          {upcoming.map(inst => (
            <li key={inst.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <p className="font-semibold text-[#2b71ed]">{inst.projects?.project_name}</p>
                <p className="text-sm text-gray-500">
                  Due: {format(parseISO(inst.expected_payment_date!), 'dd MMM yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[#2826a9]">
                  {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(inst.amount)}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    inst.status === 'Pending' ? 'text-yellow-500' : 'text-gray-500'
                  }`}
                >
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
