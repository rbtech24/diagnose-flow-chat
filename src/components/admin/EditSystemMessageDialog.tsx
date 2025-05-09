
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SystemMessageData } from "@/context/SystemMessageContext";
import { BellRing, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface EditSystemMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: SystemMessageData;
  onSave: (message: Omit<SystemMessageData, "id">) => void;
}

export function EditSystemMessageDialog({
  isOpen,
  onClose,
  message,
  onSave,
}: EditSystemMessageDialogProps) {
  const [formData, setFormData] = useState<{
    title: string;
    message: string;
    type: "info" | "warning" | "maintenance";
    targetUsers: {
      company: boolean;
      tech: boolean;
      admin: boolean;
    };
  }>({
    title: "",
    message: "",
    type: "info",
    targetUsers: {
      company: true,
      tech: true,
      admin: false,
    },
  });

  useEffect(() => {
    if (message) {
      setFormData({
        title: message.title,
        message: message.message,
        type: message.type,
        targetUsers: {
          company: message.targetUsers.includes("company"),
          tech: message.targetUsers.includes("tech"),
          admin: message.targetUsers.includes("admin"),
        },
      });
    } else {
      // Reset form when opening for a new message
      setFormData({
        title: "",
        message: "",
        type: "info",
        targetUsers: {
          company: true,
          tech: true,
          admin: false,
        },
      });
    }
  }, [message, isOpen]);

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      toast.error("Please provide both title and message");
      return;
    }
    
    // Convert the targetUsers object to an array
    const targetUsers = Object.entries(formData.targetUsers)
      .filter(([_, value]) => value)
      .map(([key]) => key) as ("company" | "tech" | "admin")[];
    
    if (targetUsers.length === 0) {
      toast.error("Please select at least one user type");
      return;
    }
    
    onSave({
      title: formData.title,
      message: formData.message,
      type: formData.type,
      targetUsers,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{message ? "Edit System Message" : "Create System Message"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Message Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scheduled Maintenance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message Content</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Details about the announcement..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Message Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as "info" | "warning" | "maintenance",
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="info" id="info-edit" />
                <Label htmlFor="info-edit" className="flex items-center">
                  <Info className="h-4 w-4 text-blue-500 mr-1" /> Info
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="warning" id="warning-edit" />
                <Label htmlFor="warning-edit" className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> Warning
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance-edit" />
                <Label htmlFor="maintenance-edit" className="flex items-center">
                  <BellRing className="h-4 w-4 text-red-500 mr-1" /> Maintenance
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Show Message To</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="company-edit"
                  checked={formData.targetUsers.company}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      targetUsers: { ...formData.targetUsers, company: !!checked },
                    })
                  }
                />
                <label
                  htmlFor="company-edit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Company Users
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tech-edit"
                  checked={formData.targetUsers.tech}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      targetUsers: { ...formData.targetUsers, tech: !!checked },
                    })
                  }
                />
                <label
                  htmlFor="tech-edit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Technicians
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin-edit"
                  checked={formData.targetUsers.admin}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      targetUsers: { ...formData.targetUsers, admin: !!checked },
                    })
                  }
                />
                <label
                  htmlFor="admin-edit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Admin Users
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
