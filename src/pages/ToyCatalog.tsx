import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShieldCheck, Heart, Brain, Zap, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOY_DATA = [
  {
    id: '1',
    name: 'Winwintoys - Tháp 7 màu thông minh',
    image: 'https://images.unsplash.com/photo-1515488403636-ee99cf55320c?auto=format&fit=crop&q=80&w=800',
    skills: ['logic', 'motorFine'],
    ageRange: [6, 24],
    price: 350000,
    expertChoice: true,
    safetyCert: 'CE, CR, ISO 9001'
  },
  {
    id: '2',
    name: 'Hape - Đồ chơi đập bóng và đàn Xylophone 2-in-1',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800',
    skills: ['motorFine', 'logic'],
    ageRange: [12, 36],
    price: 890000,
    expertChoice: true,
    safetyCert: 'ASTM F963, EN71'
  },
  {
    id: '3',
    name: 'LEGO DUPLO - Đoàn tàu học số (Number Train)',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    skills: ['motorFine', 'logic'],
    ageRange: [18, 60],
    price: 590000,
    expertChoice: false,
    safetyCert: 'LEGO Safety Standards'
  },
  {
    id: '4',
    name: 'Colormed - Bảng vận động (Busy Board) cho bé',
    image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800',
    skills: ['motorFine', 'logic'],
    ageRange: [9, 36],
    price: 1150000,
    expertChoice: true,
    safetyCert: 'FDA, ISO 9001'
  },
  {
    id: '5',
    name: 'Fisher-Price - Tháp vòng Rock-a-Stack cổ điển',
    image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=800',
    skills: ['motorGross', 'logic'],
    ageRange: [6, 24],
    price: 245000,
    expertChoice: false,
    safetyCert: 'ASTM, EN71'
  },
  {
    id: '6',
    name: 'Melissa & Doug - Bộ khối xây dựng bằng gỗ (100 khối)',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    skills: ['logic', 'motorFine', 'emotional'],
    ageRange: [24, 96],
    price: 650000,
    expertChoice: true,
    safetyCert: 'ASTM, FSC'
  }
];

const SKILL_MAP: Record<string, { label: string, icon: any, color: string }> = {
  motorFine: { label: 'Vận động tinh', icon: Target, color: 'text-brand-600 bg-brand-50' },
  motorGross: { label: 'Vận động thô', icon: Map, color: 'text-orange-600 bg-orange-50' },
  logic: { label: 'Tư duy logic', icon: Brain, color: 'text-teal-600 bg-teal-50' },
  language: { label: 'Ngôn ngữ', icon: Zap, color: 'text-orange-600 bg-orange-50' },
  emotional: { label: 'Cảm xúc & Xã hội', icon: Heart, color: 'text-teal-600 bg-teal-50' }
};

export default function ToyCatalog() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<number | null>(null);

  const filteredToys = useMemo(() => {
    return TOY_DATA.filter(toy => {
      const matchSearch = toy.name.toLowerCase().includes(search.toLowerCase());
      const matchSkill = !selectedSkill || toy.skills.includes(selectedSkill);
      const matchAge = !ageFilter || (ageFilter >= toy.ageRange[0] && ageFilter <= toy.ageRange[1]);
      return matchSearch && matchSkill && matchAge;
    });
  }, [search, selectedSkill, ageFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl mb-4">Bộ lọc Đồ chơi Thông minh</h1>
        <p className="text-slate-500">Tìm kiếm dựa trên mục tiêu phát triển thay vì chỉ giá thành.</p>
      </div>

      <div className="lg:flex gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8 mb-8 lg:mb-0">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên đồ chơi..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain size={18} className="text-brand-600" />
              Mục tiêu phát triển
            </h3>
            <div className="space-y-2">
              <FilterChip 
                label="Tất cả" 
                active={!selectedSkill} 
                onClick={() => setSelectedSkill(null)} 
              />
              {Object.entries(SKILL_MAP).map(([id, { label }]) => (
                <FilterChip 
                  key={id} 
                  label={label} 
                  active={selectedSkill === id} 
                  onClick={() => setSelectedSkill(id)} 
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Độ tuổi (Tháng)</h3>
            <div className="grid grid-cols-2 gap-2">
              {[6, 12, 18, 24, 36, 48].map(age => (
                <button
                  key={age}
                  onClick={() => setAgeFilter(ageFilter === age ? null : age)}
                  className={`py-2 text-sm rounded-lg border transition-all ${
                    ageFilter === age ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 hover:border-brand-200'
                  }`}
                >
                  {age} tháng
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Catalog Grid */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-500 text-sm">Tìm thấy <b>{filteredToys.length}</b> sản phẩm phù hợp</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredToys.map((toy) => (
                <motion.div
                  key={toy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all"
                >
                  <Link to={`/toy/${toy.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={toy.image} alt={toy.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {toy.expertChoice && (
                        <div className="absolute top-4 left-4 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <ShieldCheck size={14} />
                          Chuyên gia khuyên dùng
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {toy.skills.map(s => {
                        const Skill = SKILL_MAP[s];
                        return (
                          <span key={s} className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${Skill?.color}`}>
                            {Skill?.label}
                          </span>
                        );
                      })}
                    </div>
                    <Link to={`/toy/${toy.id}`}>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-brand-600 transition-colors leading-tight">{toy.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-xl font-bold text-slate-900">
                        {toy.price.toLocaleString('vi-VN')}đ
                      </p>
                      <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredToys.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <Search className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-500 italic">Không tìm thấy đồ chơi nào phù hợp với bộ lọc.</p>
              <button 
                onClick={() => { setSearch(''); setSelectedSkill(null); setAgeFilter(null); }}
                className="mt-4 text-brand-600 font-bold"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  key?: string;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
        active ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}
