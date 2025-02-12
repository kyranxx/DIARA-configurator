import React, { useState, useCallback } from 'react';
import { BraceletScene } from './BraceletScene';
import { Controls } from './Controls';
import type { Bead, BeadPosition } from '../../../types';

interface BraceletBuilderProps {
  availableBeads: Bead[];
}

export const BraceletBuilder: React.FC<BraceletBuilderProps> = ({ availableBeads }) => {
  const [beadPositions, setBeadPositions] = useState<BeadPosition[]>([]);
  const [selectedBeadIndex, setSelectedBeadIndex] = useState<number | null>(null);

  const handleBeadSelect = useCallback((bead: Bead) => {
    setBeadPositions((current) => [
      ...current,
      {
        index: current.length,
        bead,
        rotation: [0, 0, 0],
      },
    ]);
  }, []);

  const handleBeadClick = useCallback((index: number) => {
    setSelectedBeadIndex(index);
  }, []);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedBeadIndex === null) return;

    setBeadPositions((current) => {
      const newPositions = [...current];
      const rotation = [...newPositions[selectedBeadIndex].rotation];
      const axisIndex = { x: 0, y: 1, z: 2 }[axis];
      rotation[axisIndex] = (value * Math.PI) / 180;
      newPositions[selectedBeadIndex] = {
        ...newPositions[selectedBeadIndex],
        rotation: rotation as [number, number, number],
      };
      return newPositions;
    });
  }, [selectedBeadIndex]);

  const totalPrice = beadPositions.reduce((sum, pos) => sum + pos.bead.price, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <BraceletScene beads={beadPositions} onBeadClick={handleBeadClick} />
        </div>
        <Controls
          beads={availableBeads}
          selectedBeadIndex={selectedBeadIndex}
          onBeadSelect={handleBeadSelect}
          onRotationChange={handleRotationChange}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};
