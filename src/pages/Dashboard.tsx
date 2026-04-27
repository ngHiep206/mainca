import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Baby, 
  Map as MapIcon, 
  ChevronRight, 
  Calendar,
  BarChart3,
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  Zap,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import GoogleLoginButton from '../components/GoogleLoginButton';

const SKILL_LABELS = [
  { key: 'motorFine', label: 'Vận động tinh', icon: Target },
  { key: 'motorGross', label: 'Vận động thô', icon: MapIcon },
  { key: 'language', label: 'Ngôn ngữ', icon: Zap },
  { key: 'logic', label: 'Tư duy logic', icon: Brain },
  { key: 'emotional', label: 'Cảm xúc', icon: Heart }
];

const CHALLENGE_DAYS = [
  { day: 1, title: 'Chiếc hộp bí mật', desc: 'Khám phá các vật liệu khác nhau (vải, giấy, gỗ).' },
  { day: 2, title: 'Chơi cùng ánh sáng', desc: 'Tạo bóng trên tường cho bé đuổi theo.' },
  { day: 3, title: 'Gương soi diệu kỳ', desc: 'Khám phá biểu cảm khuôn mặt qua gương.' },
  { day: 4, title: 'Bản nhạc nhà bếp', desc: 'Dùng thìa gõ vào nồi tìm hiểu âm thanh.' },
  { day: 5, title: 'Vẽ bằng ngón tay', desc: 'Sáng tạo với màu thực phẩm an toàn.' },
  { day: 6, title: 'Phân loại sắc màu', desc: 'Tìm đồ vật cùng màu sắc trong phòng.' },
  { day: 7, title: 'Hành trình thiên nhiên', desc: 'Nhặt lá khô và quan sát kiến ngoài vườn.' }
];

