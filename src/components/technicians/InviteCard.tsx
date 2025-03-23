
import { TechnicianInvite } from "@/types/user";
import { X, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteCardProps {
  invite: TechnicianInvite;
  onCancel: (inviteId: string) => void;
}

export function InviteCard({ invite, onCancel }: InviteCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
          <Mail className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-medium">{invite.name}</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" /> {invite.email}
            </span>
            {invite.phone && (
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" /> {invite.phone}
              </span>
            )}
          </div>
          <div className="text-xs text-amber-600 mt-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Expires in {Math.ceil((invite.expiresAt.getTime() - Date.now()) / (1000 * 3600 * 24))} days
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onCancel(invite.id)}
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
