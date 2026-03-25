import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingUp, Search, BarChart3, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { reportTypes } from "@/data/mockData";
import { getReportPreview } from "@/components/reports/ReportPreviews";

const REPORTS_PER_PAGE = 8;

export default function Reports() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const departments = ["all", ...new Set(reportTypes.map((r) => r.department))];
  const filtered = reportTypes.filter((r) => (filter === "all" || r.department === filter) && r.name.toLowerCase().includes(search.toLowerCase()));
  const trending = reportTypes.filter((r) => r.trending);

  const totalPages = Math.ceil(filtered.length / REPORTS_PER_PAGE);
  const paginatedReports = filtered.slice((page - 1) * REPORTS_PER_PAGE, page * REPORTS_PER_PAGE);

  // Reset page when filters change
  const handleFilterChange = (val: string) => { setFilter(val); setPage(1); };
  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><FileText className="h-6 w-6 text-primary" />Pre-Engineered Reports</h1>
        <p className="text-sm font-semibold text-muted-foreground">One-click access to 20+ standard manufacturing reports.</p>
      </div>

      {/* Trending */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary" />Trending Reports</h2>
        <div className="flex gap-2 flex-wrap">
          {trending.map((r) => (
            <Button key={r.id} variant="outline" size="sm" className="gap-1 text-xs hover:border-primary/40" onClick={() => setSelectedReport(r.id)}>
              <BarChart3 className="h-3 w-3 text-primary" />{r.name}
              <Badge variant="secondary" className="ml-1 text-[10px]">{r.usageCount}</Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports…" className="pl-9" value={search} onChange={(e) => handleSearchChange(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {departments.map((d) => <SelectItem key={d} value={d}>{d === "all" ? "All Departments" : d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Report Grid + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedReports.map((r) => (
              <Card
                key={r.id}
                className={`cursor-pointer hover:border-primary/40 hover:shadow-md transition-all shadow-sm min-h-[120px] max-h-[160px] ${selectedReport === r.id ? "border-primary ring-1 ring-primary/20" : ""}`}
                onClick={() => setSelectedReport(r.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{r.department}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{r.usageCount} uses</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"><Eye className="h-3 w-3" />Preview</Button>
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"><Download className="h-3 w-3" />Export</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground font-semibold">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <Card className="card-premium shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Report Preview</CardTitle></CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {selectedReport ? getReportPreview(selectedReport) : (
              <p className="text-sm text-muted-foreground text-center py-8">Select a report to preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
