import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, BarChart3, PieChart, Table2, Hash, GripVertical, Plus, Save, Trash2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend } from "recharts";
import { monthlyRevenue, spendByCommodity } from "@/data/mockData";

interface Widget {
  id: string;
  type: "kpi" | "bar" | "pie" | "table";
  title: string;
}

const widgetPalette = [
  { type: "kpi" as const, label: "KPI Card", icon: Hash, gradient: "gradient-card-warm" },
  { type: "bar" as const, label: "Bar Chart", icon: BarChart3, gradient: "gradient-card-indigo" },
  { type: "pie" as const, label: "Pie Chart", icon: PieChart, gradient: "gradient-card-amber" },
  { type: "table" as const, label: "Data Table", icon: Table2, gradient: "gradient-card-teal" },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--indigo))",
  "hsl(var(--amber))",
  "hsl(var(--rose))",
  "hsl(var(--teal))",
];

let widgetCounter = 0;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-foreground">{typeof p.value === "number" ? `$${(p.value / 1e6).toFixed(1)}M` : p.value}</p>
      ))}
    </div>
  );
};

export default function DragDropBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "w1", type: "kpi", title: "Total Revenue" },
    { id: "w2", type: "bar", title: "Monthly Revenue" },
  ]);

  const addWidget = (type: Widget["type"]) => {
    widgetCounter++;
    const labels = { kpi: "KPI Card", bar: "Bar Chart", pie: "Pie Chart", table: "Data Table" };
    setWidgets((w) => [...w, { id: `w-${widgetCounter}`, type, title: labels[type] }]);
  };

  const removeWidget = (id: string) => setWidgets((w) => w.filter((x) => x.id !== id));

  const gradientMap: Record<string, string> = { kpi: "gradient-card-warm", bar: "gradient-card-indigo", pie: "gradient-card-amber", table: "gradient-card-teal" };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Palette */}
      <div className="w-60 shrink-0 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold text-indigo uppercase tracking-widest">Widget Palette</h2>
        </div>
        {widgetPalette.map((w) => (
          <button
            key={w.type}
            onClick={() => addWidget(w.type)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/60 ${w.gradient} hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group`}
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <w.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{w.label}</span>
            <Plus className="h-3.5 w-3.5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
        <div className="border-t border-border/60 pt-4 mt-4">
          <Button className="w-full gap-2 rounded-xl h-11 btn-glow" size="sm">
            <Save className="h-4 w-4" />Save Layout
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2.5 text-indigo">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-primary-foreground" />
              </div>
              Drag &amp; Drop Builder
            </h1>
            <p className="text-sm font-semibold text-muted-foreground mt-1 ml-12">Click widgets to add them to your canvas</p>
          </div>
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-bold border-primary/30 text-primary">
            {widgets.length} widget{widgets.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {widgets.map((w) => (
            <Card
              key={w.id}
              className={`group relative card-premium rounded-xl border-border/50 overflow-hidden ${gradientMap[w.type] || ""} animate-fade-in`}
            >
              {/* Hover controls */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1.5 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive"
                  onClick={() => removeWidget(w.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <div className="h-7 w-7 rounded-lg bg-muted/80 flex items-center justify-center cursor-grab">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-sm font-bold text-indigo tracking-wide">{w.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {w.type === "kpi" && (
                  <div className="text-center py-6">
                    <p className="text-4xl font-extrabold text-foreground tracking-tight">$14.8M</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-2">Total Revenue YTD</p>
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        ↑ 12.4%
                      </span>
                      <span className="text-xs text-muted-foreground">vs last year</span>
                    </div>
                  </div>
                )}
                {w.type === "bar" && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyRevenue.slice(0, 6)} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickFormatter={(v) => `${v / 1e6}M`} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {w.type === "pie" && (
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Pie
                        data={spendByCommodity}
                        cx="50%"
                        cy="45%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="value"
                        nameKey="name"
                        strokeWidth={2}
                        stroke="hsl(var(--background))"
                      >
                        {spendByCommodity.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => <span className="text-xs font-semibold text-muted-foreground ml-1">{value}</span>}
                      />
                    </RPieChart>
                  </ResponsiveContainer>
                )}
                {w.type === "table" && (
                  <div className="text-xs space-y-1.5 mt-1">
                    {[
                      { name: "Mouser", val: "$245K" },
                      { name: "Digi-Key", val: "$180K" },
                      { name: "Arrow", val: "$310K" },
                      { name: "Würth", val: "$95K" },
                    ].map((r, i) => (
                      <div
                        key={r.name}
                        className={`flex justify-between items-center px-3.5 py-2.5 rounded-lg transition-colors hover:bg-primary/5 ${
                          i % 2 === 0 ? "bg-muted/40" : "bg-background"
                        }`}
                      >
                        <span className="font-semibold text-foreground">{r.name}</span>
                        <span className="font-bold text-foreground tabular-nums">{r.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {widgets.length === 0 && (
            <div className="col-span-2 border-2 border-dashed border-primary/20 rounded-2xl p-16 text-center animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="h-8 w-8 text-primary/50" />
              </div>
              <p className="font-bold text-foreground text-lg">Canvas is empty</p>
              <p className="text-sm font-semibold text-muted-foreground mt-1">Click a widget from the palette to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}