import React, { useCallback } from 'react';
import { useBeadContext, beadActions } from '@/contexts/BeadContext';
import type { Bead } from '@/types';

export const Controls: React.FC = () => {
  const { state, dispatch } = useBeadContext();
  const { availableBeads, selectedBeads, selectedBeadIndex, isLoading } = state;

  const handleBeadSelect = useCallback((bead: Bead) => {
    dispatch(beadActions.addSelectedBead({
      index: selectedBeads.length,
      bead,
      rotation: [0, 0, 0],
    }));
  }, [dispatch, selectedBeads.length]);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedBeadIndex === null) return;

    const rotation = [...selectedBeads[selectedBeadIndex].rotation];
    const axisIndex = { x: 0, y: 1, z: 2 }[axis];
    rotation[axisIndex] = (value * Math.PI) / 180;
    
    dispatch(beadActions.updateBeadRotation(selectedBeadIndex, rotation as [number, number, number]));
  }, [dispatch, selectedBeadIndex, selectedBeads]);

  const totalPrice = selectedBeads.reduce((sum, pos) => sum + pos.bead.price, 0);
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Available Beads</h3>
        <div className="grid grid-cols-3 gap-2">
          {availableBeads.map((bead) => (
            <button
              key={bead.id}
              onClick={() => handleBeadSelect(bead)}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
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
                  onChange={(e) => handleRotationChange(axis as 'x' | 'y' | 'z', Number(e.target.value))}
                  className="flex-1 disabled:opacity-50"
                  disabled={isLoading}
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
