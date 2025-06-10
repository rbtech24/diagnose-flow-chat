
import React from 'react';
import { CheckCircle, Users, Zap, Shield, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Transform Your
          <span className="text-blue-600 block">Repair Business</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Join 10,000+ repair professionals who've streamlined their operations, 
          increased revenue by 40%, and delivered exceptional customer service.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
          <p className="text-sm text-gray-600">Diagnose issues 3x faster with AI-powered workflows</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Team Ready</h3>
          <p className="text-sm text-gray-600">Manage multiple technicians and schedules effortlessly</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
          <p className="text-sm text-gray-600">Enterprise-grade security with 99.9% uptime</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Grow Revenue</h3>
          <p className="text-sm text-gray-600">Average 40% increase in monthly revenue</p>
        </div>
      </div>
    </div>
  );
}
