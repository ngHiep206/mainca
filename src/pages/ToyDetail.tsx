import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ShoppingBag, 
  Brain, 
  Zap, 
  Heart, 
  BookOpen, 
  Users,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const TOY_DATA: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Winwintoys - Tháp 7 màu thông minh',
    image: 'https://images.unsplash.com/photo-1515488403636-ee99cf55320c?auto=format&fit=crop&q=80&w=800',
    description: 'Tháp gỗ xếp chồng cổ điển của Winwintoys giúp trẻ từ 6-24 tháng tuổi làm quen với kích thước, màu sắc và rèn luyện kỹ năng vận động tinh.',
    scientificExplanation: 'Việc xếp các vòng tròn theo thứ tự kích thước giúp hình thành khái niệm về trật tự và kích thước (seriation) - nền tảng của tư duy toán học và logic sớm.',
    playGuide: [
      '6-12 tháng: Để bé tự tháo các vòng ra để khám phá trọng lượng và âm thanh khi gỗ va chạm.',
      '12-18 tháng: Hướng dẫn bé xếp theo kích thước từ lớn nhất đến nhỏ nhất.',
      '18 tháng+: Đố bé gọi tên các màu sắc của từng vòng gỗ.'
    ],
    skills: ['logic', 'motorFine'],
    ageRange: [6, 24],
    price: 350000,
    expertChoice: true,
    safetyCert: ['CR (Việt Nam)', 'CE', 'ISO 9001'],
    affiliateLinks: { shopee: 'https://shopee.vn', lazada: 'https://lazada.vn' }
  },
  '2': {
    id: '2',
    name: 'Hape - Đồ chơi đập bóng & đàn Xylophone 2-in-1',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800',
    description: 'Sản phẩm đoạt nhiều giải thưởng của Hape. Trẻ đập bóng rơi xuống các thanh đàn tạo ra âm thanh vui nhộn, hoặc có thể kéo đàn Xylophone ra chơi riêng.',
    scientificExplanation: 'Kích thích phát triển thính giác và hiểu biết về nguyên nhân - kết quả. Việc dùng búa đập bóng chính xác rèn luyện sự phối hợp tay-mắt và cơ bắp tay.',
    playGuide: [
      'Làm mẫu cách cầm búa và đập nhẹ vào bóng để tạo ra âm thanh.',
      'Khuyến khích bé gọi tên màu sắc của quả bóng trước khi đập.',
      'Rút đàn Xylophone ra và cùng bé gõ theo nhịp điệu đơn giản.'
    ],
    skills: ['motorFine', 'logic'],
    ageRange: [12, 36],
    price: 890000,
    expertChoice: true,
    safetyCert: ['ASTM F963', 'EN71'],
    affiliateLinks: { shopee: 'https://shopee.vn' }
  },
  '3': {
    id: '3',
    name: 'LEGO DUPLO - Đoàn tàu học số (Number Train)',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    description: 'Bộ lắp ghép đầu đời giúp bé làm quen với các con số từ 0-9 thông qua các khối gạch DUPLO lớn, an toàn và màu sắc rực rỡ.',
    scientificExplanation: 'Phát triển kỹ năng vận động tinh thông qua việc lắp ghép các khối gạch. Đồng thời giới thiệu khái niệm số đếm và nhận diện chữ số một cách tự nhiên.',
    playGuide: [
      'Cùng bé lắp các toa tàu theo đúng thứ tự số từ 0 đến 9.',
      'Dùng các nhân vật đi kèm để đóng vai các hành khách trên chuyến tàu.',
      'Tháo rời và yêu cầu bé tìm đúng khối gạch mang con số mà ba mẹ đọc.'
    ],
    skills: ['motorFine', 'logic'],
    ageRange: [18, 60],
    price: 590000,
    expertChoice: false,
    safetyCert: ['LEGO Safety Standards'],
    affiliateLinks: { shopee: 'https://shopee.vn' }
  },
  '4': {
    id: '4',
    name: 'Colormed - Bảng vận động (Busy Board) cho bé',
    image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800',
    description: 'Bảng gỗ tích hợp nhiều chi tiết thực tế: khóa cửa, bánh răng, dây giày, công tắc... giúp bé rèn luyện đôi tay khéo léo và kiên nhẫn.',
    scientificExplanation: 'Dựa trên phương pháp Montessori, bảng giúp bé học các kỹ năng sống thực tế, kích thích trí tò mò và khả năng giải quyết vấn đề đơn giản.',
    playGuide: [
      'Để bé tự do khám phá các bộ phận trên bảng một cách tự nhiên.',
      'Làm mẫu chậm các động tác khó như buộc dây giày hay cài khuy.',
      'Đặt ra các thử thách nhỏ: "Con hãy mở cánh cửa màu đỏ ra xem có gì bên trong nhé".'
    ],
    skills: ['motorFine', 'logic'],
    ageRange: [9, 36],
    price: 1150000,
    expertChoice: true,
    safetyCert: ['FDA', 'ISO 9001'],
    affiliateLinks: { shopee: 'https://shopee.vn' }
  },
  '5': {
    id: '5',
    name: 'Fisher-Price - Tháp vòng Rock-a-Stack',
    image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=800',
    description: 'Đồ chơi kinh điển nhất của Fisher-Price với đế lắc lư và 5 vòng tròn màu sắc, trong đó vòng nhỏ nhất có những hạt nhỏ li ti tạo tiếng động.',
    scientificExplanation: 'Phát triển sự phối hợp tay-mắt và giới thiệu khái niệm về sự cân bằng thông qua phần đế bập bênh.',
    playGuide: [
      'Lắc vòng nhỏ nhất để thu hút sự chú ý của bé bằng âm thanh lách cách.',
      'Khuyến khích bé cầm nắm và ném các vòng để phát triển kỹ năng cầm nắm.',
      'Dạy bé cách xếp các vòng vào trụ theo thứ tự từ lớn đến bé.'
    ],
    skills: ['motorGross', 'logic'],
    ageRange: [6, 24],
    price: 245000,
    expertChoice: false,
    safetyCert: ['ASTM', 'EN71'],
    affiliateLinks: { shopee: 'https://shopee.vn' }
  },
  '6': {
    id: '6',
    name: 'Melissa & Doug - Bộ khối xây dựng 100 khối gỗ',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    description: 'Bộ khối gỗ đa dạng hình dáng và màu sắc của Melissa & Doug là món đồ chơi "mở" (open-ended) tuyệt vời nhất để kích thích trí tưởng tượng vô hạn của trẻ.',
    scientificExplanation: 'Thúc đẩy trí tưởng tượng không gian và tư duy kiến trúc. Khi chơi cùng bạn bè hoặc ba mẹ, trẻ phát triển kỹ năng giao tiếp, làm việc nhóm và giải quyết vấn đề vật lý cơ bản.',
    playGuide: [
      'Xây dựng tự do: Hãy để bé tự do xếp các khối gỗ theo trí tò mò của mình.',
      'Thử thách tháp cao: Xây một tòa tháp cao và để bé làm đổ - bé sẽ học về trọng lực và sự cân bằng.',
      'Phân loại hình khối: Dùng các khối gỗ để dạy bé phân biệt hình hộp, hình trụ, hình tam giác.'
    ],
    skills: ['logic', 'motorFine', 'emotional'],
    ageRange: [24, 96],
    price: 650000,
    expertChoice: true,
    safetyCert: ['ASTM', 'EN71', 'FSC'],
    affiliateLinks: { shopee: 'https://shopee.vn' }
  }
};

