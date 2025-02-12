import React from 'react';
import type { Bead } from '../../../types';

interface ControlsProps {
  beads: Bead[];
  selectedBeadIndex: number | null;
  onBeadSelect: (bead: Bead) => void;
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void;
  totalPrice: number;
}

export const Controls: React.FC<ControlsProps> = ({
  beads,
  selectedBeadIndex,
  onBeadSelect,
  onRotationChange,
  totalPrice,
}) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Available Beads</h3>
        <div className="grid grid-cols-3 gap-2">
          {beads.map((bead) => (
            <button
              key={bead.id}
              onClick={() => onBeadSelect(bead)}
              className="p-2 border rounded hover:bg-gray-100"
            >
              <img src={bead.imageUrl} alt={bead.name} className="w-full h-auto" />
              <p className="mt-1 text-sm">{bead.name}</p>
              <p className="text-sm font-semibold">${bead.price}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedBeadIndex !== null && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Rotation Controls</h3>
          <div className="space-y-2">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex items-center">
                <label className="w-20">{axis.toUpperCase()} Rotation:</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  onChange={(e) => onRotationChange(axis as 'x' | 'y' | 'z', Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 border-t pt-4">
        <h3 className="text-xl font-bold">Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>
    </div>
  );
};
