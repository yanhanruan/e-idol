import { useMemo,useState } from "react";
import { Filter, Star, MessageCircle, Sparkles } from "lucide-react";
import HomepageSecTitle from "@src/components/HomepageSecTitle";
import { useTranslations } from "@src/contexts/LanguageContext";
import CyberSelect from "@src/components/ui/CyberSelect";

const FeaturedUserCard = ({ user, t }) => (
    <div className="rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 group" style={{
        background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.6), rgba(20, 10, 40, 0.6))',
        position: 'relative',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 255, 0.2) inset',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 255, 0.2)'
    }}>
        {/* 1. 高度减小 h-48 -> h-32, 图标变小 text-6xl -> text-4xl */}
        <div className={`h-32 bg-gradient-to-br ${user.bgColor} flex items-center justify-center text-4xl relative`}>
            {user.image}
            {user.online && (
                <div className="h-5 absolute top-2 right-2 z-20 inline-flex items-center space-x-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold border border-white/30 shadow-lg backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    <span className="leading-none">{t.online}</span>
                </div>
            )}

            <div className="h-5 absolute top-2 left-2 z-20 inline-flex items-center space-x-1 text-white text-[10px] px-2 py-0.5 font-bold shadow-lg backdrop-blur-md">
                <span >⏱️</span>
                <span className="leading-none pt-0.5">{user.duration}分</span>
            </div>
        </div>

        {/* 2. 内容区域 Padding 减小 p-5 -> p-3 */}
        <div className="p-3 bg-gradient-to-b ">
            {/* 名字大小 text-xl -> text-base */}
            <h4 className="font-bold text-base mb-0.5 truncate" style={{
                fontFamily: "'Orbitron', sans-serif",
                background: 'linear-gradient(135deg, #00ffff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
            }}>{user.name}</h4>

            <p className="text-[10px] text-slate-500 mb-2 font-medium truncate">{user.username}</p>

            {/* 星星大小 w-4 -> w-3 */}
            <div className="flex items-center space-x-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-slate-600 ml-1 font-bold">{user.rating}</span>
                <span className="text-[10px] text-slate-400">({user.reviews})</span>
            </div>

            {/* 底部价格条更加紧凑 */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/10 to-purple-50/10 p-2 rounded-lg">
                <div className="flex items-baseline">
                    {/* 价格字体 text-2xl -> text-lg */}
                    <span className="text-green-400/100 font-black text-lg">{user.price}</span>
                    <span className="text-[10px] text-slate-500 ml-1 font-bold">{t.coins}</span>
                </div>
                <MessageCircle className="w-4 h-4 text-indigo-500" />
            </div>
        </div>
    </div>
);

const FeaturedUsersSection = ({ featuredUsers }) => {
    // 1. 在这里调用 hook 获取翻译，不再依赖 props 传入
    const { t } = useTranslations();
    
    // 2. 状态管理：排序
    const [sortBy, setSortBy] = useState('weeklyPopular');

    // 3. 构建 CyberSelect 所需的选项
    const sortOptions = useMemo(() => [
        { value: 'weeklyPopular', label: t.weeklyPopular },
        { value: 'newRecommend', label: t.newRecommend },
        { value: 'mostOrders', label: t.mostOrders }
    ], [t]);

    // 4. 计算当前选中的 Label 显示在框内
    const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

    // 5. 排序逻辑 (这里只是个示例，你可以根据实际需求修改排序算法)
    const sortedData = useMemo(() => {
        // 创建副本以避免修改原始 props
        const data = [...featuredUsers]; 
        // 可以在这里添加 switch case 对 data 进行 sort
        return data; 
    }, [featuredUsers, sortBy]);

    return (
        <div>
            <HomepageSecTitle
                icon={Sparkles} 
                title={t.featuredUsers}
                titleGradient={true}
                action={
                    <CyberSelect
                        value={sortBy}
                        label={currentLabel}
                        options={sortOptions}
                        onChange={setSortBy}
                        icon={<Filter />}
                    />
                }
            />

            {/* Grid 调整：
           - 移动端 grid-cols-2 (原本是1) 
           - 平板 sm:grid-cols-3
           - 桌面 lg:grid-cols-5 (原本是4)
           这样可以让缩小的卡片排列更密集，不留太多空白
        */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-3 sm:px-0">
                {featuredUsers.map((user, idx) => (
                    <FeaturedUserCard key={idx} user={user} t={t} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedUsersSection;



// TODO low priority:title style
// return (
//     <section className="mb-12">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         {/* 标题部分 */}
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
//             <span className="w-2 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
//             {t.featuredUsers}
//           </h2>
//           <p className="text-slate-400 text-sm ml-4">
//             Check out our top rated players this week
//           </p>
//         </div>

//         {/* 替换为 CyberSelect */}
//         <div className="self-end md:self-auto">
//           <CyberSelect
//             value={sortBy}
//             label={currentLabel}
//             options={sortOptions}
//             onChange={setSortBy}
//             icon={<Filter />}
//           />
//         </div>
//       </div>

//       {/* 渲染列表 */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {sortedData.map((user) => (
//           // 这里是你渲染 UserCard 的逻辑
//           <div key={user.id} className="text-white bg-slate-800/50 p-4 rounded-xl border border-white/5">
//              {/* 此处省略具体 Card 实现，只展示数据流 */}
//              {user.name}
//           </div>
//         ))}
//       </div>
//     </section>
//   );