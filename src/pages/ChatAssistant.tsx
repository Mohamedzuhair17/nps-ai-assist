import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Volume2, Copy, ThumbsUp, ThumbsDown,
  Plus, Globe, MessageSquare, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const languages = [
  "English", "Hindi", "Tamil", "Telugu", "Bengali",
  "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi",
];

const quickActions = [
  "What is NPS?",
  "Tax Benefits",
  "How to Open Account",
  "Calculate My Pension",
  "Withdrawal Rules",
];

const welcomeMsg: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! 👋 I'm your NPS Assistant. Ask me anything about the National Pension System — account setup, tax benefits, withdrawals, pension calculations, and more. Choose your preferred language from the sidebar to get started!",
  timestamp: new Date(),
};

// Mock AI responses for demo (will be replaced with actual AI integration)
const mockResponses: Record<string, string> = {
  "what is nps?":
    "**National Pension System (NPS)** is a government-sponsored pension scheme launched in 2004. It's regulated by PFRDA and available to all Indian citizens aged 18-70.\n\n**Key highlights:**\n- Voluntary, defined-contribution retirement savings scheme\n- **Tier I** (mandatory): Lock-in till 60, tax benefits under 80C & 80CCD\n- **Tier II** (optional): Flexible withdrawals, no tax benefits\n- Minimum contribution: ₹500/month or ₹1,000/year for Tier I\n- Choose your own fund manager and asset allocation\n\nWould you like to know about tax benefits or how to open an account?",
  "tax benefits":
    "**NPS Tax Benefits are among the best for retirement savings:**\n\n1. **Section 80C** — Up to ₹1.5 lakh deduction\n2. **Section 80CCD(1B)** — Additional ₹50,000 deduction (exclusive to NPS!)\n3. **Section 80CCD(2)** — Employer contribution up to 10% of salary (14% for govt)\n\n💡 **Total possible tax saving: Up to ₹2 lakh** under NPS alone!\n\n**At maturity (after 60):**\n- 60% of corpus is tax-free on withdrawal\n- 40% must be used to buy annuity\n\nShall I calculate your tax savings?",
  "how to open account":
    "**Opening an NPS Account is easy! Here's how:**\n\n**Online (eNPS) — Fastest method:**\n1. Visit [enps.nsdl.com](https://enps.nsdl.com)\n2. Click \"Registration\" → \"Individual Subscriber\"\n3. Enter Aadhaar or PAN details\n4. Complete KYC with OTP verification\n5. Choose investment preferences\n6. Make initial contribution (min ₹500)\n7. Get your **PRAN** (Permanent Retirement Account Number)\n\n**Documents needed:**\n- ✅ Aadhaar Card\n- ✅ PAN Card\n- ✅ Bank account details\n- ✅ Passport-size photo\n- ✅ Address proof\n\nThe entire online process takes about 15 minutes!",
  "withdrawal rules":
    "**NPS Withdrawal Rules:**\n\n**At 60 (Normal Exit):**\n- Withdraw up to **60% as lump sum** (tax-free)\n- Remaining **40% must buy an annuity** (monthly pension)\n\n**Before 60 (Premature Exit):**\n- Allowed after **5 years** of membership\n- Must use **80% for annuity**, only **20% as lump sum**\n- The lump sum portion is taxable\n\n**Partial Withdrawal:**\n- Allowed after **3 years** of membership\n- Up to **25% of own contributions** (not employer's)\n- Maximum **3 times** during entire tenure\n- Allowed for: children's education, marriage, house purchase, medical treatment\n\nWant me to explain annuity options?",
};

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const key = text.trim().toLowerCase().replace(/[?!]/g, "").trim();
    const response =
      mockResponses[key] ||
      `Thank you for your question about "${text}". In a production environment, this would connect to an AI model to provide a detailed, accurate response about NPS.\n\nTo enable AI-powered responses, please connect Lovable Cloud and configure the AI integration.\n\nIn the meantime, you can explore our **Learn NPS** section or use the **Pension Calculator** for instant projections!`;

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in your browser.");
      return;
    }
    setIsRecording(!isRecording);
    if (!isRecording) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "Hindi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        toast.error("Could not recognize speech. Please try again.");
      };
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const speak = (text: string) => {
    const stripped = text.replace(/[*#_\[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(stripped);
    utterance.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    speechSynthesis.speak(utterance);
    toast.success("Speaking...");
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col gap-4 overflow-y-auto border-r border-border bg-card p-4"
            >
              {/* Language */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {languages.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setMessages([welcomeMsg])}
              >
                <Plus className="h-4 w-4" /> New Conversation
              </Button>

              {/* Quick Actions */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Quick Actions</p>
                <div className="flex flex-col gap-1.5">
                  {quickActions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className="mt-auto">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Chats</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="truncate">Tax Benefits Query</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="truncate">Account Opening Help</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat */}
        <div className="flex flex-1 flex-col">
          {/* Toggle sidebar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Globe className="mr-1.5 h-4 w-4" />
              {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              Language: {language}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-2xl space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-chat-user text-chat-user-foreground"
                          : "bg-chat-ai text-chat-ai-foreground"
                      }`}
                    >
                      {/* Simple markdown-ish rendering */}
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={j}>{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                        </p>
                      ))}
                      {/* Actions for AI messages */}
                      {msg.role === "assistant" && msg.id !== "welcome" && (
                        <div className="mt-3 flex items-center gap-1 border-t border-border/50 pt-2">
                          <button onClick={() => copyText(msg.content)} className="rounded p-1 hover:bg-background/50 transition-colors" title="Copy">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => speak(msg.content)} className="rounded p-1 hover:bg-background/50 transition-colors" title="Read aloud">
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => toast.success("Thanks for the feedback!")} className="rounded p-1 hover:bg-background/50 transition-colors" title="Helpful">
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => toast.info("We'll improve our responses.")} className="rounded p-1 hover:bg-background/50 transition-colors" title="Not helpful">
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-chat-ai px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary" />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="mx-auto flex max-w-2xl items-center gap-2"
            >
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoice}
                className="shrink-0"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about NPS..."
                  maxLength={500}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  {input.length}/500
                </span>
              </div>
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
