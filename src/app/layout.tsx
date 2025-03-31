import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/context/AuthContext';
import NavBar from '../components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Expense Tracker',
  description: 'Track your expenses with AI-powered insights and smart categorization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-gray-50 min-h-full flex flex-col`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                {children}
              </div>
            </main>

            <footer className="bg-white border-t border-gray-200">
              <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  Powered by OpenAI and Next.js • Track your expenses smarter
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
