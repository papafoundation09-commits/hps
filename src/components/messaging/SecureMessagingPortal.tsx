import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Search, 
  User, 
  CheckCheck, 
  Sparkles,
  FileText,
  Image,
  AlertCircle
} from "lucide-react";

export const SecureMessagingPortal: React.FC = () => {
  const { messages, sendMessage, activeUserId, activeUserName, currentRole } = useApp();

  const [activeThreadId, setActiveThreadId] = useState("thread-pat1001-doc101");
  const [inputText, setInputText] = useState("");
  const [isUrgentFlag, setIsUrgentFlag] = useState(false);

  const activeThreadMessages = messages.filter((m) => m.threadId === activeThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      currentRole === "patient" ? "doc-101" : "pat-1001",
      currentRole === "patient" ? "Dr. Sarah Jenkins, MD" : "Michael Chang",
      currentRole === "patient" ? "doctor" : "patient",
      inputText
    );

    setInputText("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        {/* Thread Sidebar */}
        <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 p-4 space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Encrypted Chats</span>
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              HIPAA Encrypted
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveThreadId("thread-pat1001-doc101")}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                activeThreadId === "thread-pat1001-doc101"
                  ? "bg-cyan-500/10 border-cyan-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-600/30 flex items-center justify-center text-cyan-300 font-bold">
                SJ
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs truncate">Dr. Sarah Jenkins, MD</h4>
                <p className="text-[10px] text-slate-400 truncate">Cardiology Consult Thread</p>
              </div>
            </button>
          </div>
        </div>

        {/* Chat Conversation Main Panel */}
        <div className="flex-1 flex flex-col justify-between bg-slate-900">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                SJ
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Dr. Sarah Jenkins, MD</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure Patient-Provider Direct Messaging
                </p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            {activeThreadMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.senderId === activeUserId ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-slate-500 mb-1">{m.senderName} • {m.timestamp}</span>
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl leading-relaxed ${
                    m.senderId === activeUserId
                      ? "bg-cyan-600 text-white rounded-br-none font-medium shadow-md"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write secure message to provider..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
