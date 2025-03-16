
export type KnowledgeArticleType = 'guide' | 'manual' | 'faq' | 'link' | 'troubleshooting';

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
