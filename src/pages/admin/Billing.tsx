
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function Billing() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage subscriptions, payments, and billing information</p>
        </div>
        <Button>
          <CreditCard className="w-4 h-4 mr-2" />
          Update Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-blue-600">89</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">TechFlow Pro - Monthly</p>
                <p className="text-sm text-gray-600">Acme Corporation</p>
                <p className="text-xs text-gray-500">Dec 1, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">$79.00</p>
                <Badge variant="outline" className="text-green-600 border-green-600">Paid</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">TechFlow Starter - Monthly</p>
                <p className="text-sm text-gray-600">Smith & Co</p>
                <p className="text-xs text-gray-500">Dec 1, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">$29.00</p>
                <Badge variant="outline" className="text-green-600 border-green-600">Paid</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">TechFlow Pro - Monthly</p>
                <p className="text-sm text-gray-600">Johnson Services</p>
                <p className="text-xs text-gray-500">Nov 30, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">$79.00</p>
                <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
