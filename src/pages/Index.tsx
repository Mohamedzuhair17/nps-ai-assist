import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Calculator, Globe, Zap, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Globe,
    title: "Multilingual Support",
    desc: "Get answers in 10+ Indian languages including Hindi, Tamil, Telugu, Bengali, and more.",
  },
  {
    icon: Zap,
    title: "Smart Calculations",
    desc: "Instant pension projections with our interactive calculator. Plan your retirement with confidence.",
  },
  {
    icon: Clock,
    title: "24/7 Assistance",
    desc: "Always available AI help for NPS queries — account setup, tax benefits, withdrawals, and more.",
  },
];

const stats = [
  { value: "10,000+", label: "Queries Answered" },
  { value: "10", label: "Languages Supported" },
  { value: "99%", label: "Satisfaction Rate" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="container relative z-10 flex flex-col items-center py-24 text-center md:py-36">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
          >
            Your Smart NPS Companion — Get Instant Answers in Your Language
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 max-w-xl text-lg text-primary-foreground/80"
          >
            AI-powered assistant for National Pension System queries, calculations, and financial planning.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2 bg-card text-primary hover:bg-card/90">
              <Link to="/chat">
                <MessageSquare className="h-5 w-5" /> Start Chat
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 bg-card text-primary hover:bg-card/90">
              <Link to="/calculator">
                <Calculator className="h-5 w-5" /> Calculate Pension
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Everything You Need for <span className="text-gradient">NPS Planning</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Our AI assistant simplifies National Pension System information, making it accessible to everyone.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="group rounded-xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent p-3 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="hero-gradient">
        <div className="container grid gap-8 py-16 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <p className="font-mono-nums text-4xl font-bold text-primary-foreground md:text-5xl">{s.value}</p>
              <p className="mt-2 text-primary-foreground/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to Plan Your Retirement?</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Start a conversation with our AI assistant or use our calculator to project your pension corpus.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/chat">
              <MessageSquare className="h-5 w-5" /> Chat with AI <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/learn">
              <Users className="h-5 w-5" /> Learn NPS
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
