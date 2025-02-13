import React, { useCallback, Suspense, useEffect } from 'react';
import { BraceletScene } from './BraceletScene';
import { Controls } from './Controls';
import { ErrorBoundary } from '../ErrorBoundary';
import { useBeadContext, beadActions } from '../../contexts/BeadContext';
import type { Bead } from '../../../types';

interface BraceletBuilderProps {
  availableBeads: Bead[];
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

export const BraceletBuilder: React.FC<BraceletBuilderProps> = ({ availableBeads }) => {
  const { state, dispatch } = useBeadContext();
  const { selectedBeads, selectedBeadIndex, isLoading } = state;

  // Initialize available beads
  useEffect(() => {
    dispatch(beadActions.setAvailableBeads(availableBeads));
  }, [availableBeads, dispatch]);

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => dispatch(beadActions.setLoading(false)), 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleBeadSelect = useCallback((bead: Bead) => {
    dispatch(beadActions.addSelectedBead({
      index: selectedBeads.length,
      bead,
      rotation: [0, 0, 0],
    }));
  }, [dispatch, selectedBeads.length]);

  const handleBeadClick = useCallback((index: number) => {
    dispatch(beadActions.selectBead(index));
  }, [dispatch]);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedBeadIndex === null) return;

    const rotation = [...selectedBeads[selectedBeadIndex].rotation];
    const axisIndex = { x: 0, y: 1, z: 2 }[axis];
    rotation[axisIndex] = (value * Math.PI) / 180;
    
    dispatch(beadActions.updateBeadRotation(selectedBeadIndex, rotation as [number, number, number]));
  }, [dispatch, selectedBeadIndex, selectedBeads]);

  const totalPrice = selectedBeads.reduce((sum, pos) => sum + pos.bead.price, 0);

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              {isLoading ? (
                <LoadingFallback />
              ) : (
                <BraceletScene beads={selectedBeads} onBeadClick={handleBeadClick} />
              )}
            </Suspense>
          </div>
          <Controls />
        </div>
      </div>
    </ErrorBoundary>
  );
};
