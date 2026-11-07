import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { DataService } from '../../services/dataService';
import { FAQItem } from '../../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const SaadCareChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am SaadCare Assistant. How can I help you today with appointment booking, clinic hours, or patient guidance?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    DataService.getFAQs().then(setFaqs);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = matchFAQResponse(text, faqs);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const matchFAQResponse = (query: string, faqList: FAQItem[]): string => {
    const qLower = query.toLowerCase();

    // Emergency check
    if (qLower.includes('chest pain') || qLower.includes('stroke') || qLower.includes('cannot breathe') || qLower.includes('unconscious') || qLower.includes('bleeding')) {
      return '⚠️ EMERGENCY ALERT: If you or someone else is experiencing severe chest pain, extreme shortness of breath, loss of consciousness, or uncontrollable bleeding, please call emergency services (1122) or go immediately to the nearest hospital Emergency Room.';
    }

    // Direct FAQ Keyword Matching
    for (const faq of faqList) {
      if (faq.keywords && faq.keywords.some(kw => qLower.includes(kw.toLowerCase()))) {
        return faq.answer;
      }
      if (qLower.includes(faq.question.toLowerCase())) {
        return faq.answer;
      }
    }

    // Contextual Fallback matching
    if (qLower.includes('book') || qLower.includes('appointment') || qLower.includes('schedule')) {
      return 'To schedule an appointment, click the "Book Appointment" button on the menu bar. Select a service, choose an available date/time slot, and provide your contact details.';
    }
    if (qLower.includes('time') || qLower.includes('hour') || qLower.includes('schedule')) {
      return 'Dr. Saad Obhaya is available for consultations daily: Morning Shift from 8:00 AM to 2:00 PM and Evening Shift from 7:00 PM to 10:00 PM (Pakistan Standard Time). You can book any convenient time slot during these hours.';
    }
    if (qLower.includes('location') || qLower.includes('ganga ram') || qLower.includes('where')) {
      return 'Dr. Muhammad Saad Obhaya (MBBS) is currently serving as a Medical Doctor at Sir Ganga Ram Hospital in Lahore, Pakistan.';
    }
    if (qLower.includes('symptom') || qLower.includes('diagnosis') || qLower.includes('check')) {
      return 'You can use our online Symptom Assessment & Triage tool to evaluate your symptom urgency before your consultation. Please note that it provides educational guidance, not a medical diagnosis.';
    }

    return 'Thank you for your question. For detailed clinical queries, administrative help, or appointment scheduling, please consult our booking page or contact our team directly at +92 339 6999200.';
  };

  return (
    <div 
      className="saadcare-chatbot-container fixed bottom-6 right-6 z-50 no-print"
      style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', left: 'auto', top: 'auto', zIndex: 50 }}
    >
      {/* Compact Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-medical-600 to-teal-600 text-white font-semibold text-xs px-3 py-2 sm:px-3.5 sm:py-2 rounded-full shadow-md shadow-medical-600/25 hover:shadow-lg hover:shadow-medical-600/35 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Open SaadCare Assistant"
        >
          <div className="relative">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
          </div>
          <span className="tracking-tight font-medium">SaadCare Assistant</span>
        </button>
      )}

      {/* Chat Drawer Window (Decreased compact size: 340px width x 470px height) */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[340px] max-w-[340px] h-[470px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-teal-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  SaadCare Assistant <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                </h3>
                <p className="text-[11px] text-medical-100 font-medium">Patient Guidance & FAQs</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Close Chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-medical-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-medical-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                <Bot className="w-4 h-4 text-medical-600 animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSend('How do I book an appointment?')}
              className="text-[11px] bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              How to book?
            </button>
            <button
              onClick={() => handleSend('What are the doctor timings?')}
              className="text-[11px] bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Doctor timings
            </button>
            <button
              onClick={() => handleSend('Where is Dr. Saad practicing?')}
              className="text-[11px] bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              Location
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-100 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-medical-600 hover:bg-medical-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Safety Disclaimer Footer */}
          <div className="bg-slate-100 px-3 py-1.5 text-[10px] text-slate-500 text-center border-t border-slate-200 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Administrative assistant only. Does not replace professional medical evaluation.</span>
          </div>

        </div>
      )}
    </div>
  );
};
