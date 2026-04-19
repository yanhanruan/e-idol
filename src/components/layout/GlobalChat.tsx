import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';

// 消息体回归纯粹，不需要奇奇怪怪的 isWelcome flag 了
interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  text: string;
}

const GlobalChat = () => {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  
  // 初始状态为空数组，这里只存用户和AI的【动态】交互历史
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), role: 'user', text: input }]);
    setInput('');
  };

  const glassPanelStyle = "bg-[#050510]/80 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]";

  const chatT = (t.chat || {}) as Record<string, string>;
  const chatTitle = chatT.title || 'AI 向导已就位';
  const chatWelcome = chatT.welcome || '欢迎来到平台。我是您的专属 AI 向导，有什么可以帮您？';
  const chatPlaceholder = chatT.placeholder || '输入指令...';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* 聊天面板 */}
      <div 
        className={`
          mb-3 w-72 sm:w-80 md:w-88 flex flex-col rounded-xl
          origin-bottom-right transition-all duration-300 ease-shine
          ${glassPanelStyle}
          ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[380px]' : 'scale-95 opacity-0 pointer-events-none translate-y-8 h-[380px]'}
        `}
      >
        <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-aqua animate-pulse" />
            <span className="font-bold tracking-wider text-transparent text-xs bg-clip-text bg-gradient-to-r from-base-white via-cyan-100 to-primary-aqua drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
              {chatTitle}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-accent-slate200 hover:text-primary-aqua transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
          
          {/* 1. 固定的欢迎语 UI (直接消费多语言变量，脱离 State) */}
          <div className="flex justify-start">
            <div className="max-w-[85%] p-2.5 text-xs leading-relaxed tracking-wide bg-[#0a0a20]/50 border border-white/5 text-accent-slate100 rounded-xl rounded-tl-sm">
              {chatWelcome}
            </div>
          </div>

          {/* 2. 动态的聊天记录 (只负责渲染后来新增的对话) */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] p-2.5 text-xs leading-relaxed tracking-wide
                ${msg.role === 'user' 
                  ? 'bg-cyan-900/30 border border-cyan-500/30 text-primary-aqua rounded-xl rounded-tr-sm shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                  : 'bg-[#0a0a20]/50 border border-white/5 text-accent-slate100 rounded-xl rounded-tl-sm'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-white/10 bg-[#050510]/90 rounded-b-xl flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={chatPlaceholder} 
            className="flex-1 text-xs bg-black/40 border border-white/10 focus:border-cyan-500/50 hover:border-white/20 rounded-full px-3 py-1.5 text-accent-slate100 outline-none transition-all placeholder:text-accent-slate200/50"
          />
          
          <button 
             onClick={handleSend}
             className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-primary-aqua hover:bg-white/10 hover:scale-110 transition-all duration-200 active:scale-95"
          >
             <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 触发按钮 */}
      <div className="relative group">
        <div className={`
          absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 
          rounded-full blur-[2px] transition duration-300
          ${isOpen ? 'opacity-100 blur-[4px]' : 'opacity-70 group-hover:opacity-100 group-hover:blur-[4px]'}
        `}></div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative z-10 w-8 h-8 rounded-full flex items-center justify-center
            bg-[#050510] border border-white/10 hover:bg-[#0a0a20]
            text-primary-aqua overflow-hidden
            transition-all duration-300 active:scale-95
          `}
        >
          {isOpen ? <X className="w-4 h-4 relative z-10" /> : <MessageSquare className="w-4 h-4 relative z-10" />}
          <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-16 transition-transform duration-700 ease-in-out z-0"></div>
        </button>
      </div>
    </div>
  );
};

export default GlobalChat;