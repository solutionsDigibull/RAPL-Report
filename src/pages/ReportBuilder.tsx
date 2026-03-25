import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Upload, FileSpreadsheet, BarChart3, Brain, LayoutGrid, Download,
  Plug, Database, Globe, Link2, Clock, CheckCircle2,
  ArrowRight, ExternalLink, FileText, Layers
} from "lucide-react";
import { useUploadLimit } from "@/hooks/useUploadLimit";
import { toast } from "sonner";

// ── Mock uploaded files ──
const recentUploads = [
  { name: "BOM_Q1_2026.xlsx", size: "2.4 MB", date: "Mar 24, 2026", rows: 1247, status: "processed" },
  { name: "Spend_Analysis_Feb.csv", size: "890 KB", date: "Mar 22, 2026", rows: 3421, status: "processed" },
  { name: "Supplier_Scorecard.xlsx", size: "1.1 MB", date: "Mar 20, 2026", rows: 856, status: "processed" },
  { name: "Inventory_Snapshot.csv", size: "4.7 MB", date: "Mar 18, 2026", rows: 8932, status: "processed" },
];

// ── Mock BOM review data ──
const mockBOMReview = [
  { mpn: "STM32F407VGT6", description: "MCU ARM Cortex-M4 1MB Flash", qty: 1, unitCost: 8.45, supplier: "Arrow Electronics", commodity: "ICs", leadTime: 56 },
  { mpn: "RC0402FR-0710KL", description: "Resistor 10K 1% 0402", qty: 24, unitCost: 0.012, supplier: "Yageo Corporation", commodity: "Passives", leadTime: 14 },
  { mpn: "GRM155R71C104KA88D", description: "Cap 100nF 16V 0402", qty: 18, unitCost: 0.008, supplier: "Murata Manufacturing", commodity: "Passives", leadTime: 21 },
  { mpn: "TPS54302DDCR", description: "Buck Converter 3A SOT-23", qty: 2, unitCost: 2.10, supplier: "Digi-Key", commodity: "Power", leadTime: 7 },
  { mpn: "744771133", description: "Inductor 33uH 1.4A SMD", qty: 2, unitCost: 0.85, supplier: "Würth Elektronik", commodity: "Passives", leadTime: 35 },
  { mpn: "TUSB320IRWBR", description: "USB Type-C Controller", qty: 1, unitCost: 1.85, supplier: "Arrow Electronics", commodity: "ICs", leadTime: 130 },
  { mpn: "ESP32-WROOM-32D", description: "Wi-Fi + BT Module", qty: 3, unitCost: 3.20, supplier: "Mouser Electronics", commodity: "ICs", leadTime: 21 },
  { mpn: "BAT54S", description: "Schottky Diode Dual SOT-23", qty: 6, unitCost: 0.019, supplier: "Digi-Key", commodity: "Discretes", leadTime: 10 },
];

// ── Data source options ──
const dataSources = [
  { id: "file", label: "File Upload", description: "Excel, CSV, or JSON files", icon: Upload, active: true },
  { id: "spreadsheet", label: "Spreadsheet Link", description: "Google Sheets or OneDrive", icon: Link2, active: false },
  { id: "scraping", label: "Web Scraping", description: "Extract data from websites", icon: Globe, active: false },
  { id: "api", label: "API Call", description: "REST or GraphQL endpoints", icon: Database, active: false },
];

// ── 4 Flow cards ──
const flowCards = [
  { id: "drag-drop", label: "Drag & Drop Builder", description: "Build custom reports with a visual drag-and-drop widget canvas", icon: LayoutGrid, gradient: "gradient-card-indigo", route: "/drag-drop" },
  { id: "visualize", label: "Visualize", description: "Auto-generate executive dashboards with charts, KPIs, and trends", icon: BarChart3, gradient: "gradient-card-teal", route: "/excel-sap?tab=excel" },
  { id: "ai-insights", label: "AI Insights", description: "Run LLM-powered analysis for anomalies, optimization, and forecasting", icon: Brain, gradient: "gradient-card-warm", route: "/ai-insights" },
  { id: "export", label: "Export", description: "Download processed data as Excel, CSV, PDF, or share via API", icon: Download, gradient: "gradient-card-amber", route: null },
];

// ── SAP connectors ──
const sapConnectors = [
  { id: "s4hana-report", label: "SAP S/4HANA Report Import", description: "ME2M, MB52, VA05 and 20+ standard reports", icon: FileText, count: "23 reports" },
  { id: "s4hana-table", label: "SAP Direct Table Import", description: "MARA, EKPO, STPO, VBAP raw table access", icon: Database, count: "6 tables synced" },
];

