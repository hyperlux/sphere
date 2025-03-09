export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="max-w-4xl mx-auto mt-16 text-center">
        <h1 className="text-4xl font-bold text-amber-600 mb-4">
          Welcome to AuroNet
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Where Auroville's spirit meets digital collaboration
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
