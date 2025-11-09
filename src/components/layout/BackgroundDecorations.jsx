const BackgroundDecorations = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-blue-500/10 blur-3xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 3px)', backgroundSize: '100% 4px' }}></div>
        <div className="absolute top-10 left-1/4 text-2xl opacity-30 text-cyan-400">▲</div>
        <div className="absolute top-32 right-1/4 text-2xl opacity-30 text-pink-400">◆</div>
        <div className="absolute bottom-40 left-1/3 text-2xl opacity-30 text-purple-400">●</div>
        <div className="absolute top-1/2 right-20 text-2xl opacity-30 text-cyan-400">■</div>
    </div>
);

export default BackgroundDecorations