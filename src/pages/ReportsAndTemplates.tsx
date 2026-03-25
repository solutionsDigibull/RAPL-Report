import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Library } from "lucide-react";
import Reports from "./Reports";
import Templates from "./Templates";

export default function ReportsAndTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo">Reports & Templates</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Access pre-engineered reports or browse the template library.
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="reports" className="flex-1 gap-2 font-semibold">
            <FileText className="h-4 w-4" /> Pre-Engineered Reports
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 gap-2 font-semibold">
            <Library className="h-4 w-4" /> Template Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Reports />
        </TabsContent>

        <TabsContent value="templates">
          <Templates />
        </TabsContent>
      </Tabs>
    </div>
  );
}
