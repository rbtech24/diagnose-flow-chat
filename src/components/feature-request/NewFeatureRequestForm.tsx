import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useFeatureRequests } from "@/hooks/useFeatureRequests";
import { FeatureRequest } from "@/types/feature-request";

export interface NewFeatureRequestFormProps {
  onSubmit: () => Promise<void> | void;
  onCancel?: () => void;
  onCreateRequest?: (request: Omit<FeatureRequest, "id" | "created_at" | "updated_at" | "votes_count" | "user_has_voted" | "comments_count">) => void;
}

export function NewFeatureRequestForm({ onSubmit, onCancel, onCreateRequest }: NewFeatureRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onCreateRequest) {
        // If onCreateRequest is provided, use it
        onCreateRequest({
          title,
          description,
          priority: priority as "low" | "medium" | "high" | "critical",
          status: "pending",
          company_id: "current-company", // This would normally come from context or props
        });
      } else {
        // Otherwise just simulate submission for backward compatibility
        setTimeout(() => {
          toast.success("Feature request submitted successfully");
          setTitle("");
          setDescription("");
          setPriority("medium");
        }, 1000);
      }
      
      // Call onSubmit in any case
      if (onSubmit) await onSubmit();
    } catch (error) {
      toast.error("Failed to submit feature request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Brief title for the feature request"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the feature you'd like to see"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select a priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
