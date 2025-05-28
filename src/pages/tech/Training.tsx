
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock,
  Download,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'interactive';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  rating: number;
  thumbnail?: string;
}

interface Certification {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  expiryDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'expired';
}

const mockTrainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Washing Machine Diagnostics',
    description: 'Learn to diagnose common washing machine problems',
    type: 'video',
    duration: '45 min',
    difficulty: 'beginner',
    category: 'Appliance Repair',
    completed: true,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Refrigerator Compressor Repair',
    description: 'Advanced techniques for compressor troubleshooting',
    type: 'interactive',
    duration: '2 hours',
    difficulty: 'advanced',
    category: 'Appliance Repair',
    completed: false,
    rating: 4.9
  },
  {
    id: '3',
    title: 'Safety Protocols Manual',
    description: 'Essential safety guidelines for appliance repair',
    type: 'document',
    duration: '30 min',
    difficulty: 'beginner',
    category: 'Safety',
    completed: true,
    rating: 4.6
  }
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'Appliance Repair Fundamentals',
    description: 'Basic certification for appliance repair technicians',
    progress: 75,
    totalModules: 8,
    completedModules: 6,
    status: 'in-progress'
  },
  {
    id: '2',
    name: 'Advanced Diagnostics',
    description: 'Advanced troubleshooting and diagnostic techniques',
    progress: 100,
    totalModules: 12,
    completedModules: 12,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'completed'
  }
];

export default function TechTraining() {
  const [modules] = useState<TrainingModule[]>(mockTrainingModules);
  const [certifications] = useState<Certification[]>(mockCertifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'document': return <BookOpen className="h-4 w-4" />;
      case 'interactive': return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training & Certification</h1>
          <p className="text-gray-600 mt-1">Enhance your skills and earn certifications</p>
        </div>
        <Button>
          <Award className="h-4 w-4 mr-2" />
          View All Certifications
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search training modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Modules */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                      {module.completed && (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(module.type)}
                        {module.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </span>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{module.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{module.category}</span>
                      <div className="flex gap-2">
                        {module.type === 'document' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button size="sm">
                          {module.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{cert.name}</h3>
                      <Badge className={getStatusColor(cert.status)}>
                        {cert.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{cert.completedModules}/{cert.totalModules} modules</span>
                      </div>
                      <Progress value={cert.progress} className="h-2" />
                    </div>
                    
                    {cert.expiryDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Expires: {cert.expiryDate.toLocaleDateString()}
                      </p>
                    )}
                    
                    <Button className="w-full mt-3" size="sm">
                      {cert.status === 'completed' ? 'View Certificate' : 'Continue'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-gray-600">Modules Completed</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <p className="text-sm text-gray-600">Certifications Earned</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24h</div>
                  <p className="text-sm text-gray-600">Total Learning Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
