import React from 'react';

const Controls = ({ availableBeads, selectedBead, onBeadSelect, onSave, totalPrice }) => {
  return (
    <div className="h-full flex flex-col p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Available Beads</h2>
      
      <div className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {availableBeads.map((bead) => (
            <button
              key={bead.id}
              className={`p-2 border rounded transition-colors ${
                selectedBead?.id === bead.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
              }`}
              onClick={() => onBeadSelect(bead)}
            >
              <div className="aspect-square relative mb-2">
                <img 
                  src={bead.imageUrl} 
                  alt={bead.name} 
                  className="w-full h-full object-cover rounded"
                />
                {bead.stock < 5 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Low Stock
                  </span>
                )}
              </div>
              <p className="font-medium text-sm truncate">{bead.name}</p>
              <p className="text-sm text-gray-600">${bead.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total Price:</span>
          <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
          onClick={onSave}
        >
          Save Design
        </button>
      </div>
    </div>
  );
};

export default Controls;
