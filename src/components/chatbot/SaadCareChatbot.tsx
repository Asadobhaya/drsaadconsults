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
      className="saadcare-chatbot-container fixed z-50 no-print"
    >
      {/* Compact Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white font-medium text-xs px-3 py-1.5 rounded-full shadow-soft active:scale-95 transition-all duration-200"
          aria-label="Open SaadCare Assistant"
        >
          <div className="relative">
            <Bot className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-tint rounded-full ring-1 ring-white" />
          </div>
          <span className="tracking-tight text-xs">SaadCare Assistant</span>
        </button>
      )}

      {/* Chat Drawer Window (Decreased compact size: 340px width x 470px height) */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[340px] max-w-[340px] h-[470px] max-h-[75vh] bg-surface rounded-2xl shadow-card border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-brand text-white p-3.5 flex items-center justify-between shadow-soft">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-tight flex items-center gap-1.5">
                  SaadCare Assistant <Sparkles className="w-3 h-3 text-tint" />
                </h3>
                <p className="text-[10px] text-tint/90 font-medium">Patient Guidance &amp; FAQs</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Close Chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-bg">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-md bg-tint text-brand flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-soft ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-br-none'
                      : 'bg-surface text-text border border-border rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-tint' : 'text-muted'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-text text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-muted bg-surface p-2 rounded-lg border border-border w-fit shadow-soft">
                <Bot className="w-3.5 h-3.5 text-brand animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-3 py-2 bg-surface border-t border-border flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSend('How do I book an appointment?')}
              className="text-[10px] bg-tint hover:bg-border text-brand px-2.5 py-1 rounded-full border border-border transition"
            >
              How to book?
            </button>
            <button
              onClick={() => handleSend('What are the doctor timings?')}
              className="text-[10px] bg-tint hover:bg-border text-brand px-2.5 py-1 rounded-full border border-border transition"
            >
              Doctor timings
            </button>
            <button
              onClick={() => handleSend('Where is Dr. Saad practicing?')}
              className="text-[10px] bg-tint hover:bg-border text-brand px-2.5 py-1 rounded-full border border-border transition"
            >
              Location
            </button>
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-surface border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-bg text-text text-xs px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-brand"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-brand hover:bg-brand-hover disabled:opacity-40 text-white p-2 rounded-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Safety Disclaimer Footer */}
          <div className="bg-tint/70 px-3 py-1.5 text-[10px] text-muted text-center border-t border-border flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3 text-brand shrink-0" />
            <span>Administrative guidance only. Does not replace in-person medical evaluation.</span>
          </div>

        </div>
      )}
    </div>
  );
};
