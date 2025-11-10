
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Receivable, ForecastDataPoint } from '../types';

// Mock initial data
const initialReceivables: Receivable[] = [
  { id: '1', customerName: 'TechCorp', amount: 50000, dueDate: '2024-08-15', creditTerms: 30, hasVat: true, responsiblePerson: 'Alice', installments: 1 },
  { id: '2', customerName: 'Innovate LLC', amount: 75000, dueDate: '2024-08-20', creditTerms: 45, hasVat: false, responsiblePerson: 'Bob', installments: 3 },
  { id: '3', customerName: 'Solutions Inc.', amount: 30000, dueDate: '2024-09-05', creditTerms: 30, hasVat: true, responsiblePerson: 'Alice', installments: 1 },
  { id: '4', customerName: 'Global Co.', amount: 120000, dueDate: '2024-09-25', creditTerms: 60, hasVat: true, responsiblePerson: 'Charlie', installments: 6 },
  { id: '5', customerName: 'Pioneer Ltd.', amount: 45000, dueDate: '2024-10-10', creditTerms: 30, hasVat: false, responsiblePerson: 'Bob', installments: 1 },
];

interface DataContextType {
  records: Receivable[];
  filteredRecords: Receivable[];
  forecastData: ForecastDataPoint[];
  responsiblePeople: string[];
  addRecord: (record: Omit<Receivable, 'id'>) => void;
  runForecast: () => Promise<void>;
  applyFilters: (filters: { responsiblePerson: string; hasVat: string; month: string }) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<Receivable[]>(initialReceivables);
  const [filteredRecords, setFilteredRecords] = useState<Receivable[]>(initialReceivables);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const responsiblePeople = useMemo(() => [...new Set(records.map(r => r.responsiblePerson))], [records]);

  const addRecord = (record: Omit<Receivable, 'id'>) => {
    const newRecord = { ...record, id: (Math.random() + 1).toString(36).substring(7) };
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords); // Reset filters or apply current filters
  };

  const runForecast = async (): Promise<void> => {
    setLoading(true);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const newData = months.map(month => ({
          month,
          forecasted: Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000,
        }));
        setForecastData(newData);
        setLoading(false);
        resolve();
      }, 1500);
    });
  };

  const applyFilters = (filters: { responsiblePerson: string; hasVat: string; month: string }) => {
    let tempRecords = [...records];
    
    if (filters.responsiblePerson !== 'all') {
      tempRecords = tempRecords.filter(r => r.responsiblePerson === filters.responsiblePerson);
    }

    if (filters.hasVat !== 'all') {
      tempRecords = tempRecords.filter(r => r.hasVat === (filters.hasVat === 'yes'));
    }

    if (filters.month !== 'all') {
        const monthIndex = new Date(`${filters.month} 1, 2024`).getMonth();
        tempRecords = tempRecords.filter(r => new Date(r.dueDate).getMonth() === monthIndex);
    }

    setFilteredRecords(tempRecords);
  };


  return (
    <DataContext.Provider value={{ records, filteredRecords, forecastData, responsiblePeople, addRecord, runForecast, applyFilters, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
