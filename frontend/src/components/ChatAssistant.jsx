import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI tutor 🎓 Ask me anything about your learning topics!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/chat/ask', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I had trouble answering that. Please try again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#F08A4B] text-white rounded-full shadow-lg hover:bg-[#DE7C40] transition flex items-center justify-center text-2xl z-50"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-[#1B1B1B] rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-[#232323] px-5 py-4 flex items-center gap-3 border-b border-white/10">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#F08A4B] font-bold text-sm">
              AI
            </div>
            <div>
              <p className="text-white font-semibold text-sm">LearnPath Tutor</p>
              <p className="text-[#B9B1A7] text-xs">Ask me anything!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#7C8CFF] text-white rounded-tr-sm'
                    : 'bg-white/10 text-[#F2EDE6] rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#8A857C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#8A857C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#8A857C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 px-4 py-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your tutor..."
              className="flex-1 bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F2EDE6] placeholder:text-[#8A857C] focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-[#F08A4B] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#DE7C40] transition disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}