export default function Dashboard() {
  const { user, isMock } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const navigate = useNavigate();

  // New Child Form
  const [childForm, setChildForm] = useState({ name: '', birthDate: '', gender: 'male' });
  // New Milestone Form
  const [msForm, setMsForm] = useState({ title: '', date: '', description: '', type: 'motor' });

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingData(false);
      return;
    }

    if (isMock) {
      const mockChildren = [
        { 
          id: 'mock-child-1', 
          name: 'Bé Bơ', 
          birthDate: new Date('2023-08-15'), 
          gender: 'female',
          parentId: 'mock-user-123',
          skillScores: { motorFine: 75, motorGross: 60, language: 40, logic: 55, emotional: 70 },
          createdAt: { seconds: Date.now() / 1000 }
        }
      ];
      setChildren(mockChildren);
      setSelectedChild(mockChildren[0]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const q = query(collection(db, 'children'), where('parentId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChildren(data);
      if (data.length > 0 && !selectedChild) setSelectedChild(data[0]);
      setLoadingData(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'children');
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user, isMock]);

  useEffect(() => {
    if (!selectedChild) {
      setMilestones([]);
      return;
    }

    if (isMock) {
      const mockMilestones = [
        { id: 'm1', parentId: user.uid, title: 'Bé biết tự cầm bình sữa', date: { seconds: Date.now() / 1000 - 86400 * 10 }, description: 'Lần đầu tiên bé tự giữ bình sữa và uống hết.', type: 'motor' },
        { id: 'm2', parentId: user.uid, title: 'Bé nói được từ "Ba Ba"', date: { seconds: Date.now() / 1000 - 86400 * 20 }, description: 'Bé gọi ba rất rõ ràng khi ba đi làm về.', type: 'language' }
      ];
      setMilestones(mockMilestones);
      return;
    }

    const q = query(
      collection(db, `children/${selectedChild.id}/milestones`),
      where('parentId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMilestones(data.sort((a: any, b: any) => {
        const dateA = a.date?.seconds || 0;
        const dateB = b.date?.seconds || 0;
        return dateB - dateA;
      }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `children/${selectedChild.id}/milestones`));

    return () => unsubscribe();
  }, [selectedChild, isMock, user]);

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isMock) {
      const newChild = {
        id: `mock-child-${Date.now()}`,
        ...childForm,
        parentId: user.uid,
        birthDate: new Date(childForm.birthDate),
        skillScores: { motorFine: 50, motorGross: 50, language: 50, logic: 50, emotional: 50 },
      };
      setChildren([...children, newChild]);
      setSelectedChild(newChild);
      setIsAddingChild(false);
      setChildForm({ name: '', birthDate: '', gender: 'male' });
      return;
    }

    try {
      await addDoc(collection(db, 'children'), {
        ...childForm,
        parentId: user.uid,
        birthDate: new Date(childForm.birthDate),
        skillScores: { motorFine: 50, motorGross: 50, language: 50, logic: 50, emotional: 50 },
        createdAt: serverTimestamp()
      });
      setIsAddingChild(false);
      setChildForm({ name: '', birthDate: '', gender: 'male' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'children');
    }
  };

  const addMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !user) return;

    if (isMock) {
      const newMs = {
        id: `ms-${Date.now()}`,
        ...msForm,
        parentId: user.uid,
        childId: selectedChild.id,
        date: { seconds: new Date(msForm.date).getTime() / 1000 },
      };
      setMilestones([newMs, ...milestones]);
      
      const newScores = { ...selectedChild.skillScores };
      const scoreKey = msForm.type === 'motor' ? 'motorFine' : msForm.type;
      newScores[scoreKey] = Math.min(100, (newScores[scoreKey] || 0) + 5);
      
      // Update local children list to reflect score change
      setChildren(children.map(c => c.id === selectedChild.id ? { ...c, skillScores: newScores } : c));
      setSelectedChild({ ...selectedChild, skillScores: newScores });

      setIsAddingMilestone(false);
      setMsForm({ title: '', date: '', description: '', type: 'motor' });
      return;
    }

    try {
      await addDoc(collection(db, `children/${selectedChild.id}/milestones`), {
        ...msForm,
        parentId: user.uid,
        childId: selectedChild.id,
        date: new Date(msForm.date),
        createdAt: serverTimestamp()
      });
      
      // Update skill score based on type
      const newScores = { ...selectedChild.skillScores };
      const scoreKey = msForm.type === 'motor' ? 'motorFine' : msForm.type;
      newScores[scoreKey] = Math.min(100, (newScores[scoreKey] || 0) + 5);
      await updateDoc(doc(db, 'children', selectedChild.id), { skillScores: newScores });

      setIsAddingMilestone(false);
      setMsForm({ title: '', date: '', description: '', type: 'motor' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `children/${selectedChild.id}/milestones`);
    }
  };

  const chartData = selectedChild ? [
    { subject: 'Vận động tinh', A: selectedChild.skillScores.motorFine, fullMark: 100 },
    { subject: 'Vận động thô', A: selectedChild.skillScores.motorGross, fullMark: 100 },
    { subject: 'Ngôn ngữ', A: selectedChild.skillScores.language, fullMark: 100 },
    { subject: 'Tư duy logic', A: selectedChild.skillScores.logic, fullMark: 100 },
    { subject: 'Cảm xúc', A: selectedChild.skillScores.emotional, fullMark: 100 },
  ] : [];

  if (loadingData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium font-display">Đang tải hành trình của bé...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-sm"
        >
          <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center text-brand-600 mb-8 mx-auto">
            <Baby size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Mở khóa hành trình của bé</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Đăng nhập bằng Google để lưu trữ nhật ký cột mốc, theo dõi biểu đồ kỹ năng và nhận gợi ý đồ chơi cá nhân hóa.
          </p>
          <GoogleLoginButton className="w-full py-4 text-lg shadow-lg" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header & Child Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl mb-4">Hành trình Phát triển</h1>
          <div className="flex flex-wrap gap-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-6 py-2 rounded-2xl flex items-center gap-2 transition-all shadow-sm border ${
                  selectedChild?.id === child.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-100 hover:border-brand-500'
                }`}
              >
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.name}`} alt="" className="w-6 h-6 rounded-full bg-slate-100" />
                <span className="font-bold">{child.name}</span>
              </button>
            ))}
            <button 
              onClick={() => setIsAddingChild(true)}
              className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-brand-600 hover:border-brand-600 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm bé
            </button>
          </div>
        </div>
        
        {selectedChild && (
           <div className="flex items-center gap-3 p-4 bg-accent-soft rounded-2xl text-accent-strong border border-pink-100">
              <Sparkles size={20} />
              <p className="text-sm font-bold">Gợi ý: Bé đang cần tập trung vào Ngôn ngữ</p>
           </div>
        )}
      </div>

      {!selectedChild && !isAddingChild ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
           <MapIcon className="mx-auto text-slate-200 mb-4" size={64} />
           <p className="text-slate-500">Người lạ ơi, hãy thêm hồ sơ của bé để bắt đầu nhé!</p>
        </div>
      ) : selectedChild && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Area: Journal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Chart */}
            <div className="glass-card rounded-[3rem] p-8 md:p-12">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl flex items-center gap-3">
                    <BarChart3 className="text-brand-600" />
                    Biểu đồ Kỹ năng (Skill Chart)
                  </h3>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                    Dựa trên các cột mốc
                  </div>
               </div>
               <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Radar
                      name={selectedChild.name}
                      dataKey="A"
                      stroke="#ea580c"
                      fill="#fb923c"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
               </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl flex items-center gap-3">
                  <MapIcon className="text-orange-500" />
                  Nhật ký Cột mốc
                </h3>
                <button 
                  onClick={() => setIsAddingMilestone(true)}
                  className="btn-primary py-2 px-4 text-sm rounded-xl"
                >
                  <Plus size={18} /> Ghi nhận cột mốc
                </button>
              </div>

              <div className="space-y-4">
                {milestones.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-10 bg-white rounded-3xl border border-slate-50">Chưa có cột mốc nào được ghi nhận.</p>
                ) : (
                  milestones.map((ms) => (
                    <div key={ms.id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex gap-6 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                         <Calendar size={24} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-lg font-bold">{ms.title}</h4>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                             {new Date(ms.date.seconds * 1000).toLocaleDateString('vi-VN')}
                           </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{ms.description}</p>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          ms.type === 'motor' ? 'bg-orange-100 text-orange-600' : 
                          ms.type === 'language' ? 'bg-yellow-100 text-yellow-600' :
                          ms.type === 'logic' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
                        }`}>
                          {ms.type}
                        </span>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            await deleteDoc(doc(db, `children/${selectedChild.id}/milestones`, ms.id));
                          } catch (err) {
                            handleFirestoreError(err, OperationType.DELETE, `children/${selectedChild.id}/milestones/${ms.id}`);
                          }
                        }}
                        className="text-slate-200 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Recommendations */}
          <div className="space-y-8">
             <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-xl mb-4 font-bold">Phân tích từ PlayWise</h4>
                   <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                     Bé <b>{selectedChild.name}</b> đang phát triển rất tốt ở mảng "Vận động". Để cân bằng các kỹ năng, hãy thử tập trung vào "Ngôn ngữ" trong 2 tuần tới.
                   </p>
                   <button 
                    onClick={() => navigate('/toys')}
                    className="flex items-center gap-2 text-brand-400 font-bold text-sm hover:translate-x-1 transition-transform cursor-pointer"
                   >
                      Xem đồ chơi gợi ý <ArrowRight size={16} />
                   </button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Baby size={80} />
                </div>
             </div>

             <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-500" />
                  Thử thách 7 ngày
                </h4>
                <p className="text-xs text-slate-500 mb-4">Mỗi ngày một trò chơi cùng bé.</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                   {CHALLENGE_DAYS.map((item) => (
                     <div key={item.day} className={`flex items-start gap-3 p-3 rounded-2xl transition-all border ${item.day <= 2 ? 'bg-brand-50 border-brand-100' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${item.day <= 2 ? 'bg-brand-600 text-white' : 'bg-white text-slate-400'}`}>
                          {item.day <= 2 ? <CheckCircle2 size={16} /> : item.day}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none mb-1">{item.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddingChild && (
        <Modal title="Thêm hồ sơ bé" onClose={() => setIsAddingChild(false)}>
           <form onSubmit={addChild} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Tên của bé</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Ví dụ: Bé Bơ"
                  value={childForm.name}
                  onChange={e => setChildForm({...childForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Ngày sinh</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                    value={childForm.birthDate}
                    onChange={e => setChildForm({...childForm, birthDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Giới tính</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                    value={childForm.gender}
                    onChange={e => setChildForm({...childForm, gender: e.target.value})}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary py-4">Tạo hồ sơ</button>
           </form>
        </Modal>
      )}

      {isAddingMilestone && (
        <Modal title="Ghi nhận Cột mốc mới" onClose={() => setIsAddingMilestone(false)}>
           <form onSubmit={addMilestone} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Bé đã làm được gì?</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Ví dụ: Bé biết bò, Bé nói được từ 'Ba'..."
                  value={msForm.title}
                  onChange={e => setMsForm({...msForm, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Ngày xảy ra</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                    value={msForm.date}
                    onChange={e => setMsForm({...msForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Loại kỹ năng</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                    value={msForm.type}
                    onChange={e => setMsForm({...msForm, type: e.target.value})}
                  >
                    <option value="motor">Vận động</option>
                    <option value="language">Ngôn ngữ</option>
                    <option value="logic">Tư duy</option>
                    <option value="emotional">Cảm xúc</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Kể chi tiết thêm (không bắt buộc)</label>
                <textarea 
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  value={msForm.description}
                  onChange={e => setMsForm({...msForm, description: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-4">Lưu cột mốc</button>
           </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
       />
       <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.95, y: 20 }}
         className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
       >
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" size={24} /></button>
         </div>
         <div className="p-8">
            {children}
         </div>
       </motion.div>
    </div>
  );
}
