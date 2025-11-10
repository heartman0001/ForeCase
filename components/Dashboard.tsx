import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Header from './Header';
import ReceivablesTable from './ReceivablesTable';
import ForecastChart from './ForecastChart';
import AddRecordModal from './AddRecordModal';
import { AddIcon, ChartIcon, ExcelIcon, FilterIcon, PdfIcon } from './icons';

interface DashboardProps {
  onNavigateToProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToProfile }) => {
  const { filteredRecords, forecastData, responsiblePeople, runForecast, applyFilters, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ responsiblePerson: 'all', hasVat: 'all', month: 'all' });

  useEffect(() => {
    applyFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRunForecast = () => {
    runForecast();
  };

  const handleExport = (format: 'PDF' | 'Excel') => {
    // In a real app, this would trigger a backend API call
    alert(`Exporting report as ${format}...`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header onNavigateToProfile={onNavigateToProfile} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Action Bar & Filters */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
                <FilterIcon className="h-6 w-6"/>
                <span>Filters</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <select name="month" value={filters.month} onChange={handleFilterChange} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All Months</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select name="responsiblePerson" value={filters.responsiblePerson} onChange={handleFilterChange} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All People</option>
                    {responsiblePeople.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="hasVat" value={filters.hasVat} onChange={handleFilterChange} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All VAT Status</option>
                    <option value="yes">With VAT</option>
                    <option value="no">Without VAT</option>
                </select>
            </div>
          </div>
          
          {/* Forecast Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Forecast & Report</h2>
              <button onClick={handleRunForecast} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </>
                ) : (
                   <> <ChartIcon className="h-5 w-5" /> Run Forecast </>
                )}
              </button>
            </div>
            <div className="h-80 w-full">
              {forecastData.length > 0 ? (
                <ForecastChart data={forecastData} />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-md">
                  <p className="text-gray-500">Run a forecast to see the chart.</p>
                </div>
              )}
            </div>
          </div>

          {/* Receivables Table Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Receivables Data</h2>
              <div className="flex gap-2">
                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  <AddIcon className="h-5 w-5" /> Add Record
                </button>
                <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                  <PdfIcon className="h-5 w-5" /> Export PDF
                </button>
                <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                  <ExcelIcon className="h-5 w-5" /> Export Excel
                </button>
              </div>
            </div>
            <ReceivablesTable records={filteredRecords} />
          </div>
        </div>
      </main>
      <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;