import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Wrench, Building2, Workflow, BarChart, ShieldCheck, Gauge, Clock } from "lucide-react";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0fb2afe9-44dd-487d-b13a-f6a2c630c477.png" 
              alt="Repair Auto Pilot" 
              className="h-24"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-blue-600">Features</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-blue-600">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium hover:text-blue-600">Pricing</a>
            <Button asChild variant="outline">
              <Link to="/login">
                Login
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/login">
                Get Started
              </Link>
            </Button>
          </nav>
          <Button asChild variant="outline" className="md:hidden">
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                  Appliance Diagnostics on <span className="text-blue-600">Auto Pilot</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-xl">
                  Streamline your repair operations with our diagnostic workflows. Boost first-time fix rates and keep your technicians at peak efficiency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/login">
                      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="#features">
                      See Features
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>14-day trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Easy setup</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-white shadow-xl rounded-lg border overflow-hidden">
                  <div className="bg-gray-50 border-b px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <div className="ml-2 text-sm font-medium text-gray-600">Appliance Repair</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <img 
                      src="/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png" 
                      alt="Technician repairing appliance" 
                      className="rounded border shadow-sm w-full"
                    />
                  </div>
                </div>
                <div className="absolute -z-10 -top-10 -right-10 h-64 w-64 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -z-10 -bottom-10 -left-10 h-64 w-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 border-y bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600 mb-8">Trusted by leading appliance service companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <img 
                src="/lovable-uploads/7e681dc0-4482-451f-9178-70944b120422.png" 
                alt="Rod's Appliance Repair" 
                className="h-16 object-contain"
              />
              <img 
                src="/lovable-uploads/9114fbcf-64bb-4446-a213-40d08149538a.png" 
                alt="West Metro Appliance" 
                className="h-16 object-contain" 
              />
              <img 
                src="/lovable-uploads/83ff694d-eb6c-4d23-9e13-2f1b96f3258e.png" 
                alt="Flat Rate Appliance Repair" 
                className="h-24 object-contain" 
              />
              <img 
                src="/lovable-uploads/c9eb6e16-d7c1-438f-86bb-eefa6fa5ad0e.png" 
                alt="Einstein Appliance Repair" 
                className="h-16 object-contain"
              />
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Repair Auto Pilot?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our platform streamlines diagnostic workflows, improves technician productivity, and boosts customer satisfaction.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Diagnostic Workflows</h3>
                  <p className="text-gray-600">Create custom diagnostic workflows that guide technicians through troubleshooting step-by-step.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-green-100 text-green-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Increased First-Time Fix Rate</h3>
                  <p className="text-gray-600">Improve your first-time fix rate by up to 35% with guided diagnostics and parts identification.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-purple-100 text-purple-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reduce Diagnostic Time</h3>
                  <p className="text-gray-600">Cut diagnostic time by up to 50% with our AI-assisted troubleshooting system.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-amber-100 text-amber-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
                  <p className="text-gray-600">Track technician performance, identify training opportunities, and optimize service delivery.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-red-100 text-red-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Multi-Level Access</h3>
                  <p className="text-gray-600">Different roles for technicians, company admins, and system administrators.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="bg-indigo-100 text-indigo-600 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Data Storage</h3>
                  <p className="text-gray-600">All your diagnostic data and customer information is securely stored and backed up.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. See what our customers have to say about Repair Auto Pilot.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <div>★★★★★</div>
                  </div>
                  <p className="mb-4 text-gray-600 italic">"Since implementing Repair Auto Pilot, our first-time fix rate has increased by 32%. Our technicians love the guided workflows."</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">P</div>
                    <div>
                      <div className="font-medium">Paul</div>
                      <div className="text-sm text-gray-500">Service Manager, Service Wranglers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <div>★★★★★</div>
                  </div>
                  <p className="mb-4 text-gray-600 italic">"The diagnostic workflows have been a game-changer for our new technicians. Training time reduced by 40% with the step-by-step guides."</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">N</div>
                    <div>
                      <div className="font-medium">Nick</div>
                      <div className="text-sm text-gray-500">Owner, West Metro Appliance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <div>★★★★★</div>
                  </div>
                  <p className="mb-4 text-gray-600 italic">"Customer satisfaction is up 28% since we started using Repair Auto Pilot. The professional diagnostic reports really impress our clients."</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">R</div>
                    <div>
                      <div className="font-medium">Robert</div>
                      <div className="text-sm text-gray-500">CEO, Einstein Appliance Repair</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Repair Service?</h2>
            <p className="max-w-2xl mx-auto mb-8">Join the hundreds of appliance repair companies already using Repair Auto Pilot to streamline their operations.</p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/login">
                Start Your Free Trial
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/lovable-uploads/0fb2afe9-44dd-487d-b13a-f6a2c630c477.png" 
                  alt="Repair Auto Pilot" 
                  className="h-24"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                The ultimate appliance repair diagnostic solution for modern service businesses.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">Case Studies</a></li>
                <li><a href="#" className="hover:text-blue-600">Reviews</a></li>
                <li><a href="#" className="hover:text-blue-600">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Community</a></li>
                <li><a href="#" className="hover:text-blue-600">Status</a></li>
                <li><a href="#" className="hover:text-blue-600">Get Started</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <Link to="/terms-of-use" className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
              <span className="text-gray-400">|</span>
              <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
