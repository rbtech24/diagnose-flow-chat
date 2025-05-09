
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSystemMessages } from "@/context/SystemMessageContext";
import { BellRing, Info, AlertTriangle, Trash, Edit, Plus, Trash2 } from "lucide-react";
import { SystemMessage } from "@/components/system/SystemMessage";
import { toast } from "sonner";
import { EditSystemMessageDialog } from "@/components/admin/EditSystemMessageDialog";
import { SystemMessageData } from "@/context/SystemMessageContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SystemMessagesPage() {
  const { messages, addMessage, removeMessage } = useSystemMessages();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<SystemMessageData | undefined>(undefined);

  const handleAddMessage = () => {
    setCurrentMessage(undefined);
    setEditDialogOpen(true);
  };

  const handleEditMessage = (message: SystemMessageData) => {
    setCurrentMessage(message);
    setEditDialogOpen(true);
  };

  const handleSaveMessage = (messageData: Omit<SystemMessageData, "id">) => {
    addMessage(messageData);
    toast.success(currentMessage ? "Message updated successfully" : "Message added successfully");
  };

  const handleDeletePrompt = (message: SystemMessageData) => {
    setCurrentMessage(message);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentMessage) {
      removeMessage(currentMessage.id);
      toast.success("Message deleted successfully");
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Messages</h1>
        <Button onClick={handleAddMessage} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Messages</CardTitle>
            <CardDescription>Messages displayed to users across the system</CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No active system messages. Click "Add New Message" to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="relative border rounded-lg p-4">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditMessage(msg)}
                        aria-label="Edit message"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeletePrompt(msg)}
                        aria-label="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <SystemMessage
                      type={msg.type}
                      title={msg.title}
                      message={msg.message}
                    />
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <p className="text-xs text-gray-500">Visible to:</p>
                      {msg.targetUsers.map(user => (
                        <span key={user} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {user}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit/Create Dialog */}
      <EditSystemMessageDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        message={currentMessage}
        onSave={handleSaveMessage}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete System Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this system message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
