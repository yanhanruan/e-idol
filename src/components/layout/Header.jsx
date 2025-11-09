import { Bell } from "lucide-react";
import { useTranslations } from '../../contexts/LanguageContext';

const Header = () => {
    const { lang, setLang, t } = useTranslations();
    return (
        <header className="sticky top-0 z-50" style={{
            background: 'rgba(10, 13, 30, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 255, 0.1) inset'
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
                            background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))',
                            border: '1px solid rgba(0, 255, 255, 0.4)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <span className="group-hover:scale-110 transition-transform">👤</span>
                        </button>
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
                            background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))',
                            border: '1px solid rgba(255, 0, 255, 0.4)',
                            boxShadow: '0 0 20px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <span className="group-hover:scale-110 transition-transform">➕</span>
                        </button>
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 relative group" style={{
                            background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))',
                            border: '1px solid rgba(255, 0, 100, 0.4)',
                            boxShadow: '0 0 20px rgba(255, 0, 100, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{
                                background: 'linear-gradient(135deg, #ff0055, #ff3388)',
                                boxShadow: '0 0 15px rgba(255, 0, 85, 0.8), 0 0 5px rgba(255, 0, 85, 1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}>3</span>
                        </button>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {['home', 'search', 'message'].map((item) => (
                            <a key={item} href="#" className="transition-all font-bold relative group py-1" style={{
                                fontFamily: "'Roboto Mono', monospace",
                                color: '#00ffff',
                                textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                fontSize: '14px',
                                letterSpacing: '0.05em'
                            }}>
                                {t[item]}
                                <span className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{
                                    width: item === 'search' ? '100%' : '0',
                                    background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                }}></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="text-sm rounded-xl px-3 py-2 focus:outline-none font-medium transition-all cursor-pointer" style={{
                                fontFamily: "'Roboto Mono', monospace",
                                background: 'rgba(0, 50, 100, 0.3)',
                                border: '1px solid rgba(0, 255, 255, 0.3)',
                                color: '#00ffff',
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <option value="ja">🇯🇵 日本語</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="zh">🇨🇳 中文</option>
                        </select>

                        <button className=" text-base opacity-90 px-1 py-2 text-white rounded-full transition-all font-bold hover:scale-105" style={{
                            fontFamily: "'Roboto Mono', monospace",
                            background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
                            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                        }}>
                            {/* <Sparkles className="w-4 h-4 inline mr-1" /> */}
                            {t.register}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;