import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, TrendingUp, LogOut, UserPlus, CheckCircle2, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Module {
  id: string;
  icon: any;
  title: string;
  items: { q: string; a: string }[];
}

const modules: Module[] = [
  {
    id: "basics",
    icon: BookOpen,
    title: "NPS Basics",
    items: [
      {
        q: "What is NPS?",
        a: "The National Pension System (NPS) is a voluntary, defined-contribution retirement savings scheme introduced by the Government of India. Regulated by PFRDA, it allows individuals aged 18-70 to build a retirement corpus through systematic savings and investment in diversified portfolios managed by professional fund managers.",
      },
      {
        q: "Who can join NPS?",
        a: "Any Indian citizen (resident or non-resident) between 18-70 years can join NPS. Both salaried and self-employed individuals are eligible. Government employees joining after January 2004 are automatically enrolled. OCI cardholders are not eligible.",
      },
      {
        q: "Types of NPS Accounts",
        a: "**Tier I (Pension Account):** Mandatory for NPS participation. Lock-in till age 60. Minimum ₹500/month or ₹1,000/year contribution. Tax benefits under 80C and 80CCD. **Tier II (Investment Account):** Optional, flexible savings account. No lock-in period, withdraw anytime. No tax benefits (except govt employees). Minimum ₹250 initial contribution. Requires active Tier I account.",
      },
      {
        q: "Benefits of NPS",
        a: "• Low cost: Fund management charges are among the lowest globally (0.01%)\n• Flexibility: Choose your own asset allocation and fund manager\n• Portability: PRAN is portable across jobs, cities, and states\n• Tax benefits: Up to ₹2 lakh deduction under 80C + 80CCD(1B)\n• Professional management: Managed by SEBI-registered fund managers\n• Regulated: Supervised by PFRDA under Government of India",
      },
    ],
  },
  {
    id: "tax",
    icon: Shield,
    title: "Tax Benefits",
    items: [
      {
        q: "Section 80C Deduction",
        a: "Employee contribution to NPS Tier I qualifies for deduction under Section 80C up to ₹1.5 lakh per financial year. This is shared with other 80C investments like ELSS, PPF, EPF, life insurance, etc. Example: If you invest ₹50,000 in NPS and ₹1 lakh in PPF, your total 80C claim is ₹1.5 lakh.",
      },
      {
        q: "Section 80CCD(1B) - Extra ₹50,000",
        a: "This is an exclusive NPS benefit! Over and above the ₹1.5L limit of 80C, you get an additional ₹50,000 deduction for NPS contributions. This effectively means you can save up to ₹15,600 extra in taxes (at 31.2% bracket). No other investment offers this additional benefit.",
      },
      {
        q: "Employer Contribution - 80CCD(2)",
        a: "If your employer contributes to NPS on your behalf, that amount is deductible up to 10% of your salary (Basic + DA). For central government employees, this limit is 14%. This deduction has NO upper cap in absolute terms and is over and above 80C and 80CCD(1B) limits.",
      },
    ],
  },
  {
    id: "investment",
    icon: TrendingUp,
    title: "Investment Options",
    items: [
      {
        q: "Asset Classes",
        a: "**Equity (E):** Up to 75% allocation. Invests in equity markets. Higher risk, higher returns.\n**Corporate Bonds (C):** Fixed-income instruments issued by corporations. Moderate risk and returns.\n**Government Securities (G):** Safest option. Invests in govt bonds. Lower but stable returns.\n**Alternative Assets (A):** Up to 5%. Includes REITs, InvITs, CMBS. Only in Active Choice.",
      },
      {
        q: "Active vs Auto Choice",
        a: "**Active Choice:** You decide the allocation across E, C, G, A classes. Maximum 75% in equity (reduces with age). Full control over your portfolio. **Auto Choice (Lifecycle Fund):** Automatic allocation based on your age. Three options: Aggressive (LC75), Moderate (LC50), Conservative (LC25). Equity allocation automatically reduces as you approach 60.",
      },
      {
        q: "Fund Managers",
        a: "Choose from 7 pension fund managers: SBI Pension Fund, LIC Pension Fund, UTI Retirement Solutions, HDFC Pension Fund, ICICI Prudential Pension Fund, Kotak Pension Fund, and Aditya Birla Sun Life Pension Fund. You can switch fund managers once per year. Historical returns vary between 8-14% depending on asset class.",
      },
    ],
  },
  {
    id: "withdrawal",
    icon: LogOut,
    title: "Withdrawal & Exit",
    items: [
      {
        q: "Normal Exit (at 60)",
        a: "At age 60, you can: withdraw up to 60% of corpus as lump sum (completely tax-free), and use the remaining 40% to purchase an annuity plan from an empanelled insurance company. The annuity will provide you a regular monthly pension for life. You can defer withdrawal up to age 75.",
      },
      {
        q: "Premature Exit",
        a: "If exiting before 60 (after minimum 5 years): only 20% can be withdrawn as lump sum, 80% must be used to buy annuity. If total corpus is ≤ ₹2.5 lakh, complete withdrawal is allowed. The lump sum portion is taxable as per your income slab.",
      },
      {
        q: "Partial Withdrawal",
        a: "Allowed after 3 years of NPS membership. Maximum 25% of own contributions (not employer's). Allowed up to 3 times during entire NPS tenure. Permitted reasons: children's higher education, children's marriage, purchase/construction of house, treatment of critical illness, skill development. Tax-free up to 25% of own contribution.",
      },
    ],
  },
  {
    id: "open",
    icon: UserPlus,
    title: "How to Open Account",
    items: [
      {
        q: "Step-by-Step Guide (eNPS)",
        a: "1. Visit enps.nsdl.com and click 'Registration'\n2. Select 'Individual Subscriber'\n3. Choose registration type (Aadhaar or PAN)\n4. Fill personal details and upload documents\n5. Complete e-KYC with OTP verification\n6. Select fund manager and investment option\n7. Make initial contribution (min ₹500 for Tier I)\n8. Receive PRAN (Permanent Retirement Account Number)\n\nThe entire process takes about 15 minutes online.",
      },
      {
        q: "Required Documents",
        a: "✅ Aadhaar Card (mandatory for eNPS)\n✅ PAN Card\n✅ Bank account details with cancelled cheque\n✅ Passport-size photograph\n✅ Address proof (Aadhaar/Passport/Utility bill)\n✅ Date of birth proof\n✅ Nominee details (optional but recommended)",
      },
      {
        q: "eNPS vs Offline Process",
        a: "**eNPS (Online):** Faster, 15 minutes. Aadhaar-based e-KYC. Instant PRAN generation. Pay online. **Offline (PoP):** Visit a Point of Presence (bank/post office). Fill physical form. Submit documents. Takes 10-15 working days. Good for those who prefer in-person assistance. Both methods create the same type of NPS account.",
      },
    ],
  },
];

export default function LearnNPS() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            Learn <span className="text-gradient">NPS</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete guide to the National Pension System
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Your Progress</span>
            <span className="font-mono-nums text-primary">{completed.length}/{modules.length} modules</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full hero-gradient rounded-full"
              animate={{ width: `${(completed.length / modules.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2.5 ${completed.includes(mod.id) ? "bg-success/10 text-success" : "bg-accent text-primary"}`}>
                    {completed.includes(mod.id) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <mod.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold">{mod.title}</h2>
                    <p className="text-xs text-muted-foreground">{mod.items.length} topics</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleComplete(mod.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    completed.includes(mod.id)
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {completed.includes(mod.id) ? "Completed ✓" : "Mark Complete"}
                </button>
              </div>
              <Accordion type="multiple" className="px-2">
                {mod.items.map((item, j) => (
                  <AccordionItem key={j} value={`${mod.id}-${j}`}>
                    <AccordionTrigger className="px-3 text-sm hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a.split("\n").map((line, k) => (
                        <p key={k} className={k > 0 ? "mt-1.5" : ""}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, l) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={l} className="text-foreground">{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={l}>{part}</span>
                            )
                          )}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
