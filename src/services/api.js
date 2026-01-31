// src/services/api.js

// നാളെ Backend URL ഇവിടെ കൊടുത്താൽ മതി
// const API_URL = "http://localhost:8000/api"; 

// Mock Data (ഇത് തൽക്കാലം Backend ഇല്ലാത്തതുകൊണ്ട്)
const MOCK_SERVICES = [
  {
    id: 1,
    category: 'Hair',
    name: 'Classic Fade',
    description: 'Clean fade with scissors trim on top.',
    price: 250,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    category: 'Hair',
    name: 'Buzz Cut',
    description: 'Low maintenance, military style cut.',
    price: 200,
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 3,
    category: 'Beard',
    name: 'Beard Sculpting',
    description: 'Professional shaping with hot towel.',
    price: 150,
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 4,
    category: 'Facial',
    name: 'Charcoal Detox',
    description: 'Deep cleaning for glowing skin.',
    price: 450,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 5,
    category: 'Hair',
    name: 'Kids Cut',
    description: 'Gentle styling for the little ones.',
    price: 180,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=300'
  },
];

export const api = {
  // 1. Get All Services (Simulating API Call)
  getServices: async () => {
    // നാളെ ഇവിടെ: return axios.get(`${API_URL}/services`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_SERVICES); // 0.5 സെക്കൻഡ് കഴിഞ്ഞ് ഡാറ്റ തരും (Real Feel)
      }, 500);
    });
  },

  // 2. Get Categories
  getCategories: async () => {
    return [
      { id: 'All', label: 'All' },
      { id: 'Hair', label: 'Haircuts' },
      { id: 'Beard', label: 'Beard' },
      { id: 'Facial', label: 'Facials' },
    ];
  }
};