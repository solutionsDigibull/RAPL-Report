import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, BarChart3, AlertTriangle, TrendingUp, Zap, FileText, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Message {
  role: "user" | "ai";
  content: string;
  chart?: { data: { name: string; value: number }[]; type: "bar" };
  actions?: string[];
}

const sampleQueries = [
  "Which components from Mouser are delayed?",
  "Show spend by commodity for Q1",
  "Top 5 suppliers by order volume",
  "MPNs with lead time > 90 days",
];

const initialMessages: Message[] = [
  { role: "ai", content: "👋 Hi! I'm your AI Insights assistant. Ask me anything about your supply chain, procurement data, or manufacturing metrics. You can also try one of the suggested queries below." },
];

const mockResponses: Record<string, Message> = {
  "Which components from Mouser are delayed?": {
    role: "ai",
    content: "I found **2 components** from Mouser Electronics with extended lead times:\n\n• **LM3940IT-3.3** — LDO Regulator, 14 days (within threshold)\n• **SN74LVC1G14DBVR** — Schmitt Trigger, 28 days (within threshold)\n\nNo critical delays from Mouser currently. However, **TUSB320IRWBR** from Arrow has a 130-day lead time — consider sourcing alternatives.",
    actions: ["Draft RFQ for TUSB320", "Find Alternates"],
  },
  "Show spend by commodity for Q1": {
    role: "ai",
    content: "Here's your **Q1 commodity spend breakdown**:",
    chart: {
      type: "bar",
      data: [
        { name: "Passives", value: 245000 },
        { name: "ICs", value: 520000 },
        { name: "Power", value: 180000 },
        { name: "Connectors", value: 95000 },
        { name: "PCBs", value: 310000 },
      ],
    },
    actions: ["Drill down into ICs", "Export to Excel"],
  },
};

export default function AiInsights() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    const aiMsg = mockResponses[text] || {
      role: "ai" as const,
      content: `Great question! Based on my analysis of your data:\n\n📊 **Summary**: Your overall supply chain health is at 94.2% on-time delivery with 3 active component shortages. I recommend focusing on diversifying suppliers for long-lead-time ICs.\n\n*This is a mock response. Connect to an AI backend for real analysis.*`,
      actions: ["View Details", "Export Report"],
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><Brain className="h-6 w-6 text-primary" /> AI Insights Pro</h1>
          <p className="text-sm font-semibold text-muted-foreground">Conversational AI for data analysis and actionable insights.</p>
        </div>

        <Card className="flex-1 flex flex-col card-premium border-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo text-indigo-foreground shadow-md"
                      : "bg-muted/60 border border-border/50"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.chart && (
                      <div className="mt-3 bg-card rounded-xl p-3 border shadow-sm">
                        <ResponsiveContainer width="100%" height={190}>
                          <BarChart data={msg.chart.data} barCategoryGap="20%">
                            <defs>
                              <linearGradient id="chatBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(153, 99%, 38%)" stopOpacity={1} />
                                <stop offset="100%" stopColor="hsl(153, 99%, 25%)" stopOpacity={0.85} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" vertical={false} />
                            <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} tickFormatter={(v) => `$${v / 1000}K`} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                            <Tooltip
                              formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
                              contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }}
                            />
                            <Bar dataKey="value" fill="url(#chatBarGrad)" radius={[5, 5, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {msg.actions && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {msg.actions.map((a) => (
                          <Button key={a} variant="outline" size="sm" className="text-xs h-7 rounded-full font-semibold hover:bg-primary/5 hover:border-primary/40">{a}</Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Suggested */}
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            {sampleQueries.map((q) => (
              <Button key={q} variant="outline" size="sm" className="text-xs rounded-full font-semibold hover:bg-primary/5 hover:border-primary/40" onClick={() => handleSend(q)}>
                <Sparkles className="h-3 w-3 mr-1 text-primary" />{q}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-muted/20 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your data…"
              className="rounded-full bg-background border-border/60 focus-visible:ring-primary/30"
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            />
            <Button onClick={() => handleSend(input)} size="icon" className="rounded-full shrink-0 btn-glow">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Sidebar Panels */}
      <div className="w-72 hidden lg:flex flex-col gap-5">
        <Card className="card-premium border-0 gradient-card-amber">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber" />Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-amber/10 border border-amber/20">
              <p className="font-bold text-foreground">TUSB320IRWBR — 130d lead time</p>
              <p className="text-muted-foreground font-semibold">Exceeds 120-day threshold</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <p className="font-bold text-foreground">Production cost variance +8%</p>
              <p className="text-muted-foreground font-semibold">Department: PP — last 30 days</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium border-0 gradient-card-warm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <p className="font-bold text-foreground">Passive component costs ↓ 5.2%</p>
              <p className="text-muted-foreground font-semibold">Month-over-month improvement</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <p className="font-bold text-foreground">Order volume ↑ 12%</p>
              <p className="text-muted-foreground font-semibold">Driven by EMEA region growth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
