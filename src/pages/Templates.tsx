import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Library, Download, Copy, Eye, Search, FileSpreadsheet, Star,
  Sparkles, FileText, ShoppingCart, Microscope, Factory,
  HelpCircle, Beef, Lock, ChevronLeft, ChevronRight,
  Brain, Award, TrendingUp,
} from "lucide-react";
import {
  aiPromptTemplates,
  businessCommTemplates,
  reportTemplates,
  type AIPromptTemplate,
  type BusinessCommTemplate,
  type ReportTemplate,
  type TemplatePrice,
  type TemplateFormat,
} from "@/data/templateData";
import AIPromptModal from "@/components/templates/AIPromptModal";
import BusinessCommModal from "@/components/templates/BusinessCommModal";
import ReportModal from "@/components/templates/ReportModal";
import ReportPreviewModal from "@/components/templates/ReportPreviewModal";

const ITEMS_PER_PAGE = 8;

// Category accent colors
const categoryColors = {
  ai: { bg: "hsl(177, 55%, 39%)", bgLight: "hsl(177, 55%, 95%)", border: "hsl(177, 55%, 39%)", text: "hsl(177, 55%, 32%)" },
  comm: { bg: "hsl(45, 100%, 50%)", bgLight: "hsl(45, 100%, 95%)", border: "hsl(45, 100%, 50%)", text: "hsl(45, 100%, 35%)" },
  report: { bg: "hsl(232, 48%, 48%)", bgLight: "hsl(232, 48%, 95%)", border: "hsl(232, 48%, 48%)", text: "hsl(232, 48%, 40%)" },
};

const formatBadgeColors: Record<TemplateFormat, string> = {
  excel: "bg-emerald-100 text-emerald-700 border-emerald-200",
  doc: "bg-blue-100 text-blue-700 border-blue-200",
  pdf: "bg-red-100 text-red-700 border-red-200",
  text: "bg-gray-100 text-gray-700 border-gray-200",
};

const formatLabels: Record<TemplateFormat, string> = {
  excel: "Excel",
  doc: "Doc",
  pdf: "PDF",
  text: "Text",
};

// Section headers
const aiSections = [
  { key: "sourcing" as const, label: "Sourcing & Procurement", icon: ShoppingCart },
  { key: "quality" as const, label: "Quality", icon: Microscope },
  { key: "production" as const, label: "Production", icon: Factory },
];

const commSections = [
  { key: "vendor" as const, label: "Vendor Communication" },
  { key: "customer" as const, label: "Customer Communication" },
  { key: "internal" as const, label: "Internal Communication" },
];

const reportSections = [
  { key: "dynamic" as const, label: "Sourcing Reports", icon: "📊" },
  { key: "inputs" as const, label: "Sourcing Inputs & Calculators", icon: "📁" },
];

// ISTVON explanation
const istvonSteps = [
  { letter: "I", label: "Identify", desc: "Define the problem or objective" },
  { letter: "S", label: "Source", desc: "Gather relevant data and inputs" },
  { letter: "T", label: "Transform", desc: "Clean, normalize, and structure data" },
  { letter: "V", label: "Validate", desc: "Verify accuracy and completeness" },
  { letter: "O", label: "Optimize", desc: "Apply AI analysis for best outcomes" },
  { letter: "N", label: "Notify", desc: "Deliver insights and recommendations" },
];

// Compute summary stats
function getTemplateStats() {
  const allTemplates = [
    ...aiPromptTemplates,
    ...businessCommTemplates,
    ...reportTemplates,
  ];
  const totalTemplates = allTemplates.length;
  const totalDownloads = allTemplates.reduce((sum, t) => sum + t.downloads, 0);
  const mostPopular = [...allTemplates].sort((a, b) => b.downloads - a.downloads)[0];
  return { totalTemplates, totalDownloads, mostPopularName: mostPopular?.title || "N/A" };
}

// Get featured templates (top 3 by downloads)
function getFeaturedTemplates() {
  const all = [
    ...aiPromptTemplates.map(t => ({ ...t, _type: "ai" as const })),
    ...businessCommTemplates.map(t => ({ ...t, _type: "comm" as const })),
    ...reportTemplates.map(t => ({ ...t, _type: "report" as const })),
  ];
  return all.sort((a, b) => b.downloads - a.downloads).slice(0, 3);
}

