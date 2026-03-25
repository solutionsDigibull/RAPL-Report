import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, Send, CheckCircle2, ClipboardCheck, DollarSign, ArrowRight, ExternalLink } from "lucide-react";
import { sampleBOM } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const steps = [
  { id: 1, label: "BOM Upload", icon: Upload },
  { id: 2, label: "RFQ Generation", icon: Send },
  { id: 3, label: "Feasibility Check", icon: ClipboardCheck },
  { id: 4, label: "Costed BOM", icon: DollarSign },
  { id: 5, label: "Sales Quote", icon: CheckCircle2 },
];

export default function ExcelQuote() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalBomCost = sampleBOM.reduce((a, b) => a + b.unitCost * b.qty, 0);
  const margin = 0.25;
  const quoteTotal = totalBomCost * (1 + margin);

  const costBreakdown = sampleBOM.map((b) => ({ name: b.mpn.slice(0, 12), cost: b.unitCost * b.qty }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo">BOM to Quote</h1>
        <p className="text-sm font-semibold text-muted-foreground">Transform BOMs into complete sales quotations.</p>
      </div>

      {/* Progress */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold ${currentStep >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {currentStep > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className={`text-xs hidden md:inline ${currentStep >= s.id ? "font-medium" : "text-muted-foreground"}`}>{s.label}</span>
                {i < steps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* External Tool Link */}
      <Card className="card-premium border-0 gradient-card-indigo">
        <CardContent className="py-12 flex flex-col items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-indigo/10 flex items-center justify-center">
            <ExternalLink className="h-8 w-8 text-indigo" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-foreground">BOM to Quote — External Tool</p>
            <p className="text-sm font-semibold text-muted-foreground mt-1 max-w-md">
              This module connects to our dedicated quoting platform. Upload your BOM and generate RFQs, feasibility checks, costed BOMs, and final sales quotes.
            </p>
          </div>
          <Button className="gap-2 btn-glow px-6 h-11 text-sm font-bold" onClick={() => setCurrentStep(2)}>
            <ExternalLink className="h-4 w-4" /> Open Quoting Tool
          </Button>
          <p className="text-xs text-muted-foreground font-semibold">Powered by DigiBull Quoting Engine</p>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep >= 2 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">BOM Data — {sampleBOM.length} line items</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MPN</TableHead><TableHead>Description</TableHead><TableHead>Qty</TableHead>
                  <TableHead>Unit Cost</TableHead><TableHead>Extended</TableHead><TableHead>Supplier</TableHead><TableHead>Lead Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleBOM.map((b) => (
                  <TableRow key={b.mpn} className="hover:bg-primary/5">
                    <TableCell className="font-mono text-xs">{b.mpn}</TableCell>
                    <TableCell>{b.description}</TableCell>
                    <TableCell>{b.qty}</TableCell>
                    <TableCell>${b.unitCost.toFixed(3)}</TableCell>
                    <TableCell className="font-medium">${(b.unitCost * b.qty).toFixed(2)}</TableCell>
                    <TableCell>{b.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={b.leadTime > 100 ? "destructive" : "outline"}>{b.leadTime}d</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {currentStep >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Cost Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={costBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
                  <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
                  <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" />
                  <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
                  <Bar dataKey="cost" fill="hsl(153, 99%, 31%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Quote Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-sm font-semibold text-muted-foreground">BOM Cost</span><span className="font-bold">${totalBomCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-sm font-semibold text-muted-foreground">Margin (25%)</span><span className="font-bold">${(totalBomCost * margin).toFixed(2)}</span></div>
              <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Quote Total</span><span className="text-xl font-bold text-foreground">${quoteTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>Max Lead Time</span><span>130 days (TUSB320IRWBR)</span></div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" disabled={currentStep <= 1} onClick={() => setCurrentStep((s) => s - 1)}>Back</Button>
        <Button disabled={currentStep >= 5} onClick={() => setCurrentStep((s) => s + 1)} className="gap-2">
          {currentStep < 5 ? "Next Step" : "Complete"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
