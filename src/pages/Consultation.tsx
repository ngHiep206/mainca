import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Calendar, Phone, Mail, ArrowRight, ShieldCheck, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Consultation() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'consultations'), {
        ...form,
        userId: auth.currentUser?.uid || 'anonymous',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'consultations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-8">
              <MessageSquare size={16} />
              <span>Dành cho trường hợp đặc biệt</span>
           </div>
           <h1 className="text-5xl font-display font-bold mb-8 leading-tight">
              Tư vấn 1:1 cùng <span className="text-brand-600">Chuyên gia</span> Giáo dục sớm
           </h1>
           <p className="text-slate-600 text-lg mb-12 leading-relaxed">
             Khi các gợi ý tự động chưa giải quyết được hết nỗi lo của bạn, hãy kết nối trực tiếp với đội ngũ chuyên gia tâm lý và giáo dục của PlayWise để nhận được lộ trình chi tiết.
           </p>

           <div className="space-y-6 mb-12">
              <FeatureItem title="Lộ trình cá nhân hóa" description="Được thiết kế riêng dựa trên hồ sơ phát triển thực tế của bé." />
              <FeatureItem title="Giải đáp mọi thắc mắc" description="Từ việc chọn đồ chơi đến cách xử lý các tình huống chậm nói, chậm vận động." />
              <FeatureItem title="Chi phí tiết kiệm" description="Chỉ từ 49.000đ/buổi tư vấn chuyên sâu." />
           </div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="p-8 rounded-[2.5rem] bg-brand-50 border-2 border-brand-200 mb-12 group cursor-pointer hover:bg-brand-100 transition-all shadow-lg hover:shadow-xl" 
             onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
           >
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
                    <Sparkles size={32} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Thử ngay PlayWise AI
                      <span className="text-[10px] bg-brand-200 text-brand-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Mới</span>
                    </h4>
                    <p className="text-slate-600">Trò chuyện miễn phí cùng trợ lý AI thông minh ngay bây giờ.</p>
                 </div>
              </div>
           </motion.div>

           <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                 <Phone size={32} className="text-brand-400" />
              </div>
              <div className="relative z-10">
                 <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1">Hotline hỗ trợ</p>
                 <p className="text-2xl font-bold">1900 8888 24/7</p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ShieldCheck size={120} />
              </div>
           </div>
        </div>

        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] p-10 md:p-16 relative z-10"
          >
            {submitted ? (
              <div className="text-center py-12">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-bold mb-4 text-slate-900">Gửi yêu cầu thành công</h3>
                 <p className="text-slate-500 mb-8 leading-relaxed">Cảm ơn ba mẹ đã tin tưởng. Chuyên gia của PlayWise sẽ kết nối lại trong vòng 24 giờ tới qua số điện thoại cung cấp.</p>
                 <button onClick={() => setSubmitted(false)} className="btn-secondary w-full">Gửi yêu cầu mới</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-3 text-slate-700">Tên ba mẹ</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-3 text-slate-700">Số điện thoại</label>
                    <input 
                      type="tel" 
                      required 
                      className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                      placeholder="0912..."
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-slate-700">Email nhận tư vấn</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    placeholder="parent@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-slate-700">Vấn đề bạn đang quan tâm</label>
                  <textarea 
                    required 
                    className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    rows={4}
                    placeholder="Mô tả tình trạng của bé..."
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-5 group">
                   {loading ? 'Đang gửi...' : 'Đăng ký nhận tư vấn ngay'}
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Lần đầu tham gia được miễn phí 100%</p>
              </form>
            )}
          </motion.div>
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-strong/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4">
       <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} />
       </div>
       <div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-500">{description}</p>
       </div>
    </div>
  );
}
