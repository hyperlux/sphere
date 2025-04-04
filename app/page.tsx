import SignUpHeader from '@/components/SignUpHeader'; // Adjusted import path assuming '@' alias for root
import InnovativeCarousel from '@/components/InnovativeCarousel'; // Adjusted import path

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignUpHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <InnovativeCarousel />
        <section className="mt-12 text-center max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Connect, Collaborate, Thrive
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join the Auroville Social platform to engage with the community,
            discover events, share resources, and build connections.
          </p>
          {/* Optional: Add a unique visual element like a wavy divider here if desired */}
          {/* Example: <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent my-8"></div> */}
        </section>
      </main>
      {/* Optional Footer can be added here */}
      {/* <footer className="w-full py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Auroville Social. All rights reserved.
      </footer> */}
    </div>
  );
}
