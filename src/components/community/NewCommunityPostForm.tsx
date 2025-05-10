
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CommunityPostType } from "@/types/community";

interface NewCommunityPostFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const NewCommunityPostForm: React.FC<NewCommunityPostFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<CommunityPostType>("question");
  const [tag, setTag] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      title,
      content,
      type,
      tag,
      attachments,
    };

    try {
      await onSubmit(formData);
      // Reset form on success
      setTitle("");
      setContent("");
      setType("question");
      setTag("");
      setAttachments([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments(fileArray);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="type">Post Type</Label>
        <Select 
          value={type} 
          onValueChange={(value: CommunityPostType) => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select post type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="tech-sheet-request">Tech Sheet Request</SelectItem>
            <SelectItem value="wire-diagram-request">Wire Diagram Request</SelectItem>
            <SelectItem value="discussion">Discussion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your post"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question or request in detail"
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag">Tag</Label>
        <Input
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Add a relevant tag"
        />
        <p className="text-sm text-gray-500">Add a single tag to help categorize your post</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <Input
          id="attachments"
          type="file"
          onChange={handleFileChange}
          multiple
          className="cursor-pointer"
        />
        <p className="text-sm text-gray-500">
          You can upload images, documents, or other relevant files
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Post..." : "Create Post"}
      </Button>
    </form>
  );
};
