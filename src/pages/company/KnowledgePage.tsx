
import { CompanyKnowledgeBase } from "@/components/company/CompanyKnowledgeBase";
import { OfflineAwareKnowledgeBase } from "@/components/admin/knowledge/OfflineAwareKnowledgeBase";

export default function CompanyKnowledgePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Knowledge Base</h1>
      </div>
      
      <div className="h-[calc(100vh-220px)] min-h-[500px]">
        <OfflineAwareKnowledgeBase>
          <CompanyKnowledgeBase />
        </OfflineAwareKnowledgeBase>
      </div>
    </div>
  );
}
