import React, { useState, useEffect } from 'react';
import BraceletScene from './BraceletScene';
import Controls from './Controls';

const BraceletBuilder = () => {
  const [beads, setBeads] = useState([]);
  const [selectedBead, setSelectedBead] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [availableBeads, setAvailableBeads] = useState([]);
  
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
    }
  };

  const saveDesign = async () => {
    try {
      const design = {
        beads: beads.map(bead => bead?.id),
        totalPrice: calculateTotalPrice(beads)
      };
      
      const response = await fetch('/api/save-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(design)
      });
      
      if (response.ok) {
        // Handle successful save
      }
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-3/4 h-full">
        <BraceletScene
          beads={beads}
          selectedPosition={selectedPosition}
          onBeadClick={handleBeadClick}
        />
      </div>
      
      <Controls
        availableBeads={availableBeads}
        selectedBead={selectedBead}
        onBeadSelect={setSelectedBead}
        onSave={saveDesign}
      />
    </div>
  );
};

export default BraceletBuilder;
