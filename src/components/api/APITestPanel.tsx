
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateText } from "@/utils/api/openai";
import { sendEmail } from "@/utils/api/sendgrid";
import { sendSMS } from "@/utils/api/twilio";
import { AlertCircle } from "lucide-react";

export function APITestPanel() {
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  
  const [smsData, setSmsData] = useState({
    to: "",
    message: ""
  });
  
  const handleOpenAITest = async () => {
    if (!aiPrompt) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setLoading(true);
    try {
      const result = await generateText(aiPrompt);
      setAiResult(result.text || "No response received");
      toast.success("AI generation successful");
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate AI response. Check configuration and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast.error("Please fill all email fields");
      return;
    }
    
    setLoading(true);
    try {
      await sendEmail(emailData.to, emailData.subject, emailData.message);
      toast.success("Email sent successfully");
      setEmailData({ to: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send email. Check configuration and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendSMS = async () => {
    if (!smsData.to || !smsData.message) {
      toast.error("Please fill all SMS fields");
      return;
    }
    
    setLoading(true);
    try {
      await sendSMS(smsData.to, smsData.message);
      toast.success("SMS sent successfully");
      setSmsData({ to: "", message: "" });
    } catch (error) {
      console.error("SMS sending error:", error);
      toast.error("Failed to send SMS. Check configuration and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test OpenAI Integration</CardTitle>
          <CardDescription>Generate text using OpenAI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter a prompt for AI generation"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          {aiResult && (
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="font-medium mb-2">AI Response:</p>
              <p className="whitespace-pre-wrap">{aiResult}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleOpenAITest} disabled={loading}>
            {loading ? "Processing..." : "Generate with AI"}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test SendGrid Integration</CardTitle>
            <CardDescription>Send a test email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Recipient Email"
                value={emailData.to}
                onChange={(e) => setEmailData({...emailData, to: e.target.value})}
              />
            </div>
            <div>
              <Input
                placeholder="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              />
            </div>
            <div>
              <Textarea
                placeholder="Message Content"
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendEmail} disabled={loading}>
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Twilio Integration</CardTitle>
            <CardDescription>Send a test SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Recipient Phone Number"
                value={smsData.to}
                onChange={(e) => setSmsData({...smsData, to: e.target.value})}
              />
            </div>
            <div>
              <Textarea
                placeholder="Message Content"
                value={smsData.message}
                onChange={(e) => setSmsData({...smsData, message: e.target.value})}
              />
            </div>
            <div className="text-xs text-gray-500 flex items-start">
              <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
              <span>Enter phone number in E.164 format (e.g., +12065551234)</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendSMS} disabled={loading}>
              {loading ? "Sending..." : "Send Test SMS"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
