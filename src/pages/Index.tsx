
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Star, StarHalf, ChevronLeft, ChevronRight } from "lucide-react";

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

        {/* Trusted by companies section */}
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-gray-600">
              Trusted by leading appliance repair companies nationwide
            </h2>
            <div className="mx-auto mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 lg:mx-0 lg:gap-x-10">
              <div className="flex justify-center grayscale transition duration-300 hover:grayscale-0">
                <div className="flex h-12 items-center justify-center rounded-lg bg-white px-6 py-8 shadow-sm">
                  <span className="text-xl font-bold text-gray-700">FixMaster</span>
                </div>
              </div>
              <div className="flex justify-center grayscale transition duration-300 hover:grayscale-0">
                <div className="flex h-12 items-center justify-center rounded-lg bg-white px-6 py-8 shadow-sm">
                  <span className="text-xl font-bold text-gray-700">AppliTech</span>
                </div>
              </div>
              <div className="flex justify-center grayscale transition duration-300 hover:grayscale-0">
                <div className="flex h-12 items-center justify-center rounded-lg bg-white px-6 py-8 shadow-sm">
                  <span className="text-xl font-bold text-gray-700">HomeServe</span>
                </div>
              </div>
              <div className="flex justify-center grayscale transition duration-300 hover:grayscale-0">
                <div className="flex h-12 items-center justify-center rounded-lg bg-white px-6 py-8 shadow-sm">
                  <span className="text-xl font-bold text-gray-700">RepairPro</span>
                </div>
              </div>
              <div className="flex justify-center grayscale transition duration-300 hover:grayscale-0">
                <div className="flex h-12 items-center justify-center rounded-lg bg-white px-6 py-8 shadow-sm">
                  <span className="text-xl font-bold text-gray-700">TechFix</span>
                </div>
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

        {/* Testimonials section */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What our customers are saying
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <div className="flex items-center gap-x-1 text-blue-600">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div className="mt-6 text-lg font-semibold text-gray-900">
                    Revolutionized our workflow
                  </div>
                  <div className="mt-2 text-base text-gray-600">
                    "Since implementing Repair Auto Pilot, our technicians are completing 30% more jobs per day. The diagnostic tools are incredibly accurate, and the mobile app works flawlessly in the field."
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">Mark Johnson</div>
                  <div className="text-sm text-gray-600">CEO, FixMaster Appliances</div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <div className="flex items-center gap-x-1 text-blue-600">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div className="mt-6 text-lg font-semibold text-gray-900">
                    Customer satisfaction skyrocketed
                  </div>
                  <div className="mt-2 text-base text-gray-600">
                    "Our customer satisfaction scores have improved by 45% since we started using Repair Auto Pilot. First-time fix rates are up, and our technicians love the knowledge base."
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">Sarah Miller</div>
                  <div className="text-sm text-gray-600">Operations Manager, HomeServe Plus</div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <div className="flex items-center gap-x-1 text-blue-600">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <StarHalf className="h-5 w-5 fill-current" />
                  </div>
                  <div className="mt-6 text-lg font-semibold text-gray-900">
                    Training time cut in half
                  </div>
                  <div className="mt-2 text-base text-gray-600">
                    "We've been able to onboard new technicians in half the time thanks to the diagnostic workflows and knowledge base. The system is intuitive and has become essential to our operations."
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">David Chen</div>
                  <div className="text-sm text-gray-600">Technical Director, AppliTech Services</div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <Button variant="outline" size="lg" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 ml-4">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
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
