
import React from 'react';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Users",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      number: "40%",
      label: "Average Revenue Increase",
      color: "text-green-600"
    },
    {
      icon: Clock,
      number: "3x",
      label: "Faster Diagnostics",
      color: "text-purple-600"
    },
    {
      icon: DollarSign,
      number: "$2M+",
      label: "Generated for Customers",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Trusted by Industry Leaders
        </h2>
        <p className="text-blue-100 text-lg">
          Join thousands of repair professionals who've transformed their business
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
            <div className="text-blue-100 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
