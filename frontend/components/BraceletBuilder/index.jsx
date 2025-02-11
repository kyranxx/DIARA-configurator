import React, { useState, useEffect } from 'react';
import BraceletScene from './BraceletScene';
import Controls from './Controls';

const BraceletBuilder = () => {
  const [beads, setBeads] = useState([]);
  const [selectedBead, setSelectedBead] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [availableBeads, setAvailableBeads] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    fetchAvailableBeads();
  }, []);
  
  const fetchAvailableBeads = async () => {
    try {
      const response = await fetch('/api/beads');
      const beadsData = await response.json();
      setAvailableBeads(beadsData);
    } catch (error) {
      console.error('Error loading beads:', error);
    }
  };

  const handleBeadClick = (position) => {
    if (selectedBead) {
      const newBeads = [...beads];
      newBeads[position] = selectedBead;
      setBeads(newBeads);
      setSelectedPosition(null);
      setSelectedBead(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const calculateTotalPrice = () => {
    return beads.reduce((total, bead) => total + (bead?.price || 0), 0);
  };

  const saveDesign = async () => {
    try {
      const design = {
        beads: beads.map(bead => bead?.id),
        totalPrice: calculateTotalPrice()
      };
      
      const response = await fetch('/api/save-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(design)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save design');
      }
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row">
      <div className="relative flex-grow">
        <BraceletScene
          beads={beads}
          selectedPosition={selectedPosition}
          onBeadClick={handleBeadClick}
        />
        {isMobile && (
          <button
            className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => setIsControlsOpen(!isControlsOpen)}
          >
            {isControlsOpen ? '✕' : '☰'}
          </button>
        )}
      </div>
      
      <div className={`
        ${isMobile ? 'absolute inset-y-0 right-0 w-3/4 transform transition-transform duration-300' : 'w-1/4'}
        ${isMobile && !isControlsOpen ? 'translate-x-full' : 'translate-x-0'}
        bg-white shadow-lg
      `}>
        <Controls
          availableBeads={availableBeads}
          selectedBead={selectedBead}
          onBeadSelect={setSelectedBead}
          onSave={saveDesign}
          totalPrice={calculateTotalPrice()}
        />
      </div>
    </div>
  );
};

export default BraceletBuilder;
