import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface FAQ {
  q: string;
  a: string;
  category: string;
  popular?: boolean;
}

const categories = ["All", "Account", "Contributions", "Tax", "Withdrawal", "Investment", "General"];

const faqs: FAQ[] = [
  { q: "What is the National Pension System (NPS)?", a: "NPS is a government-sponsored pension scheme launched in 2004, regulated by PFRDA. It allows individuals to save for retirement through a portable, flexible, and low-cost investment vehicle. Subscribers can choose their fund manager and asset allocation.", category: "General", popular: true },
  { q: "Who is eligible to join NPS?", a: "Any Indian citizen aged 18-70 can join. This includes residents, non-residents (NRIs), and Hindu Undivided Families (HUFs). OCI cardholders are not eligible.", category: "Account" },
  { q: "What is the minimum contribution for NPS?", a: "Tier I: Minimum ₹500 per contribution, with at least ₹1,000 per year. Tier II: Minimum ₹250 per contribution, no annual minimum.", category: "Contributions", popular: true },
  { q: "What is the difference between Tier I and Tier II?", a: "Tier I is a pension account with lock-in till 60 and tax benefits. Tier II is a voluntary savings account with no lock-in and no tax benefits (except for govt employees). Both allow you to choose fund managers and asset allocation.", category: "Account", popular: true },
  { q: "What tax benefits are available under NPS?", a: "Section 80C: Up to ₹1.5 lakh deduction. Section 80CCD(1B): Additional ₹50,000 exclusive to NPS. Section 80CCD(2): Employer contribution up to 10% of salary (14% for govt). At maturity, 60% lump sum is tax-free.", category: "Tax", popular: true },
  { q: "How do I open an NPS account online?", a: "Visit enps.nsdl.com → Click Registration → Select Individual → Complete e-KYC with Aadhaar → Choose fund manager and scheme → Make initial contribution → Get your PRAN. Takes about 15 minutes.", category: "Account" },
  { q: "What is PRAN?", a: "PRAN stands for Permanent Retirement Account Number. It's a unique 12-digit number assigned to every NPS subscriber. It's portable across jobs and locations, and remains the same throughout your NPS journey.", category: "Account" },
  { q: "Can I change my fund manager?", a: "Yes, you can change your fund manager once per financial year. Log in to CRA website or visit a PoP to submit the request. The switch is processed within 3 working days.", category: "Investment" },
  { q: "What are the investment options in NPS?", a: "NPS offers 4 asset classes: Equity (E) - up to 75%, Corporate Bonds (C), Government Securities (G), and Alternative Assets (A) - up to 5%. You can choose Active Choice (self-select) or Auto Choice (lifecycle-based).", category: "Investment" },
  { q: "What is Active Choice vs Auto Choice?", a: "Active Choice: You decide asset allocation (max 75% equity). Auto Choice: Allocation automatically adjusts based on your age — Aggressive (LC75), Moderate (LC50), or Conservative (LC25).", category: "Investment" },
  { q: "Can I withdraw from NPS before 60?", a: "Premature exit is allowed after 5 years. You can withdraw only 20% as lump sum; 80% must be used for annuity. If corpus ≤ ₹2.5 lakh, full withdrawal is permitted.", category: "Withdrawal" },
  { q: "What is partial withdrawal in NPS?", a: "After 3 years, you can withdraw up to 25% of your own contributions (max 3 times) for specified reasons: children's education/marriage, house purchase, or critical illness treatment.", category: "Withdrawal" },
  { q: "What happens to NPS at age 60?", a: "At 60, you can withdraw up to 60% as tax-free lump sum and must use 40% to buy an annuity for monthly pension. You can defer this up to age 75.", category: "Withdrawal", popular: true },
  { q: "What are the annuity options?", a: "Annuity is purchased from empanelled insurers (LIC, SBI Life, ICICI Prudential, etc.). Options include: life annuity, annuity with return of purchase price, joint life annuity, and annuity increasing at fixed rate.", category: "Withdrawal" },
  { q: "Who are the NPS fund managers?", a: "Seven fund managers: SBI Pension Fund, LIC Pension Fund, UTI Retirement Solutions, HDFC Pension Fund, ICICI Prudential Pension Fund, Kotak Pension Fund, and Aditya Birla Sun Life Pension Fund.", category: "Investment" },
  { q: "Can NRIs invest in NPS?", a: "Yes, NRIs can invest in NPS. However, OCI holders are not eligible. NRI contributions are subject to regulatory guidelines. Account will be closed if citizenship status changes.", category: "General" },
  { q: "How do I check my NPS balance?", a: "Log in to CRA website (cra-nsdl.com) with your PRAN and password. You can also use the NSDL NPS mobile app, or call 1800-222-080 (toll-free).", category: "Account" },
  { q: "What is the lock-in period for NPS?", a: "Tier I has a lock-in until age 60 (or 3 years for partial withdrawal). Tier II has no lock-in period — you can withdraw anytime.", category: "General" },
  { q: "How much should I invest in NPS monthly?", a: "This depends on your retirement goals. A good starting point is ₹5,000-10,000/month. Use our Pension Calculator to find the right amount based on your age and target corpus.", category: "Contributions" },
  { q: "Is NPS safe?", a: "NPS is regulated by PFRDA (govt body) and managed by SEBI-registered fund managers. Investments are market-linked, so returns aren't guaranteed, but the regulatory framework is robust and transparent.", category: "General" },
  { q: "Can I have multiple NPS accounts?", a: "No, each individual can have only one NPS Tier I account. However, you can have one Tier I and one Tier II account under the same PRAN.", category: "Account" },
  { q: "What is the grievance redressal process?", a: "Lodge complaints through CRA website, PFRDA portal (pfrda.org.in), or call 1800-110-708. Complaints are typically resolved within 30 days.", category: "General" },
  { q: "How is NPS different from PPF?", a: "NPS is market-linked with higher potential returns (8-14%), while PPF offers fixed returns (~7.1%). NPS has partial lock-in with annuity requirement; PPF has 15-year lock-in with full withdrawal. Both offer tax benefits under 80C.", category: "General" },
  { q: "Can I contribute to NPS and EPF both?", a: "Yes, you can contribute to both NPS and EPF. Tax benefits under 80C are shared (₹1.5L combined limit), but NPS offers additional ₹50,000 under 80CCD(1B).", category: "Contributions" },
  { q: "What if I miss my NPS contribution?", a: "Tier I account will be frozen if annual minimum (₹1,000) is not met. To reactivate, pay pending minimum contributions plus ₹100 penalty per year of default.", category: "Contributions" },
];

