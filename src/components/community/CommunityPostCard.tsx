
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  CheckCircle, 
  FileText, 
  Workflow, 
  FileSpreadsheet, 
  File,
  ArrowUpToLine 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommunityPost } from '@/types/community';
import { Button } from '@/components/ui/button';

export interface CommunityPostCardProps {
  post: CommunityPost;
  basePath: string;
  onFulfillRequest?: (postId: string) => void;
}

export function CommunityPostCard({ post, basePath, onFulfillRequest }: CommunityPostCardProps) {
  const typeIcon = () => {
    switch (post.type) {
      case 'question':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'tech-sheet-request':
        return <FileSpreadsheet className="h-4 w-4 text-amber-500" />;
      case 'wire-diagram-request':
        return <Workflow className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
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

  const isDocumentRequest = post.type === 'tech-sheet-request' || post.type === 'wire-diagram-request';
  const canFulfill = isDocumentRequest && !post.isFulfilled && onFulfillRequest;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <Link to={`${basePath}/${post.id}`} className="hover:underline">
              <h3 className="text-lg font-medium line-clamp-2">{post.title}</h3>
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {typeIcon()}
                {getTypeLabel()}
              </span>
              <span>•</span>
              <span>{post.author.name}</span>
              <span>•</span>
              <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {post.comments.length}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {post.upvotes}
              </span>
              
              {isDocumentRequest && post.isFulfilled ? (
                <span className="flex items-center gap-1 text-emerald-600 ml-auto">
                  <CheckCircle className="h-4 w-4" />
                  Document Added to Knowledge Base
                </span>
              ) : post.isSolved ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Solved
                </span>
              ) : canFulfill ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto flex items-center gap-1 text-xs" 
                  onClick={() => onFulfillRequest?.(post.id)}
                >
                  <ArrowUpToLine className="h-3.5 w-3.5" />
                  Upload Document
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
