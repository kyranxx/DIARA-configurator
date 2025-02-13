import React from 'react';
import { BraceletBuilder } from './components/BraceletBuilder';
import { BeadProvider } from './contexts/BeadContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Mock data - in real app this would come from Shopify
const mockBeads = [
  {
    id: 1,
    name: "Pearl Bead",
    price: 29.99,
    imageUrl: "/images/placeholder-bead.jpg",
    stock: 10,
    textures: {
      diffuse: "/images/placeholder-bead.jpg",
      normal: "/images/placeholder-bead.jpg",
      roughness: "/images/placeholder-bead.jpg"
    }
  }
];

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BeadProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                DIARA Bracelet Configurator
              </h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <BraceletBuilder availableBeads={mockBeads} />
          </main>
        </div>
      </BeadProvider>
    </ErrorBoundary>
  );
};
