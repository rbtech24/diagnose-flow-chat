
import React from 'react';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: '40%',
      label: 'Faster Diagnoses',
      description: 'Average time reduction in repair diagnosis'
    },
    {
      icon: Clock,
      value: '2.5x',
      label: 'More Jobs',
      description: 'Increase in daily job completion'
    },
    {
      icon: Users,
      value: '10K+',
      label: 'Technicians',
      description: 'Trust our platform nationwide'
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Customer Rating',
      description: 'Average satisfaction score'
    }
  ];

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Proven Results Across the Industry
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how repair professionals are transforming their businesses
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