export default function Templates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedAI, setSelectedAI] = useState<AIPromptTemplate | null>(null);
  const [selectedComm, setSelectedComm] = useState<BusinessCommTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [aiPage, setAiPage] = useState(1);
  const [commPage, setCommPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);

  const handleUseTemplate = (template: ReportTemplate) => {
    setSelectedReport(template);
  };

  const q = search.toLowerCase();

  const filteredAI = useMemo(
    () => aiPromptTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );
  const filteredComm = useMemo(
    () => businessCommTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );
  const filteredReports = useMemo(
    () => reportTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );

  const stats = getTemplateStats();
  const featured = getFeaturedTemplates();

  // Paginate helper
  const paginate = <T,>(items: T[], page: number) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paged = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    return { paged, totalPages };
  };

  const PaginationControls = ({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground font-semibold">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          Template Library
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">Browse and use pre-built report templates.</p>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          Total Templates: <span className="font-bold">{stats.totalTemplates}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          <Download className="h-3 w-3" /> Total Downloads: <span className="font-bold">{stats.totalDownloads}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          <Award className="h-3 w-3" /> Most Popular: <span className="font-bold">{stats.mostPopularName}</span>
        </Badge>
      </div>

      {/* Featured */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-primary" /> Featured Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featured.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-all shadow-sm border-primary/20">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{t.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">{t.downloads} downloads</Badge>
                  <Badge variant="outline" className={`text-[10px] ${formatBadgeColors[t.format]}`}>{formatLabels[t.format]}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates…"
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setAiPage(1);
            setCommPage(1);
            setReportPage(1);
          }}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-prompts" className="space-y-6">
        <TabsList className="h-11">
         <TabsTrigger value="ai-prompts" className="gap-1.5 text-sm">
            <Sparkles className="h-4 w-4" /> AI Prompts
          </TabsTrigger>
          <TabsTrigger value="business-comm" className="gap-1.5 text-sm">
            <FileText className="h-4 w-4" /> Business Communication
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5 text-sm">
            <FileSpreadsheet className="h-4 w-4" /> Report Templates
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: AI Prompts ── */}
        <TabsContent value="ai-prompts" className="space-y-8">
          <div className="flex items-center gap-2 text-base font-bold text-muted-foreground">
            <Sparkles className="h-5 w-5" style={{ color: categoryColors.ai.bg }} />
            AI Templates powered by DigiBull's ISTVON Framework
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex">
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <p className="font-bold text-sm mb-2">ISTVON Framework</p>
                  <div className="space-y-1">
                    {istvonSteps.map((step) => (
                      <div key={step.letter} className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-primary w-4">{step.letter}</span>
                        <span><strong>{step.label}</strong> — {step.desc}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {(() => {
            const { paged, totalPages } = paginate(filteredAI, aiPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paged.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      format={t.format}
                      department={t.department}
                      price={t.price}
                      actionLabel="Use This Template"
                      actionIcon={<Sparkles className="h-3 w-3" />}
                      onAction={() => setSelectedAI(t)}
                      onCopy={() => {
                        navigator.clipboard.writeText(t.prompt);
                        toast.success("Prompt copied to clipboard");
                      }}
                      onEye={() => setSelectedAI(t)}
                      accentColor={categoryColors.ai}
                      onOpenInAI={() => navigate("/ai-insights")}
                    />
                  ))}
                </div>
                <PaginationControls page={aiPage} totalPages={totalPages} setPage={setAiPage} />
              </>
            );
          })()}
          {filteredAI.length === 0 && <EmptyState />}
        </TabsContent>

        {/* ── TAB 2: Business Communication ── */}
        <TabsContent value="business-comm" className="space-y-8">
          {(() => {
            const { paged, totalPages } = paginate(filteredComm, commPage);
            return (
              <>
                {commSections.map((section) => {
                  const items = paged.filter((t) => t.section === section.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={section.key}>
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5" style={{ color: categoryColors.comm.bg }} />
                        {section.label}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items.map((t) => (
                          <TemplateCard
                            key={t.id}
                            title={t.title}
                            subtitle={t.subtitle}
                            downloads={t.downloads}
                            format={t.format}
                            department={t.department}
                            price={t.price}
                            actionLabel="Use This Template"
                            actionIcon={<FileText className="h-3 w-3" />}
                            onAction={t.price === "Premium" ? undefined : () => setSelectedComm(t)}
                            accentColor={categoryColors.comm}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                <PaginationControls page={commPage} totalPages={totalPages} setPage={setCommPage} />
              </>
            );
          })()}
          {filteredComm.length === 0 && <EmptyState />}
        </TabsContent>

        {/* ── TAB 3: Report Templates ── */}
        <TabsContent value="reports" className="space-y-8">
          {(() => {
            const { paged, totalPages } = paginate(filteredReports, reportPage);
            return (
              <>
                {reportSections.map((section) => {
                  const items = paged.filter((t) => t.section === section.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={section.key}>
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <span>{section.icon}</span>
                        {section.label}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items.map((t) => (
                          <TemplateCard
                            key={t.id}
                            title={t.title}
                            subtitle={t.subtitle}
                            downloads={t.downloads}
                            premium={t.premium}
                            isNew={t.isNew}
                            format={t.format}
                            department={t.department}
                            price={t.price}
                            actionLabel="Use This Template"
                            actionIcon={t.section === "dynamic" ? <Eye className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                            onAction={t.price === "Premium" ? undefined : () => t.section === "dynamic" ? setPreviewReport(t) : setSelectedReport(t)}
                            showPreview={t.section === "dynamic" && t.price !== "Premium"}
                            onPreview={t.price === "Premium" ? undefined : () => setPreviewReport(t)}
                            accentColor={categoryColors.report}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                <PaginationControls page={reportPage} totalPages={totalPages} setPage={setReportPage} />
              </>
            );
          })()}
          {filteredReports.length === 0 && <EmptyState />}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AIPromptModal template={selectedAI} open={!!selectedAI} onOpenChange={(o) => !o && setSelectedAI(null)} />
      <BusinessCommModal template={selectedComm} open={!!selectedComm} onOpenChange={(o) => !o && setSelectedComm(null)} />
      <ReportModal template={selectedReport} open={!!selectedReport} onOpenChange={(o) => !o && setSelectedReport(null)} />
      <ReportPreviewModal template={previewReport} open={!!previewReport} onOpenChange={(o) => !o && setPreviewReport(null)} onUseTemplate={handleUseTemplate} />
    </div>
  );
}

// ─── Shared Card Component ───
function TemplateCard({
  title,
  subtitle,
  downloads,
  premium,
  isNew,
  format,
  department,
  price,
  actionLabel,
  actionIcon,
  onAction,
  showPreview,
  onPreview,
  onCopy,
  onEye,
  accentColor,
  onOpenInAI,
}: {
  title: string;
  subtitle: string;
  downloads: number;
  premium?: boolean;
  isNew?: boolean;
  format?: TemplateFormat;
  department?: string;
  price?: TemplatePrice;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction?: () => void;
  showPreview?: boolean;
  onPreview?: () => void;
  onCopy?: () => void;
  onEye?: () => void;
  accentColor?: { bg: string; bgLight: string; border: string; text: string };
  onOpenInAI?: () => void;
}) {
  const accent = accentColor || { bg: "hsl(var(--primary))", bgLight: "hsl(var(--accent))", border: "hsl(var(--primary))", text: "hsl(var(--primary))" };
  const isPremium = price === "Premium";

  return (
    <Card
      className={`hover:shadow-md transition-all shadow-sm min-h-[220px] ${isPremium ? "border-amber-300/60 bg-amber-50/30 dark:bg-amber-950/10" : ""}`}
      style={{ borderColor: isPremium ? undefined : "transparent" }}
      onMouseEnter={(e) => !isPremium && (e.currentTarget.style.borderColor = accent.border + "66")}
      onMouseLeave={(e) => !isPremium && (e.currentTarget.style.borderColor = "transparent")}
    >
      <CardContent className="p-0">
        {/* Preview Thumbnail */}
        <div className="h-24 rounded-t-lg flex items-center justify-center relative" style={{ backgroundColor: isPremium ? "hsl(45, 100%, 96%)" : accent.bgLight }}>
          <FileSpreadsheet className="h-8 w-8" style={{ color: isPremium ? "hsl(45, 100%, 50%)" : accent.bg + "44" }} />
          {isPremium && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white gap-1 border-0">
              <Beef className="h-3 w-3" />Premium
            </Badge>
          )}
          {isNew && !isPremium && (
            <Badge className="absolute top-2 right-2 border-0" style={{ backgroundColor: accent.bg, color: "#fff" }}>New</Badge>
          )}
          {isPremium && (
            <div className="absolute inset-0 bg-amber-900/5 rounded-t-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-amber-500/40" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="font-semibold text-sm leading-tight">{title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{subtitle}</p>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-1.5">
            {format && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${formatBadgeColors[format]}`}>
                {formatLabels[format]}
              </Badge>
            )}
            {department && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {department}
              </Badge>
            )}
            {price && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
                  isPremium ? "border-amber-300 text-amber-600 bg-amber-50" : "border-teal-300 text-teal-600 bg-teal-50"
                }`}
              >
                {price}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{downloads} downloads</p>

          {/* Actions */}
          {isPremium ? (
            <div className="pt-1">
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <Beef className="h-3 w-3" />
                Contact your BuLLMind representative to access this template.
              </p>
            </div>
          ) : (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="text-xs gap-1 flex-1 text-white"
                style={{ backgroundColor: accent.bg }}
                onClick={onAction}
              >
                {actionIcon}
                {actionLabel}
              </Button>
              {onCopy && (
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onCopy}>
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {onOpenInAI && (
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onOpenInAI} title="Open in AI Insights">
                  <Brain className="h-3 w-3" />
                </Button>
              )}
              {showPreview && onPreview ? (
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onPreview}>
                  <Eye className="h-3 w-3" />
                </Button>
              ) : onEye ? (
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onEye}>
                  <Eye className="h-3 w-3" />
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">No templates match your search.</p>
    </div>
  );
}