export default function ToyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toy = TOY_DATA[id || ''];

  if (!toy) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl mb-4 italic">Sản phẩm không tồn tại</h2>
        <button onClick={() => navigate('/toys')} className="btn-primary">Quay lại danh mục</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image & Quick Stats */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-500/10"
          >
            <img src={toy.image} alt={toy.name} className="w-full h-full object-cover" />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <StatBox icon={<Users size={20} className="text-brand-500" />} label="Độ tuổi" value={`${toy.ageRange[0]}-${toy.ageRange[1]} tháng`} />
            <StatBox icon={<ShieldCheck size={20} className="text-green-500" />} label="An toàn" value={toy.safetyCert[0]} />
          </div>

          <div className="p-8 rounded-3xl bg-brand-50 border border-brand-100 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-4">
                <Brain className="text-brand-600" />
                <h3 className="font-bold text-lg text-brand-900">Giải thích Khoa học</h3>
             </div>
             <p className="text-brand-800/80 leading-relaxed text-sm italic">
               "{toy.scientificExplanation}"
             </p>
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={120} />
             </div>
          </div>
        </div>

        {/* Right: Info & CTA */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {toy.expertChoice && (
                <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <CheckCircle2 size={12} /> Expert Choice
                </span>
              )}
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                 ID: #{toy.id}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">{toy.name}</h1>
            <p className="text-3xl font-bold text-slate-900 mb-8">{toy.price.toLocaleString('vi-VN')}đ</p>
            <p className="text-slate-600 leading-relaxed text-lg">{toy.description}</p>
          </div>

          <div>
             <h3 className="flex items-center gap-3 font-bold mb-6 text-xl">
                <BookOpen size={20} className="text-brand-500" />
                Hướng dẫn cách chơi (Play Guide)
             </h3>
             <ul className="space-y-4">
                {toy.playGuide.map((step: string, i: number) => (
                  <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
             </ul>
          </div>

          <div className="pt-8 border-t border-slate-100 space-y-4">
            <p className="font-bold text-slate-900">Mua ngay tại các sàn uy tín:</p>
            <div className="flex flex-col sm:flex-row gap-4">
               {toy.affiliateLinks.shopee && (
                 <a 
                   href={toy.affiliateLinks.shopee} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="btn-primary w-full bg-[#EE4D2D] hover:bg-[#d73211] shadow-[#EE4D2D]/20"
                 >
                   Mua tại Shopee
                   <ExternalLink size={18} />
                 </a>
               )}
               {toy.affiliateLinks.lazada && (
                 <a 
                   href={toy.affiliateLinks.lazada} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="btn-secondary w-full border-[#00008F] text-[#00008F] hover:bg-blue-50"
                 >
                   Mua tại Lazada
                   <ExternalLink size={18} />
                 </a>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
