
import { User } from "@/types/user";
import { Archive, X, UserIcon, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TechnicianCardProps {
  technician: User;
  onArchive: (techId: string) => void;
  onDelete: (techId: string) => void;
}

export function TechnicianCard({ technician, onArchive, onDelete }: TechnicianCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          {technician.avatarUrl ? (
            <img 
              src={technician.avatarUrl} 
              alt={technician.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{technician.name}</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" /> {technician.email}
            </span>
            {technician.phone && (
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" /> {technician.phone}
              </span>
            )}
          </div>
          {technician.status === "archived" && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
              Archived
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {!technician.status || technician.status !== "archived" ? (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onArchive(technician.id)}
            >
              <Archive className="h-4 w-4 text-amber-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(technician.id)}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(technician.id)}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
