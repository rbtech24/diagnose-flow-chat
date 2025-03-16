
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, ThumbsUp, CheckCircle, FileText, Workflow, MessageSquare, ArrowLeft, PaperclipIcon, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CommunityPost, CommunityPostComment } from '@/types/community';

interface CommunityPostDetailProps {
  post: CommunityPost;
  onBack: () => void;
  onAddComment: (postId: string, content: string, attachments: File[]) => void;
  onMarkAsAnswer: (postId: string, commentId: string) => void;
  onUpvote: (postId: string, commentId?: string) => void;
}

export function CommunityPostDetail({
  post,
  onBack,
  onAddComment,
  onMarkAsAnswer,
  onUpvote
}: CommunityPostDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment, attachments);
      setNewComment('');
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const typeIcon = () => {
    switch (post.type) {
      case 'question':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'tech-sheet-request':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'wire-diagram-request':
        return <Workflow className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case 'question':
        return 'Question';
      case 'tech-sheet-request':
        return 'Tech Sheet Request';
      case 'wire-diagram-request':
        return 'Wire Diagram Request';
      default:
        return 'Discussion';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1">
              {typeIcon()}
              {getTypeLabel()}
            </span>
          </div>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          {post.attachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Attachments:</h4>
              <div className="space-y-2">
                {post.attachments.map((attachment) => (
                  <a 
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border rounded-md hover:bg-gray-50"
                  >
                    <PaperclipIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm text-blue-600">{attachment.filename}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {(attachment.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-muted-foreground"
              onClick={() => onUpvote(post.id)}
            >
              <ThumbsUp className="h-4 w-4" />
              {post.upvotes} upvotes
            </Button>
          </div>
          {post.isSolved && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Solved
            </span>
          )}
        </CardFooter>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-4">
        {post.comments.length === 0 ? "No responses yet" : `Responses (${post.comments.length})`}
      </h3>

      {post.comments.map((comment) => (
        <Card key={comment.id} className={comment.isAnswer ? "border-green-500" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(comment.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{comment.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                  {comment.isAnswer && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Answer
                    </Badge>
                  )}
                </div>
                <div className="mt-2 prose max-w-none">
                  <p className="whitespace-pre-line">{comment.content}</p>
                </div>
                
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {comment.attachments.map((attachment) => (
                        <a 
                          key={attachment.id}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 border rounded-md hover:bg-gray-50"
                        >
                          <PaperclipIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm text-blue-600">{attachment.fileName}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {(attachment.fileSize / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onUpvote(post.id, comment.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {comment.upvotes || 0}
                  </Button>
                  
                  {post.type === 'question' && !post.isSolved && !comment.isAnswer && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onMarkAsAnswer(post.id, comment.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Answer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Response</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your response..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[120px]"
          />
          
          <div className="mt-4 flex items-center gap-2">
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <PaperclipIcon className="h-4 w-4" />
              Attach Files
            </label>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-gray-500">Attachments:</p>
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                  <span className="truncate flex-grow">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Submit Response
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
