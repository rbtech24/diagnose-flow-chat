
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Please select a priority level",
  }),
});

type TicketValues = z.infer<typeof ticketSchema>;

interface NewTicketFormProps {
  onSubmit: (title: string, description: string, priority: string) => void;
  isSubmitting: boolean;
}

export function NewTicketForm({ onSubmit, isSubmitting }: NewTicketFormProps) {
  const form = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const handleSubmit = async (values: TicketValues) => {
    onSubmit(values.title, values.description, values.priority);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogDescription>
          Fill out the form below to create a new support ticket. Our team will respond as soon as possible.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brief summary of your issue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please provide a detailed description of the issue you're experiencing..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
