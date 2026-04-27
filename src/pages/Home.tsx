import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Map, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  Brain,
  Zap,
  Target,
  MessageCircle,
  Gift
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-brand-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:flex items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>Cá nhân hóa theo từng tháng tuổi</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-8">
              Chọn đồ chơi <span className="text-brand-600 italic">đúng</span> - Con lớn khôn <span className="text-accent-strong underline decoration-brand-200">vượt trội</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              PlayWise sử dụng khoa học phát triển để giúp cha mẹ tìm ra những món đồ chơi hoàn hảo, kích thích tư duy và hỗ trợ các cột mốc quan trọng nhất của bé.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/quiz')}
                className="btn-primary group w-full sm:w-auto"
              >
                Làm trắc nghiệm trẻ ngay
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/toys')}
                className="btn-secondary w-full sm:w-auto"
              >
                Khám phá bộ lọc thông minh
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 mt-16 lg:mt-0 relative"
          >
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=2000" 
                alt="Child playing with educational toys"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent" />
            </div>
            
            {/* Floating Info Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -left-6 glass-card p-4 rounded-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Brain size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Kỹ năng Logic</p>
                <p className="font-bold">+24% Phát triển</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Vận động tinh</p>
                <p className="font-bold">Đạt cột mốc 14th</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 underline-offset-4">
            <h2 className="text-3xl lg:text-4xl mb-4">Giải pháp toàn diện cho cha mẹ hiện đại</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Chúng tôi giải quyết nỗi lo về đồ chơi kém chất lượng và thiếu định hướng khoa học.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-yellow-500" />}
              title="Smart Filter Engine"
              description="Lọc đồ chơi theo mục tiêu phát triển: Vận động thô, tinh, ngôn ngữ, hay logic thay vì chỉ theo giá."
              onClick={() => navigate('/toys')}
            />
            <FeatureCard 
              icon={<Map className="text-brand-500" />}
              title="Milestone Journal"
              description="Theo dõi hành trình của bé. Hệ thống tự động điều chỉnh gợi ý khi bé đạt cột mốc mới."
              onClick={() => navigate('/dashboard')}
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" />}
              title="Safety Scanner"
              description="Thư viện kiểm định chất liệu, chứng chỉ CR/CE và khuyên dùng bởi các chuyên gia giáo dục."
              onClick={() => navigate('/safety')}
            />
            <FeatureCard 
              icon={<Brain className="text-indigo-500" />}
              title="Giải thích Khoa học"
              description="Biết rõ tại sao món đồ này tốt cho não bộ và cách chơi cùng con để đạt hiệu quả cao nhất."
              onClick={() => navigate('/toys')}
            />
            <FeatureCard 
              icon={<Gift className="text-accent-strong" />}
              title="Gift Registry"
              description="Gợi ý quà tặng đúng nhu cầu phát triển của bé thông qua mã hồ sơ bảo mật."
              onClick={() => navigate('/toys')}
            />
            <FeatureCard 
              icon={<MessageCircle className="text-blue-500" />}
              title="Tư vấn 1:1"
              description="Đặt lịch trao đổi trực tiếp với các chuyên gia tâm lý và giáo dục mầm non."
              onClick={() => navigate('/consultation')}
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-brand-50 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-brand-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl lg:text-5xl mb-6 font-display font-bold">Tham gia cùng 10,000+ phụ huynh thông thái</h2>
                <p className="text-brand-100 text-lg mb-8 max-w-xl">Bắt đầu hành trình giáo dục sớm cho con từ những điều nhỏ bé nhất ngay hôm nay.</p>
                <div className="flex gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-600 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Đánh giá 4.9/5</p>
                    <p className="text-xs text-brand-100 uppercase tracking-wider">Từ cộng đồng cha mẹ</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/consultation')}
                className="bg-white text-brand-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-50 transition-colors shadow-xl"
              >
                Nhận tư vấn miễn phí
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-[32px] border border-orange-100 bg-white hover:shadow-xl hover:border-brand-400 transition-all group flex flex-col items-start text-left ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
      {onClick && (
         <div className="mt-6 flex items-center gap-2 text-brand-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Khám phá ngay <ArrowRight size={16} />
         </div>
      )}
    </div>
  );
}