export default function ReportBuilder() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeDataSource, setActiveDataSource] = useState("file");
  const [showBOMReview, setShowBOMReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { remaining, canUpload, recordUpload } = useUploadLimit();
  const navigate = useNavigate();

  const handleFileUpload = (file: File) => {
    if (!canUpload) {
      toast.error("Daily upload limit reached. Try again tomorrow.");
      return;
    }
    recordUpload();
    setUploadedFile(file.name);
    setShowBOMReview(true);
    toast.success(`File "${file.name}" uploaded successfully.`);
  };

  const handleFlowClick = (flow: typeof flowCards[0]) => {
    if (flow.id === "export") {
      toast.success("Export initiated — preparing your data for download.");
      return;
    }
    if (flow.route) {
      navigate(flow.route);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-indigo">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          Report Builder
        </h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1 ml-12">
          Upload data, connect sources, and build reports using AI-powered workflows.
        </p>
      </div>

      <div className="flex gap-6">
        {/* ── Left Sidebar: Data Sources ── */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Source selector */}
          <div>
            <h3 className="text-xs font-bold text-indigo uppercase tracking-widest mb-3">Data Sources</h3>
            <div className="space-y-2">
              {dataSources.map((src) => {
                const Icon = src.icon;
                const isActive = activeDataSource === src.id;
                return (
                  <button
                    key={src.id}
                    onClick={() => setActiveDataSource(src.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : src.active
                        ? "border-border hover:border-primary/20 hover:bg-muted/50"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!src.active}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isActive ? "bg-primary/15" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{src.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{src.description}</p>
                    </div>
                    {!src.active && (
                      <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 shrink-0">Soon</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent uploads */}
          <div>
            <h3 className="text-xs font-bold text-indigo uppercase tracking-widest mb-3">Recent Uploads</h3>
            <div className="space-y-2">
              {recentUploads.map((file, i) => (
                <button
                  key={i}
                  onClick={() => { setUploadedFile(file.name); setShowBOMReview(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors text-left group"
                >
                  <FileSpreadsheet className="h-4 w-4 text-primary/70 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{file.size} · {file.rows.toLocaleString()} rows</p>
                  </div>
                  <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Enterprise ERP */}
          <div>
            <h3 className="text-xs font-bold text-indigo uppercase tracking-widest mb-3">Enterprise ERP Connect</h3>
            <div className="space-y-2">
              {sapConnectors.map((conn) => {
                const Icon = conn.icon;
                return (
                  <button
                    key={conn.id}
                    onClick={() => navigate("/excel-sap?tab=sap")}
                    className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/50 transition-all text-left group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-indigo/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-indigo" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{conn.label}</p>
                      <p className="text-[10px] text-muted-foreground">{conn.count}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main Area ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Upload Zone */}
          {!uploadedFile && (
            <Card
              className={`border-dashed border-2 card-premium ${canUpload ? "border-primary/30 gradient-card-warm" : "border-muted opacity-60"}`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
            >
              <CardContent className="py-16 flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">Drop your file here to get started</p>
                  <p className="text-sm font-semibold text-muted-foreground mt-1">Supports .xlsx, .xls, .csv up to 50MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canUpload}
                  className="gap-2 btn-glow px-6 h-11 text-sm font-bold"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Upload File
                </Button>
                <p className={`text-xs font-semibold ${remaining <= 3 ? "text-destructive" : "text-muted-foreground"}`}>
                  {canUpload
                    ? `${remaining} upload${remaining !== 1 ? "s" : ""} remaining today`
                    : "Daily upload limit reached. Try again tomorrow."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* File loaded indicator */}
          {uploadedFile && (
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <FileSpreadsheet className="h-3.5 w-3.5" /> {uploadedFile}
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Parsed
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setUploadedFile(null); setShowBOMReview(false); }}
                className="font-semibold text-xs"
              >
                Clear
              </Button>
            </div>
          )}

          {/* ── 4 Flow Cards ── */}
          <div>
            <h3 className="text-xs font-bold text-indigo uppercase tracking-widest mb-3">Choose Your Workflow</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {flowCards.map((flow) => {
                const Icon = flow.icon;
                return (
                  <button
                    key={flow.id}
                    onClick={() => handleFlowClick(flow)}
                    className={`text-left p-5 rounded-xl border border-border/60 ${flow.gradient} hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 group`}
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{flow.label}</p>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1 leading-relaxed">{flow.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── BOM Review Table ── */}
          {showBOMReview && (
            <Card className="card-premium border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" /> BOM Data Review
                </CardTitle>
                <CardDescription className="font-semibold">
                  {mockBOMReview.length} components parsed · Total cost: ${mockBOMReview.reduce((a, r) => a + r.unitCost * r.qty, 0).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border max-h-80 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-indigo/5 hover:bg-indigo/5">
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">MPN</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Description</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Qty</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Unit Cost</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Extended</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Supplier</TableHead>
                        <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Lead Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBOMReview.map((row) => (
                        <TableRow key={row.mpn} className="hover:bg-primary/5">
                          <TableCell className="font-mono text-xs font-semibold">{row.mpn}</TableCell>
                          <TableCell className="text-xs">{row.description}</TableCell>
                          <TableCell className="font-bold tabular-nums">{row.qty}</TableCell>
                          <TableCell className="tabular-nums">${row.unitCost.toFixed(3)}</TableCell>
                          <TableCell className="font-bold tabular-nums">${(row.unitCost * row.qty).toFixed(2)}</TableCell>
                          <TableCell className="text-xs">{row.supplier}</TableCell>
                          <TableCell>
                            <Badge variant={row.leadTime > 100 ? "destructive" : "outline"} className="text-xs font-bold">
                              {row.leadTime}d
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
