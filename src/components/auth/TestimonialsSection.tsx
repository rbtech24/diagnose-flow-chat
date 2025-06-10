
import React from 'react';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Owner, Johnson Appliance Repair",
      content: "Repair Auto Pilot transformed my business. I went from struggling with paperwork to running 3 teams efficiently. Revenue is up 60% this year!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Chen",
      role: "Lead Technician, Tech Solutions",
      content: "The diagnostic workflows are incredible. What used to take me 2 hours now takes 30 minutes. Customers love the professional reports.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Lisa Rodriguez",
      role: "Manager, City Repair Hub",
      content: "Managing 12 technicians was chaos before. Now everything is organized, scheduled perfectly, and our customer satisfaction is at 98%.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Loved by Repair Professionals
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-600 font-medium">4.9/5 from 2,847+ reviews</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Quote className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
            <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
            <div className="flex items-center space-x-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
