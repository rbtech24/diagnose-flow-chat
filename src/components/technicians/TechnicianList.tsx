
import { User } from "@/types/user";
import { TechnicianCard } from "./TechnicianCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TechnicianListProps {
  technicians: User[];
  onArchive: (techId: string) => void;
  onDelete: (techId: string) => void;
}

export function TechnicianList({ technicians, onArchive, onDelete }: TechnicianListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Technicians</CardTitle>
      </CardHeader>
      <CardContent>
        {technicians.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No active technicians found
          </div>
        ) : (
          <div className="space-y-4">
            {technicians.map((tech) => (
              <TechnicianCard 
                key={tech.id}
                technician={tech}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
