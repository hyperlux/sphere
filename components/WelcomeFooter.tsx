import React from 'react';
import Link from 'next/link';

export default function WelcomeFooter() {
  return (
    <footer className="bg-[#1E1E1E] py-10 md:py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <img src="/logodark.png" alt="Auroville" className="h-10 md:h-12 mx-auto mb-4 md:mb-6" />
          <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
             Auroville Universal Township • Tamil Nadu, India
           </p>
           <div className="flex justify-center gap-4 md:gap-6">
             <Link href="/login" className="text-orange-500 hover:text-orange-600 transition-colors text-sm md:text-base"> {/* Use text-orange-500 and hover:text-orange-600 */}
               Community Portal
             </Link>
             {/* Note: These links currently point to '#'. Update hrefs as needed. */}
             <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors text-sm md:text-base"> {/* Use text-orange-500 and hover:text-orange-600 */}
               Contact
             </a>
             <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors text-sm md:text-base"> {/* Use text-orange-500 and hover:text-orange-600 */}
               Newsletter
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
