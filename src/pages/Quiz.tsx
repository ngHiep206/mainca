import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Baby, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Brain, 
  Zap, 
  Heart,
  CheckCircle2,
  AlertCircle,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { askPlayWiseAI } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const STEPS = [
  {
    id: 'intro',
    title: 'Bắt đầu hành trình',
    description: 'Hãy cho chúng tôi biết một chút về thiên thần nhỏ của bạn.'
  },
  {
    id: 'info',
    title: 'Thông tin cơ bản',
    description: 'Tuổi chính xác giúp chúng tôi gợi ý đồ chơi phù hợp nhất.'
  },
  {
    id: 'skills',
    title: 'Biểu hiện hiện tại',
    description: 'Bé đã làm được những gì trong các mảng sau?'
  },
  {
    id: 'result',
    title: 'Phân tích AI',
    description: 'Dựa trên khoa học phát triển và dữ liệu bạn cung cấp.'
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    months: 12,
    gender: 'male',
    skills: {
      motor: 'normal',
      language: 'normal',
      logic: 'normal'
    },
    concerns: ''
  });
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const navigate = useNavigate();
  const { user, isMock } = useAuth();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === STEPS.length - 1) {
        generateAiConsultation();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const generateAiConsultation = async () => {
    setLoading(true);
    const prompt = `
      Child Name: ${formData.name}
      Age: ${formData.months} months
      Gender: ${formData.gender}
      Skills Status:
      - Motor: ${formData.skills.motor}
      - Language: ${formData.skills.language}
      - Logic: ${formData.skills.logic}
      Concerns: ${formData.concerns}
      
      Please provide a 3-paragraph developmental analysis and suggest 3 specific types of toys.
    `;
    const result = await askPlayWiseAI(prompt, formData);
    setAiResult(result);
    setLoading(false);

    // Auto-save if logged in
    if (user && !isMock && result) {
      saveQuizResult(result);
    }
  };

  const saveQuizResult = async (analysis: string) => {
    if (!user || isMock) return;
    setSaveStatus('saving');
    try {
      await addDoc(collection(db, 'quizResults'), {
        userId: user.uid,
        childName: formData.name,
        childMonths: formData.months,
        analysis,
        createdAt: serverTimestamp()
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error('Save quiz results failed:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Tracker */}
        <div className="flex justify-between mb-12 relative px-4">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10" />
           {STEPS.map((step, i) => (
             <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  i <= currentStep ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                }`}>
                  {i < currentStep ? <CheckCircle2 size={20} /> : <span>{i + 1}</span>}
                </div>
                <span className={`text-[10px] font-bold uppercase mt-2 tracking-tighter hidden sm:block ${
                  i <= currentStep ? 'text-brand-600' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
             </div>
           ))}
        </div>

        <motion.div
           key={currentStep}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-2">{STEPS[currentStep].title}</h2>
            <p className="text-slate-500 mb-12">{STEPS[currentStep].description}</p>

            {currentStep === 0 && (
              <div className="text-center py-12">
                 <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-8 animate-bounce">
                    <Baby size={48} />
                 </div>
                 <p className="text-lg text-slate-600 leading-relaxed mb-8">
                   Trắc nghiệm này được thiết kế để đánh giá tổng quan các kỹ năng vận động, ngôn ngữ và tư duy của bé, từ đó đưa ra gợi ý đồ chơi giáo dục phù hợp nhất.
                 </p>
                 <button onClick={handleNext} className="btn-primary py-4 px-12">Bắt đầu ngay thôi</button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                 <div>
                    <label className="block text-sm font-bold mb-4">Tên của bé</label>
                    <input 
                      type="text" 
                      className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none transition-all text-lg"
                      placeholder="Gõ tên bé tại đây..."
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold mb-4">Số tháng tuổi</label>
                      <input 
                        type="number" 
                        className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none transition-all text-lg"
                        value={formData.months}
                        onChange={e => setFormData({...formData, months: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-4">Giới tính</label>
                      <div className="flex gap-4">
                         {['male', 'female'].map(g => (
                           <button
                             key={g}
                             onClick={() => setFormData({...formData, gender: g})}
                             className={`flex-grow py-4 rounded-xl border-2 transition-all font-bold ${
                               formData.gender === g ? 'bg-brand-600 border-brand-600 text-white shadow-lg' : 'border-slate-100 text-slate-400'
                             }`}
                           >
                             {g === 'male' ? 'Bé Trai' : 'Bé Gái'}
                           </button>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                 <SkillSelector 
                   icon={<Target className="text-orange-500" />} 
                   label="Vận động tinh/thô" 
                   value={formData.skills.motor} 
                   onChange={val => setFormData({...formData, skills: {...formData.skills, motor: val}})} 
                 />
                 <SkillSelector 
                   icon={<Zap className="text-yellow-500" />} 
                   label="Ngôn ngữ & Giao tiếp" 
                   value={formData.skills.language} 
                   onChange={val => setFormData({...formData, skills: {...formData.skills, language: val}})} 
                 />
                 <SkillSelector 
                   icon={<Brain className="text-purple-500" />} 
                   label="Tư duy & Logic" 
                   value={formData.skills.logic} 
                   onChange={val => setFormData({...formData, skills: {...formData.skills, logic: val}})} 
                 />
                 <div>
                    <label className="block text-sm font-bold mb-4">Mối quan ngại khác (nếu có)</label>
                    <textarea 
                      className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none transition-all"
                      rows={3}
                      placeholder="Bé chậm nói, bé chưa biết bò..."
                      value={formData.concerns}
                      onChange={e => setFormData({...formData, concerns: e.target.value})}
                    ></textarea>
                 </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                 {loading ? (
                    <div className="py-20 text-center">
                       <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-6" />
                       <p className="text-slate-500 italic">AI đang phân tích dữ liệu phát triển...</p>
                    </div>
                 ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                       <div className="flex items-center gap-3 mb-6 p-4 bg-brand-50 rounded-2xl border border-brand-100 text-brand-700">
                          <Sparkles />
                          <p className="font-bold">Kết quả tư vấn cho bé {formData.name}</p>
                       </div>
                       <div className="prose prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-wrap mb-10">
                          {aiResult}
                       </div>
                       
                       {saveStatus === 'saved' && (
                         <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-6 bg-green-50 p-3 rounded-xl border border-green-100">
                           <CheckCircle2 size={16} />
                           Kết quả đã được sao lưu vào tài khoản của ba mẹ.
                         </div>
                       )}

                       <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
                          <button onClick={() => navigate('/toys')} className="btn-primary w-full">Xem đồ chơi gợi ý</button>
                          <button onClick={() => navigate('/consultation')} className="btn-secondary w-full">Gặp chuyên gia 1:1</button>
                       </div>
                    </div>
                 )}
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep > 0 && currentStep < 3 && (
              <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                 <button onClick={handleBack} className="p-4 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2">
                    <ArrowLeft size={20} /> Quay lại
                 </button>
                 <button onClick={handleNext} className="btn-primary px-10 py-4 font-bold flex items-center gap-2">
                    Tiếp tục <ArrowRight size={20} />
                 </button>
              </div>
            )}
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  );
}

function SkillSelector({ icon, label, value, onChange }: { icon: any, label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
         {icon}
         <label className="text-sm font-bold">{label}</label>
      </div>
      <div className="grid grid-cols-3 gap-2">
         {[
           { val: 'slow', label: 'Cần nỗ lực', color: 'hover:border-red-200' },
           { val: 'normal', label: 'Bình thường', color: 'hover:border-brand-200' },
           { val: 'fast', label: 'Vượt trội', color: 'hover:border-green-200' }
         ].map(opt => (
           <button
             key={opt.val}
             onClick={() => onChange(opt.val)}
             className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
               value === opt.val ? 'bg-slate-900 border-slate-900 text-white shadow-md' : `border-slate-100 text-slate-400 ${opt.color}`
             }`}
           >
             {opt.label}
           </button>
         ))}
      </div>
    </div>
  );
}
