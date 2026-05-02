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

  const glassPanelStyle = "bg-cyber-glass backdrop-blur-md border border-cyber-border shadow-[0_0_20px_rgba(0,0,0,0.8)]";

  const chatT = (t.chat || {}) as Record<string, string>;
  const chatTitle = chatT.title || 'AI 向导已就位';
  const chatWelcome = chatT.welcome || '欢迎来到平台。我是您的专属 AI 向导，有什么可以帮您？';
  const chatPlaceholder = chatT.placeholder || '输入指令...';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end font-sans pointer-events-none">
      {/* 聊天面板 */}
      <div 
        className={`
          mb-3  h-[225px] sm:h-[380px] w-[calc(100vw-2rem)] sm:w-80 md:w-88 flex flex-col rounded-xl
          origin-bottom-right transition-all duration-300 ease-shine
          ${glassPanelStyle}
          ${isOpen 
            ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' 
            : 'scale-95 opacity-0 pointer-events-none translate-y-8'}
        `}
      >
        <div className="p-3 border-b border-cyber-border flex justify-between items-center bg-white/5 rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-aqua animate-pulse" />
            <span className="font-bold tracking-wider text-content-primary text-xs bg-clip-text bg-gradient-to-r from-base-white via-cyan-100 to-primary-aqua drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
              {chatTitle}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-content-secondary hover:text-primary-aqua transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
          
          {/* 1. 固定的欢迎语 UI (直接消费多语言变量，脱离 State) */}
          <div className="flex justify-start">
            <div className="max-w-[85%] p-2.5 text-xs leading-relaxed tracking-wide bg-cyber-surface/50 border border-white/5 text-content-primary rounded-xl rounded-tl-sm">
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
                  : 'bg-cyber-surface/50 border border-white/5 text-content-primary rounded-xl rounded-tl-sm'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 sm:p-2 border-t border-cyber-border bg-cyber-base/90 rounded-b-xl flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={chatPlaceholder} 
            className="flex-1 text-xs bg-black/40 border border-cyber-border focus:border-cyan-500/50 hover:border-white/20 rounded-full px-3 py-2 sm:py-1.5 text-content-primary outline-none transition-all placeholder:text-content-secondary/50"
          />
          
          <button 
             onClick={handleSend}
             className="shrink-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-primary-aqua hover:bg-white/10 transition-colors duration-300 active:scale-95 group/send"
          >
             <Send className="w-4 h-4 transition-transform duration-300 group-hover/send:scale-110" />
          </button>
        </div>
      </div>

      {/* 触发按钮 */}
      <div className="relative group pointer-events-auto">
        <div className={`cyber-glow-backdrop`}></div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative z-10 w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
            bg-cyber-base border border-cyber-border
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