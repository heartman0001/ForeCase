
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Receivable } from '../types';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose }) => {
  const { addRecord, responsiblePeople } = useData();
  const initialState = {
    customerName: '',
    amount: '',
    dueDate: '',
    creditTerms: '30',
    hasVat: false,
    responsiblePerson: responsiblePeople[0] || '',
    installments: '1',
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Omit<Receivable, 'id'> = {
        ...formData,
        amount: parseFloat(formData.amount),
        creditTerms: parseInt(formData.creditTerms, 10),
        installments: parseInt(formData.installments, 10)
    };
    addRecord(newRecord);
    setFormData(initialState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Receivable</h3>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form fields */}
                <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div>
                    <label htmlFor="creditTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credit Terms (days)</label>
                    <input type="number" name="creditTerms" value={formData.creditTerms} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div>
                    <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsible Person</label>
                    <select name="responsiblePerson" value={formData.responsiblePerson} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500">
                        {responsiblePeople.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="installments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Installments</label>
                    <input type="number" name="installments" value={formData.installments} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                 <div className="flex items-center col-span-1 md:col-span-2">
                    <input type="checkbox" name="hasVat" checked={formData.hasVat} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <label htmlFor="hasVat" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Has VAT</label>
                </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Record</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
