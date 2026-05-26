import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ── Inline renderer for **bold** ──────────────────────────
function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#F2EDE6', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Markdown renderer ─────────────────────────────────────
function MessageContent({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let codeBuffer = [];
  let inCode = false;

  while (i < lines.length) {
    const line = lines[i];

    // Code block start/end
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeBuffer = [];
      } else {
        inCode = false;
        elements.push(
          <pre key={i} style={{
            background: 'rgba(0,0,0,0.45)',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '11.5px',
            overflowX: 'auto',
            margin: '8px 0',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            color: '#A8FF78',
            lineHeight: 1.6,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
      }
      i++;
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      i++;
      continue;
    }

    // ## H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#F08A4B',
          margin: '4px 0 8px 0',
          letterSpacing: '0.01em',
        }}>
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // ### H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#7C8CFF',
          margin: '10px 0 4px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // --- divider
    if (line.trim() === '---') {
      elements.push(
        <hr key={i} style={{
          border: 'none',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          margin: '10px 0',
        }} />
      );
      i++;
      continue;
    }

    // *italic* (whole line)
    if (line.startsWith('*') && line.endsWith('*') && line.length > 2 && !line.startsWith('**')) {
      elements.push(
        <p key={i} style={{
          color: '#8A857C',
          fontStyle: 'italic',
          fontSize: '12px',
          margin: '0 0 6px 0',
          lineHeight: 1.5,
        }}>
          {line.slice(1, -1)}
        </p>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '5px' }} />);
      i++;
      continue;
    }

    // Regular text with inline bold
    elements.push(
      <p key={i} style={{
        margin: '2px 0',
        lineHeight: 1.6,
        fontSize: '13px',
        color: '#E8E3DC',
      }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

const SUGGESTED_PROMPTS = [
  "Explain today's topic simply",
  "Give me a quick quiz question",
  "I'm stuck, can you help?",
  "How does this relate to my goal?",
];

export default function ChatAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your LearnPath tutor 🎯\n\nI know your goal, today's topics, and your progress. Ask me anything — I'll give you focused, specific help.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    if (!user) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please sign in to use the tutor.'
      }]);
      return;
    }

    setInput('');
    setShowSuggestions(false);

    const userMsg = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages.slice(-7, -1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post('/chat/ask', {
        message: userText,
        history,
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply
      }]);

    } catch (err) {
      console.error('Chat error:', err.response?.data || err.message);
      const detail = err?.response?.data?.detail;
      const status = err?.response?.status;

      let errorContent;
      if (detail) {
        errorContent = `Error: ${detail}`;
      } else if (status) {
        errorContent = `Server error (${status}) — please try again.`;
      } else {
        errorContent = `Cannot reach the server. Make sure the backend is running on ${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorContent }]);
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

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm your LearnPath tutor 🎯\n\nI know your goal, today's topics, and your progress. Ask me anything — I'll give you focused, specific help.",
    }]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
          hover:scale-105 transition-all duration-200 flex items-center justify-center text-xl"
        style={{
          background: open ? '#232323' : '#F08A4B',
          border: open ? '1px solid rgba(255,255,255,0.15)' : 'none'
        }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : '🤖'}
      </button>

      {/* Unread dot */}
      {!open && (
        <span className="fixed bottom-[72px] right-6 z-50 w-3 h-3
          bg-green-400 rounded-full border-2 border-[#111]" />
      )}

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: '360px',
            height: '520px',
            background: '#1B1B1B',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ background: '#232323', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: 'rgba(240,138,75,0.2)',
                  border: '1px solid rgba(240,138,75,0.3)'
                }}
              >
                🎯
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F2EDE6' }}>
                  LearnPath Tutor
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <p className="text-xs" style={{ color: '#8A857C' }}>
                    Knows your goal & progress
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition"
              style={{ color: '#8A857C' }}
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="text-sm leading-relaxed"
                  style={{
                    maxWidth: '88%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? '#7C8CFF'
                      : 'rgba(255,255,255,0.07)',
                    color: msg.role === 'user' ? '#fff' : '#E8E3DC',
                    border: msg.role === 'user'
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.08)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.role === 'user'
                    ? msg.content
                    : <MessageContent text={msg.content} />
                  }
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(j => (
                      <div key={j}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          background: '#8A857C',
                          animationDelay: `${j * 150}ms`,
                          animationDuration: '0.8s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Prompts */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs mb-2" style={{ color: '#8A857C' }}>Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, j) => (
                  <button
                    key={j}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full transition hover:opacity-80"
                    style={{
                      background: 'rgba(240,138,75,0.12)',
                      border: '1px solid rgba(240,138,75,0.25)',
                      color: '#F08A4B',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div
            className="px-4 py-3 flex gap-2 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
              }}
              onKeyDown={handleKey}
              placeholder="Ask about today's topic..."
              className="flex-1 text-sm resize-none focus:outline-none rounded-xl px-3 py-2.5"
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F2EDE6',
                minHeight: '40px',
                maxHeight: '96px',
                lineHeight: 1.5,
                caretColor: '#F08A4B',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(124,140,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="rounded-xl px-4 text-sm font-semibold transition-all
                flex items-center justify-center flex-shrink-0"
              style={{
                background: input.trim() && !loading ? '#F08A4B' : 'rgba(255,255,255,0.06)',
                color: input.trim() && !loading ? '#fff' : '#8A857C',
                minWidth: '60px',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}