export default function FAQs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat = category === "All" || f.category === category;
      const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const popular = faqs.filter((f) => f.popular);

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">Find answers to common NPS questions</p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Popular */}
        {!search && category === "All" && (
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">🔥 Most Popular</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {popular.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setSearch(f.q.slice(0, 20))}
                  className="rounded-lg border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:bg-accent"
                >
                  {f.q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ List */}
        <Accordion type="multiple" className="space-y-2">
          {filtered.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <AccordionItem value={`faq-${i}`} className="rounded-lg border border-border bg-card px-1">
                <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                      {f.category}
                    </span>
                    {f.q}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                  <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Was this helpful?</span>
                    <button onClick={() => toast.success("Thanks for the feedback!")} className="rounded p-1 hover:bg-accent transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => toast.info("We'll improve this answer.")} className="rounded p-1 hover:bg-accent transition-colors">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No FAQs found for your search.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl hero-gradient p-8 text-center">
          <h2 className="text-xl font-bold text-primary-foreground">Still have questions?</h2>
          <p className="mt-2 text-sm text-primary-foreground/70">Our AI assistant can help with any NPS query</p>
          <Button asChild className="mt-4 bg-card text-primary hover:bg-card/90">
            <Link to="/chat">
              <MessageSquare className="mr-2 h-4 w-4" /> Ask AI Assistant
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
