import React from 'react';

export default function QuickStats() {
  return (
    <div className="bg-[#1E1E1E] py-12 border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-auroville-primary mb-2">3,200+</div>
            <div className="text-gray-400">Residents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-auroville-primary mb-2">56</div>
            <div className="text-gray-400">Nationalities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-auroville-primary mb-2">1968</div>
            <div className="text-gray-400">Founded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-auroville-primary mb-2">20km²</div>
            <div className="text-gray-400">Township Area</div>
          </div>
        </div>
      </div>
    </div>
  );
}
