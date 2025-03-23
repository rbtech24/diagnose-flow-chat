
import { TechnicianInvite } from "@/types/user";
import { InviteCard } from "./InviteCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InviteListProps {
  invites: TechnicianInvite[];
  onCancel: (inviteId: string) => void;
}

export function InviteList({ invites, onCancel }: InviteListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No pending invitations
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <InviteCard 
                key={invite.id}
                invite={invite}
                onCancel={onCancel}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
