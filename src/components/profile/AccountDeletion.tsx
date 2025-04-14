
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountDeletion() {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDeleteAccount = () => {
    setDeleting(true);
    
    // Simulate a deletion request to API
    setTimeout(() => {
      toast({
        title: "Account deleted",
        description: "Your account has been scheduled for deletion. You will be logged out shortly.",
        type: "success" // Added type property
      });
      
      // In a real app, you would redirect to logout
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      
      setDeleting(false);
    }, 1500);
  };
  
  const isConfirmValid = confirmText === "DELETE";
  
  return (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-destructive/10 rounded-md mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive mb-1">Warning: This action cannot be undone</h4>
              <p className="text-sm text-muted-foreground">
                When you delete your account, all of your data including service history, 
                performance records, and personal information will be permanently removed.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all of your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="confirm-delete" className="text-sm font-medium">
                Type DELETE to confirm
              </Label>
              <Input 
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-1"
                placeholder="DELETE"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={!isConfirmValid || deleting}
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
