import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName: string;
}

export default function ExportButtons({ targetRef, fileName }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!targetRef.current) return;

    setIsExporting(true);
    const element = targetRef.current;

    // Add a class to the element to apply print-specific styles
    element.classList.add('export-mode');

    try {
      const opt = {
        margin:       0.5, // Adjusted margin for better fit
        filename:     `${fileName}.${format}`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // useCORS for images from other domains
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      if (format === 'pdf') {
        await html2pdf().set(opt).from(element).save();
      } else { // png
        const dataUrl = await html2pdf().set(opt).from(element).outputImg('datauristring');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      // Remove the class after export
      element.classList.remove('export-mode');
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2 my-4">
      <button
        onClick={() => handleExport('pdf')}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isExporting}
      >
        {isExporting ? 'Exporting PDF...' : 'Export as PDF'}
      </button>
      <button
        onClick={() => handleExport('png')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isExporting}
      >
        {isExporting ? 'Exporting PNG...' : 'Export as PNG'}
      </button>
    </div>
  );
}


