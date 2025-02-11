import React from 'react';
import { createRoot } from 'react-dom/client';
import BraceletBuilder from './components/BraceletBuilder';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<BraceletBuilder />);
