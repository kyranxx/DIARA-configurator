import React from 'react';

const Controls = ({ availableBeads, selectedBead, onBeadSelect, onSave }) => {
  return (
    <div className="w-1/4 p-4 border-l">
      <h2 className="text-xl font-bold mb-4">Available Beads</h2>
      <div className="grid grid-cols-2 gap-4">
        {availableBeads.map((bead) => (
          <button
            key={bead.id}
            className={`p-2 border rounded ${
              selectedBead?.id === bead.id ? 'border-blue-500' : ''
            }`}
            onClick={() => onBeadSelect(bead)}
          >
            <img src={bead.imageUrl} alt={bead.name} className="w-full" />
            <p className="mt-1 text-sm">{bead.name}</p>
            <p className="text-sm text-gray-600">${bead.price}</p>
          </button>
        ))}
      </div>
      
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
        onClick={onSave}
      >
        Save Design
      </button>
    </div>
  );
};

export default Controls;
