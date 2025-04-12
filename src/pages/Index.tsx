import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Star, StarHalf, ChevronLeft, ChevronRight, Check, ArrowRight, BarChart, Headphones, Shield, Clock } from "lucide-react";

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
        {/* Hero section with stronger CTA */}
        <div className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
              <svg className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>
              <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
                {/* Navigation handled above */}
              </div>
              <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Revolutionize Your</span>
                    <span className="block text-blue-600">Appliance Repair Business</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                    Boost productivity by 40%, increase first-time fix rates, and deliver exceptional customer experiences with our all-in-one repair management platform.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    {isAuthenticated ? (
                      <Button size="lg" onClick={() => navigate(`/${userRole}`)}>
                        Go to Dashboard
                      </Button>
                    ) : (
                      <>
                        <div className="rounded-md shadow">
                          <Button size="lg" className="w-full" asChild>
                            <Link to="/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
                          </Button>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <Button variant="outline" size="lg" className="w-full" asChild>
                            <Link to="/about">Learn More</Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 text-sm text-gray-500">
                    No credit card required • 30-day free trial • Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full" src="/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png" alt="Technician using tablet" />
          </div>
        </div>

        {/* Key metrics */}
        <div className="bg-blue-600">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-white">40%</div>
                <div className="mt-2 text-xl font-medium text-blue-100">Increased Productivity</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-white">82%</div>
                <div className="mt-2 text-xl font-medium text-blue-100">First-Time Fix Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-white">50%</div>
                <div className="mt-2 text-xl font-medium text-blue-100">Reduced Training Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by companies section - enhanced */}
        <div className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
              Trusted by leading appliance repair companies nationwide
            </h2>
            <div className="mx-auto mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 lg:mx-0 lg:gap-x-10">
              <div className="flex justify-center">
                <div className="flex h-12 items-center justify-center px-6 py-8">
                  <span className="text-xl font-bold text-gray-700">FixMaster</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex h-12 items-center justify-center px-6 py-8">
                  <span className="text-xl font-bold text-gray-700">AppliTech</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex h-12 items-center justify-center px-6 py-8">
                  <span className="text-xl font-bold text-gray-700">HomeServe</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex h-12 items-center justify-center px-6 py-8">
                  <span className="text-xl font-bold text-gray-700">RepairPro</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex h-12 items-center justify-center px-6 py-8">
                  <span className="text-xl font-bold text-gray-700">TechFix</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core features section - enhanced */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Revolutionary Platform</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your repair service
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our all-in-one platform gives your team the tools they need to diagnose problems accurately, 
                fix appliances efficiently, and keep customers happy.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-blue-100 p-2 ring-1 ring-blue-200">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <dt className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                    Technician Management
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    <p>
                      Easily invite, onboard, and manage your technicians. Track their skills, availability, and performance in real-time.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Skill-based assignment</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Performance analytics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Route optimization</span>
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-blue-100 p-2 ring-1 ring-blue-200">
                    <Headphones className="h-6 w-6 text-blue-600" />
                  </div>
                  <dt className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                    Diagnostic Tools
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    <p>
                      Access powerful diagnostic workflows to quickly identify and resolve appliance issues with confidence.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Interactive decision trees</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Visual diagnostics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Problem-specific solutions</span>
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-blue-100 p-2 ring-1 ring-blue-200">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <dt className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                    Knowledge Base
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    <p>
                      Build a comprehensive knowledge base for your technicians. Share technical documents, guides, and best practices.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Searchable repository</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Manufacturer documentation</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-blue-600" />
                        <span>Offline access</span>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Pricing section - new */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Plans for businesses of all sizes
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Choose the plan that's right for your business. All plans include a 30-day free trial.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
              {/* Starter Plan */}
              <div className="rounded-2xl p-8 ring-1 ring-gray-200 xl:p-10">
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">Technician</h3>
                  <p className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">Most popular</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  Ideal for small repair businesses with 1-5 technicians.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">$49</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month per technician</span>
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" />
                    <span>All diagnostic tools</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" />
                    <span>Knowledge base access</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 w-full" variant="outline">
                  <Link to="/signup">Start free trial</Link>
                </Button>
              </div>
  
              {/* Enterprise Plan */}
              <div className="rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-900 xl:p-10">
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-white">Enterprise</h3>
                  <p className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold leading-5 text-white">Best value</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">
                  For growing businesses with 6+ technicians and advanced needs.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">$39</span>
                  <span className="text-sm font-semibold leading-6 text-gray-300">/month per technician</span>
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-400" />
                    <span>Everything in Technician</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-400" />
                    <span>Custom workflows</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-400" />
                    <span>API access</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-400" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-400" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 w-full bg-white text-gray-900 hover:bg-gray-100">
                  <Link to="/contact">Contact sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials section - enhanced */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What our customers are saying
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join hundreds of appliance repair businesses already succeeding with Repair Auto Pilot.
              </p>
            </div>
            
            <div className="relative mt-16">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
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
            </div>
          </div>
        </div>

        {/* CTA section - new */}
        <div className="bg-blue-600">
          <div className="mx-auto max-w-7xl py-12 px-6 lg:flex lg:items-center lg:py-16 lg:px-8">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" id="newsletter-headline">
                Ready to transform your repair business?
              </h2>
              <p className="mt-3 max-w-3xl text-lg leading-6 text-blue-100">
                Join hundreds of repair companies who are saving time, reducing costs, and delighting customers with Repair Auto Pilot.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="sm:flex">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <Link to="/signup">
                    Start Your Free Trial <Clock className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
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
