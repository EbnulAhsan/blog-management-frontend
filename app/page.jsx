export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to <span className="text-blue-600">BlogSpace</span>
        </h1>
        <p className="text-gray-600">
          Next.js Blog Management Application setup is running cleanly.
        </p>
      </div>
    </div>
  );
}