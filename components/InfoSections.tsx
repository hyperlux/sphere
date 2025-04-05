import React from 'react';
import { Info, MapPin, Calendar, Book, Users, Leaf, Heart } from 'lucide-react';

export default function InfoSections() {
  return (
    <div id="learn-more" className="bg-[#1E1E1E] py-16 md:py-20 scroll-mt-16"> {/* Added scroll-mt */}
      <div className="container mx-auto px-6">
        {/* About Auroville */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 md:mb-12 text-center">About Auroville</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl">
              <Info className="w-8 h-8 text-orange-500 mb-4" /> {/* Use text-orange-500 */}
              <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
              <p className="text-gray-400">
                Auroville is an experimental township in South India dedicated to human unity and
                conscious living. Founded in 1968, it's a place where people from all over the world
                come together to build a universal city.
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl">
              <MapPin className="w-8 h-8 text-orange-500 mb-4" /> {/* Use text-orange-500 */}
              <h3 className="text-xl font-bold text-white mb-4">Location</h3>
              <p className="text-gray-400">
                Located in Tamil Nadu, India, near Puducherry. The township spans across 20 square kilometers,
                with the Matrimandir at its center, surrounded by various zones including residential,
                cultural, and industrial areas.
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl">
              <Users className="w-8 h-8 text-orange-500 mb-4" /> {/* Use text-orange-500 */}
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-gray-400">
                Home to over 3,200 residents from around 56 different countries. The community works
                together in various fields including education, environmental regeneration, health care,
                and cultural activities.
              </p>
            </div>
          </div>
        </div>

        {/* Visitor Information */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 md:mb-12 text-center">Visitor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl">
              <Calendar className="w-8 h-8 text-orange-500 mb-4" /> {/* Use text-orange-500 */}
              <h3 className="text-xl font-bold text-white mb-4">Planning Your Visit</h3>
              <ul className="text-gray-400 space-y-3">
                <li>• Visitor Center open daily: 9:00 AM - 5:30 PM</li>
                <li>• Matrimandir viewing point: 9:00 AM - 5:00 PM</li>
                <li>• Guided tours available</li>
                <li>• Various guest houses and accommodations</li>
              </ul>
            </div>
            <div className="bg-[#2A2A2A] p-6 md:p-8 rounded-xl">
              <Book className="w-8 h-8 text-orange-500 mb-4" /> {/* Use text-orange-500 */}
              <h3 className="text-xl font-bold text-white mb-4">Activities & Programs</h3>
              <ul className="text-gray-400 space-y-3">
                <li>• Cultural events and workshops</li>
                <li>• Volunteering opportunities</li>
                <li>• Educational programs</li>
                <li>• Art exhibitions and performances</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 md:mb-12 text-center">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Note: These links currently point to '#'. Update hrefs as needed. */}
            <a href="#" className="bg-[#2A2A2A] p-6 rounded-xl hover:bg-[#333] transition-colors block">
              <Leaf className="w-6 h-6 text-orange-500 mb-3" /> {/* Use text-orange-500 */}
              <h3 className="text-lg font-bold text-white mb-2">Sustainability</h3>
              <p className="text-gray-400 text-sm">
                Learn about our environmental initiatives and sustainable practices.
              </p>
            </a>
            <a href="#" className="bg-[#2A2A2A] p-6 rounded-xl hover:bg-[#333] transition-colors block">
              <Heart className="w-6 h-6 text-orange-500 mb-3" /> {/* Use text-orange-500 */}
              <h3 className="text-lg font-bold text-white mb-2">Get Involved</h3>
              <p className="text-gray-400 text-sm">
                Discover ways to participate and contribute to Auroville's growth.
              </p>
            </a>
            <a href="#" className="bg-[#2A2A2A] p-6 rounded-xl hover:bg-[#333] transition-colors block">
              <Book className="w-6 h-6 text-orange-500 mb-3" /> {/* Use text-orange-500 */}
              <h3 className="text-lg font-bold text-white mb-2">Publications</h3>
              <p className="text-gray-400 text-sm">
                Access our library of publications, research, and documentation.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
