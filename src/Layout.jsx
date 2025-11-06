// --- Header.jsx ---
import { Bell } from "lucide-react";

const Header = ({ lang, setLang, t }) => {
  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Icons */}
          <div className="flex items-center space-x-3">
            <button className="w-11 h-11 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl">
              👤
            </button>
            <button className="w-11 h-11 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl">
              ➕
            </button>
            <button className="w-11 h-11 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-bold relative group">
              {t.home}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all rounded-full"></span>
            </a>
            <a href="#" className="text-slate-700 font-bold relative">
              {t.search}
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
            </a>
            <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-bold relative group">
              {t.message}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all rounded-full"></span>
            </a>
          </nav>

          {/* Language & Auth */}
          <div className="flex items-center space-x-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-sm border-2 border-indigo-300 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/90 font-medium shadow-md hover:shadow-lg transition"
            >
              <option value="ja">🇯🇵 日本語</option>
              <option value="en">🇬🇧 English</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
            <button className="hidden sm:block px-6 py-2.5 text-slate-700 border-3 border-slate-700 rounded-full hover:bg-slate-100 transition font-bold shadow-md hover:shadow-lg">
              {t.login}
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition font-bold shadow-lg hover:shadow-xl">
              <Sparkles className="w-4 h-4 inline mr-1" />
              {t.register}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Footer.jsx ---
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 text-white mt-16 py-12 border-t-4 border-indigo-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 left-10 text-4xl">✨</div>
        <div className="absolute top-10 right-20 text-4xl">🌟</div>
        <div className="absolute bottom-5 left-1/4 text-4xl">💫</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-4 flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <span className="text-2xl font-black">Game Room</span>
        </div>
        <p className="text-sm text-slate-300 font-medium">© 2024 Game Room. All rights reserved. Made with 💖</p>
      </div>
    </footer>
  );
};

export const Layout = ({ lang, setLang, t, children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10">
        {/* 装饰性元素 */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* 飘落的装饰 */}
        <div className="absolute top-10 left-1/4 text-4xl opacity-20 animate-bounce">✨</div>
        <div className="absolute top-32 right-1/4 text-3xl opacity-20 animate-bounce delay-300">🦋</div>
        <div className="absolute bottom-40 left-1/3 text-3xl opacity-20 animate-bounce delay-700">⭐</div>
        <div className="absolute top-1/2 right-20 text-4xl opacity-20 animate-bounce delay-1000">💫</div>
      </div>

      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
};