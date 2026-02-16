import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, IndianRupee, PiggyBank, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Layout from "@/components/Layout";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function PensionCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthly, setMonthly] = useState(5000);
  const [returnRate, setReturnRate] = useState(10);
  const [equity, setEquity] = useState(50);
  const [corporate, setCorporate] = useState(30);
  const govt = 100 - equity - corporate;

  const results = useMemo(() => {
    const years = retireAge - age;
    const monthlyRate = returnRate / 100 / 12;
    const totalMonths = years * 12;
    const totalInvested = monthly * totalMonths;

    // Future value of annuity
    const corpus = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const returns = corpus - totalInvested;

    // Estimated monthly pension (40% annuity at 6% return)
    const annuityCorpus = corpus * 0.4;
    const monthlyPension = (annuityCorpus * 0.06) / 12;

    // Tax saved
    const yearlyContribution = monthly * 12;
    const tax80C = Math.min(yearlyContribution, 150000);
    const tax80CCD = Math.min(Math.max(yearlyContribution - 150000, 0), 50000);
    const totalTaxSaved = (tax80C + tax80CCD) * 0.3 * years; // assuming 30% bracket

    // Year-wise data
    const chartData = [];
    let accumulated = 0;
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      accumulated = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      chartData.push({
        year: age + y,
        corpus: Math.round(accumulated),
        invested: monthly * months,
      });
    }

    return { corpus, totalInvested, returns, monthlyPension, totalTaxSaved, chartData, years };
  }, [age, retireAge, monthly, returnRate]);

  const scenarios = useMemo(() => {
    const amounts = [monthly, monthly * 1.5, monthly * 2];
    return amounts.map((amt) => {
      const years = retireAge - age;
      const monthlyRate = returnRate / 100 / 12;
      const totalMonths = years * 12;
      const corpus = amt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      return { amount: amt, corpus };
    });
  }, [age, retireAge, monthly, returnRate]);

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            <Calculator className="mr-2 inline h-8 w-8 text-primary" />
            NPS Pension Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate your retirement corpus and estimated monthly pension
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 rounded-xl border border-border bg-card p-6 lg:col-span-2"
          >
            <SliderInput label="Current Age" value={age} onChange={setAge} min={18} max={65} unit=" years" />
            <SliderInput label="Retirement Age" value={retireAge} onChange={setRetireAge} min={Math.max(age + 1, 60)} max={70} unit=" years" />
            <SliderInput label="Monthly Contribution" value={monthly} onChange={setMonthly} min={500} max={50000} step={500} prefix="₹" />
            <SliderInput label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={6} max={12} step={0.5} unit="%" />

            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium">Investment Mix</p>
              <SliderInput label="Equity (E)" value={equity} onChange={(v) => { setEquity(v); if (v + corporate > 100) setCorporate(100 - v); }} min={0} max={75} unit="%" compact />
              <SliderInput label="Corporate Bonds (C)" value={corporate} onChange={(v) => { setCorporate(Math.min(v, 100 - equity)); }} min={0} max={100 - equity} unit="%" compact />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Govt Securities (G)</span>
                <span className="font-mono-nums font-medium">{govt}%</span>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 lg:col-span-3"
          >
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultCard icon={PiggyBank} label="Total Corpus at Retirement" value={formatINR(results.corpus)} accent />
              <ResultCard icon={IndianRupee} label="Estimated Monthly Pension" value={formatINR(results.monthlyPension)} />
              <ResultCard icon={TrendingUp} label="Total Returns Earned" value={formatINR(results.returns)} />
              <ResultCard icon={Percent} label={`Tax Saved (${results.years} years)`} value={formatINR(results.totalTaxSaved)} />
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Total invested: {formatINR(results.totalInvested)} over {results.years} years
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-sm font-medium">Corpus Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.chartData}>
                  <defs>
                    <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 72%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(221, 72%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => formatINR(v)} tick={{ fontSize: 11 }} width={80} />
                  <Tooltip
                    formatter={(value: number) => formatINR(value)}
                    labelFormatter={(label) => `Age ${label}`}
                  />
                  <Area type="monotone" dataKey="corpus" stroke="hsl(221, 72%, 40%)" fill="url(#corpusGrad)" strokeWidth={2} name="Corpus" />
                  <Line type="monotone" dataKey="invested" stroke="hsl(258, 83%, 58%)" strokeWidth={2} dot={false} name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-sm font-medium">What-If Scenarios</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {scenarios.map((s, i) => (
                  <div key={i} className={`rounded-lg p-4 text-center ${i === 0 ? "bg-muted" : i === 1 ? "bg-accent" : "hero-gradient text-primary-foreground"}`}>
                    <p className="text-xs text-muted-foreground">{i === 0 ? "Current" : i === 1 ? "1.5× more" : "2× more"}</p>
                    <p className="mt-1 font-mono-nums text-lg font-bold">{formatINR(s.amount)}/mo</p>
                    <p className="mt-2 font-mono-nums text-sm font-semibold">{formatINR(s.corpus)}</p>
                    <p className="text-xs text-muted-foreground">corpus</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function SliderInput({
  label, value, onChange, min, max, step = 1, unit = "", prefix = "", compact = false,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit?: string; prefix?: string; compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <div className="flex items-center justify-between">
        <label className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>{label}</label>
        <span className={`font-mono-nums ${compact ? "text-xs" : "text-sm"} font-semibold`}>
          {prefix}{value.toLocaleString("en-IN")}{unit}
        </span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, accent = false }: {
  icon: any; label: string; value: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "hero-gradient border-transparent text-primary-foreground" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${accent ? "text-primary-foreground/70" : "text-primary"}`} />
        <span className={`text-xs ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</span>
      </div>
      <p className="mt-2 font-mono-nums text-2xl font-bold">{value}</p>
    </div>
  );
}
