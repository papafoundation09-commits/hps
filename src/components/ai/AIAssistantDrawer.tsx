import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Stethoscope,
  RefreshCw,
  MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, currentRole } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Hello! I am srivoratech AI, your clinical intelligence assistant. I am configured for your current perspective as **${currentRole.replace("_", " ").toUpperCase()}**. How can I assist you with clinical guidelines, drug interaction inquiries, or patient education?`
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isAiDrawerOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
          userRole: currentRole
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: "model", content: data.text }]);
      } else {
        throw new Error("No response text");
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "I am currently running in local offline mode. For hypertension management (ICD-10 I10), first-line agents include ACE inhibitors/ARBs, CCBs, or thiazide diuretics as per AHA/ACC 2024 guidelines. Please consult the attending physician."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-100 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                srivoratech AI Assistant
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <p className="text-[10px] text-slate-400 capitalize">
                Role Context: {currentRole.replace("_", " ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => setInput("What are the first-line treatments for Hypertension?")}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
          >
            Hypertension Rx
          </button>
          <button
            onClick={() => setInput("Summarize typical ECG changes in acute ischemia")}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
          >
            ECG Ischemia
          </button>
          <button
            onClick={() => setInput("Check interaction between Atorvastatin and Clarithromycin")}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
          >
            Drug Interaction
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "model" && (
                <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyan-600 text-white font-medium rounded-br-none"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>srivoratech AI is reviewing clinical literature...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask srivoratech AI clinical query..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
