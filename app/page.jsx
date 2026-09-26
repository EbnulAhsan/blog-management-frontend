import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome to <span className="text-blue-600">BlogSpace</span>
          </h1>
          <p className="text-gray-600">
            Navbar, Layouts and Components are integrated successfully!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}