
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeArticle, KnowledgeArticleType, KnowledgeCategory } from "@/types/knowledge";
import { FileText, FileUp, PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentManagementProps {
  articles: KnowledgeArticle[];
  categories: KnowledgeCategory[];
  onAddArticle: (article: Omit<KnowledgeArticle, "id" | "createdAt" | "updatedAt" | "views" | "helpfulVotes" | "notHelpfulVotes">) => void;
  onEditArticle: (article: KnowledgeArticle) => void;
  onDeleteArticle: (articleId: string) => void;
}

export function DocumentManagement({
  articles,
  categories,
  onAddArticle,
  onEditArticle,
  onDeleteArticle
}: DocumentManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  
  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formType, setFormType] = useState<KnowledgeArticleType>("guide");
  const [formTags, setFormTags] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formAttachments, setFormAttachments] = useState<File[]>([]);
  
  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormExcerpt("");
    setFormCategory("");
    setFormType("guide");
    setFormTags("");
    setFormPublished(true);
    setFormAttachments([]);
  };
  
  // Handle add document submit
  const handleAddDocument = () => {
    const tagsArray = formTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    
    const newArticle = {
      title: formTitle,
      content: formContent,
      excerpt: formExcerpt,
      category: formCategory,
      type: formType,
      tags: tagsArray,
      published: formPublished,
      author: "Admin" // This would come from auth context in a real app
    };
    
    onAddArticle(newArticle);
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Handle edit document submit
  const handleEditDocument = () => {
    if (!selectedArticle) return;
    
    const tagsArray = formTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    
    const updatedArticle: KnowledgeArticle = {
      ...selectedArticle,
      title: formTitle,
      content: formContent,
      excerpt: formExcerpt,
      category: formCategory,
      type: formType,
      tags: tagsArray,
      published: formPublished,
      updatedAt: new Date().toISOString()
    };
    
    onEditArticle(updatedArticle);
    resetForm();
    setSelectedArticle(null);
    setIsEditDialogOpen(false);
  };
  
  // Set up edit form
  const setupEditForm = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setFormTitle(article.title);
    setFormContent(article.content);
    setFormExcerpt(article.excerpt);
    setFormCategory(article.category);
    setFormType(article.type);
    setFormTags(article.tags.join(", "));
    setFormPublished(article.published);
    setIsEditDialogOpen(true);
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormAttachments(filesArray);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Document</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Add a new document to the knowledge base. All fields with * are required.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter document title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt/Summary *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of the document"
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formCategory} onValueChange={setFormCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Document Type *</Label>
                  <Select 
                    value={formType} 
                    onValueChange={(value) => setFormType(value as KnowledgeArticleType)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                        <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                        <SelectItem value="tech-sheet">Tech Sheet</SelectItem>
                        <SelectItem value="service-manual">Service Manual</SelectItem>
                        <SelectItem value="wire-diagram">Wire Diagram</SelectItem>
                        <SelectItem value="technical-alert">Technical Alert</SelectItem>
                        <SelectItem value="misc-document">Misc Document</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="refrigerator, compressor, maintenance, etc."
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Document content..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={8}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="file">Attachments</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                />
                {formAttachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Files to upload:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      {formAttachments.map((file, index) => (
                        <li key={index} className="text-muted-foreground">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formPublished}
                  onCheckedChange={(checked) => setFormPublished(checked === true)}
                />
                <Label htmlFor="published">Publish document immediately</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="tech-sheet">Tech Sheets</TabsTrigger>
          <TabsTrigger value="service-manual">Service Manuals</TabsTrigger>
          <TabsTrigger value="wire-diagram">Wire Diagrams</TabsTrigger>
          <TabsTrigger value="technical-alert">Technical Alerts</TabsTrigger>
          <TabsTrigger value="misc-document">Misc Documents</TabsTrigger>
        </TabsList>
        
        {["all", "tech-sheet", "service-manual", "wire-diagram", "technical-alert", "misc-document"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {articles
                  .filter(article => tabValue === "all" || article.type === tabValue)
                  .map((article) => (
                    <Card key={article.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{article.title}</CardTitle>
                          <Badge variant={article.published ? "default" : "outline"}>
                            {article.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <CardDescription>{article.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {article.type}</p>
                          <p>Category: {article.category}</p>
                          <p>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                          <p>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex gap-2 ml-auto">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => setupEditForm(article)}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 text-destructive hover:text-destructive"
                            onClick={() => onDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                
                {articles.filter(article => tabValue === "all" || article.type === tabValue).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents found in this category
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document details. All fields with * are required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter document title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-excerpt">Excerpt/Summary *</Label>
              <Textarea
                id="edit-excerpt"
                placeholder="Brief summary of the document"
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                rows={2}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formCategory} onValueChange={setFormCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Document Type *</Label>
                <Select 
                  value={formType} 
                  onValueChange={(value) => setFormType(value as KnowledgeArticleType)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                      <SelectItem value="tech-sheet">Tech Sheet</SelectItem>
                      <SelectItem value="service-manual">Service Manual</SelectItem>
                      <SelectItem value="wire-diagram">Wire Diagram</SelectItem>
                      <SelectItem value="technical-alert">Technical Alert</SelectItem>
                      <SelectItem value="misc-document">Misc Document</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                placeholder="refrigerator, compressor, maintenance, etc."
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                placeholder="Document content..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={8}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-file">Add Attachments</Label>
              <Input
                id="edit-file"
                type="file"
                onChange={handleFileChange}
                multiple
              />
              
              {selectedArticle?.attachments && selectedArticle.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Current attachments:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {selectedArticle.attachments.map((attachment) => (
                      <li key={attachment.id} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {formAttachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">New files to upload:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {formAttachments.map((file, index) => (
                      <li key={index} className="text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-published"
                checked={formPublished}
                onCheckedChange={(checked) => setFormPublished(checked === true)}
              />
              <Label htmlFor="edit-published">Published</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setSelectedArticle(null);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditDocument}>Update Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
