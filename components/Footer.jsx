import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span>BlogSpace</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} BlogSpace Platform. All rights reserved by Ebnul Ahsan.
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <Link href="/" className="hover:text-blue-600 transition">
                            Home
                        </Link>
                        <Link href="/login" className="hover:text-blue-600 transition">
                            Login
                        </Link>
                        <Link href="/register" className="hover:text-blue-600 transition">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}