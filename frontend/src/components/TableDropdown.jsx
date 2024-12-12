import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Check } from 'lucide-react';

const TableDropdown = ({ tables = [], selectedTable, onTableChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-[-40px] right-4 w-64">
      <div className="relative">
        {/* Bouton principal qui ouvre/ferme la liste */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-2 text-left
            bg-white border rounded-lg shadow-sm
            flex items-center justify-between
            hover:bg-gray-50 transition-colors
            ${isOpen ? 'ring-2 ring-black' : ''}
          `}
        >
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {selectedTable || 'Sélectionner une table'}
            </span>
          </div>
          {isOpen ? 
            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500" />
          }
        </button>

        {/* Liste déroulante */}
        {isOpen && (
          <div className="
            absolute z-10 w-full mt-1
            bg-white border rounded-lg shadow-lg
            py-1 max-h-60 overflow-auto
          ">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => {
                  onTableChange(table);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm
                  flex items-center justify-between
                  hover:bg-gray-50 transition-colors
                  ${selectedTable === table ? 'bg-gray-50' : ''}
                `}
              >
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-400" />
                  {table}
                </span>
                {selectedTable === table && (
                  <Check className="h-4 w-4 text-black" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDropdown;