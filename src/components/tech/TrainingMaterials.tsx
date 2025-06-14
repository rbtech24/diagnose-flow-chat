
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const trainingItems = [
  {
    title: 'Training Guides',
    description: 'Access detailed product manuals and guides.',
    icon: BookOpen,
    link: '/tech/training',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step video tutorials.',
    icon: Video,
    link: '/tech/training',
  },
  {
    title: 'Certifications',
    description: 'Get certified on new products and technologies.',
    icon: Award,
    link: '/tech/training',
  },
];

export function TrainingMaterials() {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Training & Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainingItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <item.icon className="w-8 h-8 text-blue-500" />
                <CardTitle>{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <Button variant="outline" onClick={() => navigate(item.link)}>
                View
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
