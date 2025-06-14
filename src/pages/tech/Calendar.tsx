
import React from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const today = new Date();

export default function TechCalendar() {
  // For future extension: fetch events from an API/useQuery
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card className="shadow-lg animate-fade-in">
        <CardHeader className="flex items-center space-x-3">
          <LucideCalendar className="text-blue-500" size={28} />
          <div>
            <h2 className="text-xl font-bold">Calendar</h2>
            <span className="text-gray-500 text-sm">
              View your upcoming jobs and events
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={today}
            onSelect={() => {}}
            className="border rounded-lg"
          />
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" disabled>
              Add Event (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
