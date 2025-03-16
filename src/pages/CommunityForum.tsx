
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, PlusCircle, MessageSquare, Eye, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CommunityForum() {
  const discussionTopics = [
    {
      id: 1,
      title: "Best practices for refrigerator compressor diagnostics",
      author: "Michael J.",
      authorRole: "Senior Technician",
      category: "Refrigerators",
      replies: 24,
      views: 156,
      likes: 12,
      isPopular: true,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Workflow for Samsung washer error code OE troubleshooting",
      author: "Sarah T.",
      authorRole: "Service Manager",
      category: "Washers",
      replies: 18,
      views: 124,
      likes: 9,
      isPopular: false,
      lastActivity: "5 hours ago"
    },
    {
      id: 3,
      title: "Tips for speeding up dryer diagnostics",
      author: "Robert C.",
      authorRole: "Technician",
      category: "Dryers",
      replies: 32,
      views: 210,
      likes: 15,
      isPopular: true,
      lastActivity: "1 day ago"
    },
    {
      id: 4,
      title: "Using Auto Pilot for commercial oven repairs",
      author: "Lisa M.",
      authorRole: "Company Owner",
      category: "Commercial",
      replies: 9,
      views: 87,
      likes: 5,
      isPopular: false,
      lastActivity: "2 days ago"
    },
    {
      id: 5,
      title: "Dishwasher drain pump diagnostics workflow",
      author: "David K.",
      authorRole: "Senior Technician",
      category: "Dishwashers",
      replies: 15,
      views: 132,
      likes: 8,
      isPopular: false,
      lastActivity: "3 days ago"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-16"
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community Forum</h1>
            <p className="text-gray-600">Connect with other repair professionals and share knowledge</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Discussion
          </Button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input className="pl-9" placeholder="Search discussions..." />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="refrigerators">Refrigerators</SelectItem>
                    <SelectItem value="washers">Washers</SelectItem>
                    <SelectItem value="dryers">Dryers</SelectItem>
                    <SelectItem value="dishwashers">Dishwashers</SelectItem>
                    <SelectItem value="ovens">Ovens</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="replies">Most Replies</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="discussions" className="mb-6">
              <TabsList>
                <TabsTrigger value="discussions">All Discussions</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="space-y-4 mt-4">
                {discussionTopics.map((topic) => (
                  <Card key={topic.id} className="hover:border-blue-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-blue-600 font-medium flex-shrink-0">
                          {topic.author.charAt(0)}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="font-semibold truncate hover:text-blue-600">
                              <Link to="#">{topic.title}</Link>
                              {topic.isPopular && (
                                <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">Popular</Badge>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500">{topic.lastActivity}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <span className="text-sm">
                              <span className="font-medium">{topic.author}</span>
                              <span className="text-gray-500"> • {topic.authorRole}</span>
                            </span>
                            <Badge variant="outline" className="w-fit">{topic.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{topic.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{topic.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{topic.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="questions">
                <div className="p-8 text-center">
                  <h3 className="font-semibold mb-2">Questions Tab Content</h3>
                  <p className="text-gray-600">This would display a filtered list of question posts.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="workflows">
                <div className="p-8 text-center">
                  <h3 className="font-semibold mb-2">Workflows Tab Content</h3>
                  <p className="text-gray-600">This would display a filtered list of workflow-related posts.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="tips">
                <div className="p-8 text-center">
                  <h3 className="font-semibold mb-2">Tips & Tricks Tab Content</h3>
                  <p className="text-gray-600">This would display a filtered list of tips and tricks posts.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Community Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li>Be respectful and constructive</li>
                  <li>Stay on topic in discussions</li>
                  <li>No promotional content</li>
                  <li>Do not share customer information</li>
                  <li>Cite sources when applicable</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">MJ</div>
                    <div>
                      <div className="font-medium text-sm">Michael J.</div>
                      <div className="text-xs text-gray-500">152 posts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center text-green-600 text-sm font-medium">ST</div>
                    <div>
                      <div className="font-medium text-sm">Sarah T.</div>
                      <div className="text-xs text-gray-500">118 posts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 h-8 w-8 rounded-full flex items-center justify-center text-amber-600 text-sm font-medium">RC</div>
                    <div>
                      <div className="font-medium text-sm">Robert C.</div>
                      <div className="text-xs text-gray-500">97 posts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">#refrigerator</Badge>
                  <Badge variant="secondary">#washer</Badge>
                  <Badge variant="secondary">#dryer</Badge>
                  <Badge variant="secondary">#dishwasher</Badge>
                  <Badge variant="secondary">#oven</Badge>
                  <Badge variant="secondary">#samsung</Badge>
                  <Badge variant="secondary">#whirlpool</Badge>
                  <Badge variant="secondary">#lg</Badge>
                  <Badge variant="secondary">#ge</Badge>
                  <Badge variant="secondary">#workflow</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
