
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    // Only redirect logged-in users to their respective dashboards
    // if they have a valid role
    if (isAuthenticated && userRole) {
      if (['admin', 'company', 'tech'].includes(userRole)) {
        navigate(`/${userRole}`);
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Repair Auto Pilot</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate(`/${userRole}`)}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <main>
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The Ultimate Appliance Repair Solution
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Manage your technicians, optimize workflows, and improve customer service with our comprehensive platform.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate(`/${userRole}`)}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/signup">Get started</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/about">Learn more</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Powerful Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your repair service
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    Technician Management
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Easily invite, onboard, and manage your technicians. Track their skills, availability, and performance.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    Diagnostic Tools
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Access powerful diagnostic workflows to quickly identify and resolve appliance issues.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    Knowledge Base
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Build a comprehensive knowledge base for your technicians. Share technical documents, guides, and best practices.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-gray-300">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-gray-300">
                Contact
              </Link>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-400">
                &copy; {new Date().getFullYear()} Repair Auto Pilot. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
