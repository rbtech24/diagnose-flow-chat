
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Check, ArrowRight, Building, Wrench, AlertCircle } from "lucide-react";
import { showToast } from "@/utils/toast-helpers";

// Types for onboarding steps
type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

// Technician onboarding steps
const TechnicianOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Repair Auto Pilot",
    description: "We'll help you get set up to start diagnosing appliance issues efficiently.",
    component: (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <span className="flex h-6 w-6 rounded-full bg-blue-100 text-blue-600 items-center justify-center mr-2">
              <Check className="h-4 w-4" />
            </span>
            Your account has been created
          </h3>
          <p className="text-gray-600 mb-4">
            You now have access to powerful diagnostic tools designed specifically for appliance repair professionals.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Step-by-step diagnostic workflows</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Technical documentation and repair guides</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Community support from other technicians</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Tell us about your skills and experience.",
    component: (
      <div className="space-y-6">
        <div className="flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
          <p className="text-sm text-gray-600">
            Adding your skills and certifications will help us personalize your experience
            and provide more relevant diagnostic workflows.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium mb-4">Your technician profile should include:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Specialties (HVAC, refrigeration, laundry, etc.)</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Years of experience</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Certifications and training</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Service area information</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "tools",
    title: "Explore Your Technician Tools",
    description: "Learn about the features available to you.",
    component: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Wrench className="h-4 w-4 mr-2 text-blue-600" />
              Diagnostics
            </h3>
            <p className="text-sm text-gray-600">
              Access guided step-by-step workflows for diagnosing appliance issues accurately.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Knowledge Base
            </h3>
            <p className="text-sm text-gray-600">
              Technical documents, repair guides, and best practices for various appliances.
            </p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
          <p className="text-sm text-gray-600">
            We recommend starting with the diagnostic tool to understand how the workflows can
            help you troubleshoot issues efficiently.
          </p>
        </div>
      </div>
    ),
  },
];

// Company onboarding steps
const CompanyOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Repair Auto Pilot",
    description: "We'll help you set up your company account.",
    component: (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <span className="flex h-6 w-6 rounded-full bg-blue-100 text-blue-600 items-center justify-center mr-2">
              <Check className="h-4 w-4" />
            </span>
            Your company account has been created
          </h3>
          <p className="text-gray-600 mb-4">
            You now have access to powerful tools to manage your technician team and streamline appliance repair operations.
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Manage technician accounts and access</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Monitor diagnostic usage and results</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Access company-wide analytics and insights</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "team",
    title: "Add Your Technician Team",
    description: "Invite technicians to join your company account.",
    component: (
      <div className="space-y-6">
        <div className="flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
          <p className="text-sm text-gray-600">
            Adding technicians to your account will allow them to use diagnostic workflows
            under your company subscription.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium mb-4">Team management features:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Send email invitations to technicians</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Manage access levels and permissions</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Monitor technician activity and productivity</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "workflows",
    title: "Explore Diagnostic Workflows",
    description: "Learn about the diagnostic tools available to your team.",
    component: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Building className="h-4 w-4 mr-2 text-blue-600" />
              Company Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              Monitor technician activity, diagnostic usage, and company-wide metrics.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Workflow Management
            </h3>
            <p className="text-sm text-gray-600">
              Access and customize diagnostic workflows for your specific business needs.
            </p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
          <p className="text-sm text-gray-600">
            We recommend starting with the technician management section to set up your team
            and provide them with access to diagnostic tools.
          </p>
        </div>
      </div>
    ),
  },
];

export function OnboardingFlow() {
  const { user, userRole, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Select steps based on user role
  const steps = userRole === "company" ? CompanyOnboardingSteps : TechnicianOnboardingSteps;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      // Mark onboarding as complete in user profile
      await updateUser({ onboardingCompleted: true });
      
      // Navigate based on user role
      if (userRole === "company") {
        showToast.success("Onboarding complete! Redirecting to company dashboard");
        navigate("/company");
      } else {
        showToast.success("Onboarding complete! Redirecting to technician dashboard");
        navigate("/tech");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      showToast.error("There was a problem completing onboarding");
    } finally {
      setIsCompleting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-blue-50 p-4 md:py-8">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8 space-y-6">
            {/* Step content */}
            {steps[currentStep].component}
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`h-2 rounded-full ${
                    index === currentStep 
                      ? "bg-blue-600 w-8" 
                      : index < currentStep 
                        ? "bg-blue-300 w-8"
                        : "bg-gray-200 w-4"
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isCompleting}
              >
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isCompleting}
                className="gap-2"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
