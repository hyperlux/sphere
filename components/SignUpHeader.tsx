import React from 'react';
import Link from 'next/link';

const SignUpHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-800 to-teal-500 shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        Welcome to Auroville Social
      </div>
      <Link href="/signup">
        <button className="bg-white text-blue-800 font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
          Sign Up
        </button>
      </Link>
    </header>
  );
};

export default SignUpHeader;
