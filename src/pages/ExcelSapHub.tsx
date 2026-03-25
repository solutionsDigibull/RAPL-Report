import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Plug } from "lucide-react";
import ExcelDashboard from "./ExcelDashboard";
import SapBridge from "./SapBridge";

export default function ExcelSapHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo">Excel & SAP Hub</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Upload spreadsheets for AI-powered analysis or connect to SAP systems.
        </p>
      </div>

      <Tabs defaultValue="excel" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="excel" className="flex-1 gap-2 font-semibold">
            <BarChart3 className="h-4 w-4" /> Excel Dashboard
          </TabsTrigger>
          <TabsTrigger value="sap" className="flex-1 gap-2 font-semibold">
            <Plug className="h-4 w-4" /> SAP Bridge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="excel">
          <ExcelDashboard />
        </TabsContent>

        <TabsContent value="sap">
          <SapBridge />
        </TabsContent>
      </Tabs>
    </div>
  );
}
