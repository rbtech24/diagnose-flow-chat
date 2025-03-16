
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemePreferences() {
  const [theme, setTheme] = useState("system");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSaveThemePreference = () => {
    setIsSaving(true);
    
    // In a real app, we would save this to the user's profile in the database
    // and apply the theme immediately
    
    // For now, let's just simulate an API call
    setTimeout(() => {
      localStorage.setItem("user-theme-preference", theme);
      
      toast({
        title: "Theme preferences saved",
        description: "Your theme preferences have been updated successfully.",
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-blue-500" />
          Theme Preferences
        </CardTitle>
        <CardDescription>
          Customize your application theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          defaultValue={theme} 
          onValueChange={setTheme}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 bg-background/40 p-4 rounded-md">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              <div>
                <span className="font-medium">Light Theme</span>
                <p className="text-sm text-muted-foreground">
                  Use light mode for better visibility in bright environments
                </p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-background/40 p-4 rounded-md">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
              <Moon className="h-5 w-5 mr-2 text-indigo-400" />
              <div>
                <span className="font-medium">Dark Theme</span>
                <p className="text-sm text-muted-foreground">
                  Use dark mode for reduced eye strain in low-light environments
                </p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 bg-background/40 p-4 rounded-md">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
              <Monitor className="h-5 w-5 mr-2 text-slate-500" />
              <div>
                <span className="font-medium">System Preference</span>
                <p className="text-sm text-muted-foreground">
                  Automatically match your system's theme preference
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        <Button 
          onClick={handleSaveThemePreference} 
          className="mt-6 w-full"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Theme Preference"}
        </Button>
      </CardContent>
    </Card>
  );
}
