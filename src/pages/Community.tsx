
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Star } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Join Our Community</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with other repair professionals, share experiences, and grow together in our thriving community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Discussion Forums</h3>
                <p className="text-gray-600 mb-4">
                  Engage in discussions about repair techniques, industry trends, and best practices with peers.
                </p>
                <Button variant="outline" className="w-full">
                  Join Discussions
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User Groups</h3>
                <p className="text-gray-600 mb-4">
                  Connect with repair professionals in your area and form local support networks.
                </p>
                <Button variant="outline" className="w-full">
                  Find Groups
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Star className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Success Stories</h3>
                <p className="text-gray-600 mb-4">
                  Read and share success stories from businesses using Repair Auto Pilot.
                </p>
                <Button variant="outline" className="w-full">
                  Read Stories
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Upcoming Community Events</h2>
                <p className="text-gray-600">Join our virtual and in-person events to learn and connect.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">Monthly Tech Meetup</h3>
                      <p className="text-gray-600">Virtual gathering of repair professionals to discuss industry trends.</p>
                    </div>
                    <Button size="sm">Register</Button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">Repair Workshop</h3>
                      <p className="text-gray-600">Hands-on training session for advanced diagnostic techniques.</p>
                    </div>
                    <Button size="sm">Register</Button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">Business Growth Summit</h3>
                      <p className="text-gray-600">Learn strategies to scale your repair business effectively.</p>
                    </div>
                    <Button size="sm">Register</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
