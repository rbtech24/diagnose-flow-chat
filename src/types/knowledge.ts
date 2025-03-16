
export type KnowledgeArticleType = 'guide' | 'manual' | 'faq' | 'link' | 'troubleshooting' | 'tech-sheet' | 'service-manual' | 'wire-diagram';

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  type: KnowledgeArticleType;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  views: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  requestedBy?: string; // Track who requested the document
  fulfilledBy?: string; // Track who provided the document
  fromCommunityPost?: string; // ID of the community post if from a request
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  articleCount: number;
}
