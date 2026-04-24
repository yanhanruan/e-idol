import { useMemo, useState } from "react";
import { Filter, Star, MessageCircle, Sparkles } from "lucide-react";
import HomepageSecTitle from "@src/components/HomepageSecTitle";
import { useTranslations } from "@src/contexts/LanguageContext";
import CyberSelect from "@src/components/ui/CyberSelect";
import type { FeaturedUser, TranslationMap } from "@src/types";

interface FeaturedUserCardProps {
    user: FeaturedUser;
    t: TranslationMap;
}

const FeaturedUserCard = ({ user, t }: FeaturedUserCardProps) => (
    <div className="rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 group" style={{
        background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.6), rgba(20, 10, 40, 0.6))',
        position: 'relative',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 255, 0.2) inset',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 255, 0.2)'
    }}>
        <div className={`h-32 bg-gradient-to-br ${user.bgColor} flex items-center justify-center text-4xl relative`}>
            {user.image}
            {user.online && (
                <div className="h-5 absolute top-2 right-2 z-20 inline-flex items-center space-x-1 bg-green-500 text-white text-2xs px-2 py-0.5 rounded-full font-bold border border-white/30 shadow-lg backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    <span className="leading-none">{t.online as string}</span>
                </div>
            )}

            <div className="h-5 absolute top-2 left-2 z-20 inline-flex items-center space-x-1 text-white text-2xs px-2 py-0.5 font-bold shadow-lg backdrop-blur-md">
                <span>⏱️</span>
                <span className="leading-none pt-0.5">{user.duration}分</span>
            </div>
        </div>

        <div className="p-3 bg-gradient-to-b ">
            <h4 className="font-bold text-base mb-0.5 truncate" style={{
                fontFamily: "'Orbitron', sans-serif",
                background: 'linear-gradient(135deg, #00ffff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
            }}>{user.name}</h4>

            <p className="text-2xs text-slate-500 mb-2 font-medium truncate">{user.username}</p>

            <div className="flex items-center space-x-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-slate-600 ml-1 font-bold">{user.rating}</span>
                <span className="text-2xs text-slate-400">({user.reviews})</span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/10 to-purple-50/10 p-2 rounded-lg">
                <div className="flex items-baseline">
                    <span className="text-green-400/100 font-black text-lg">{user.price}</span>
                    <span className="text-2xs text-slate-500 ml-1 font-bold">{t.coins as string}</span>
                </div>
                <MessageCircle className="w-4 h-4 text-indigo-500" />
            </div>
        </div>
    </div>
);

interface FeaturedUsersSectionProps {
    featuredUsers: FeaturedUser[];
}

const FeaturedUsersSection = ({ featuredUsers }: FeaturedUsersSectionProps) => {
    const { t } = useTranslations();

    const [sortBy, setSortBy] = useState('weeklyPopular');

    const sortOptions = useMemo(() => [
        { value: 'weeklyPopular', label: t.weeklyPopular as string },
        { value: 'newRecommend', label: t.newRecommend as string },
        { value: 'mostOrders', label: t.mostOrders as string }
    ], [t]);

    const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label;

    const sortedData = useMemo(() => {
        const data = [...featuredUsers];
        return data;
    }, [featuredUsers, sortBy]);

    void sortedData;

    return (
        <div>
            <HomepageSecTitle
                icon={Sparkles}
                title={t.featuredUsers as string}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-3 sm:px-0">
                {featuredUsers.map((user, idx) => (
                    <FeaturedUserCard key={idx} user={user} t={t} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedUsersSection;
