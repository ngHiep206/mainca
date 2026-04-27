import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, Info, FileText, X, ExternalLink, Calendar, Award } from 'lucide-react';

const CERTIFICATES_DATA = [
  {
    id: '1',
    name: 'Winwintoys',
    type: 'Brand',
    status: 'Verified',
    certificates: ['CR (Vietnam)', 'CE (EN71)', 'ASTM'],
    lastAudit: '12/2023',
    details: 'Thương hiệu đồ chơi gỗ hàng đầu Việt Nam. Tất cả sản phẩm sử dụng gỗ cao su tự nhiên và sơn không độc hại đạt tiêu chuẩn Châu Âu.',
    link: 'https://winwintoys.com'
  },
  {
    id: '2',
    name: 'Colormed',
    type: 'Brand',
    status: 'Verified',
    certificates: ['ISO 9001:2015', 'FDA Registered'],
    lastAudit: '08/2023',
    details: 'Nhà sản xuất các sản phẩm hỗ trợ giáo dục và y tế. Đạt tiêu chuẩn khắt khe về độ bền và an toàn sinh học.',
    link: 'https://colormed.com.vn'
  },
  {
    id: '3',
    name: 'Hape',
    type: 'Brand',
    status: 'Verified',
    certificates: ['FSC Gỗ bền vững', 'ICTI Care', 'ISO 14001'],
    lastAudit: '10/2023',
    details: 'Thương hiệu đồ chơi bằng gỗ lớn nhất thế giới. Cam kết phát triển bền vững và sử dụng vật liệu nhựa sinh học từ mía.',
    link: 'https://hape.com'
  },
  {
    id: '4',
    name: 'LEGO',
    type: 'Brand',
    status: 'Verified',
    certificates: ['LEGO Safety Standards', 'EN71', 'ASTM F963'],
    lastAudit: '01/2024',
    details: 'Tập đoàn đồ chơi lớn nhất thế giới. Các viên gạch LEGO DUPLO được kiểm tra khắt khe về độ bền, không chứa hóa chất độc hại và kích thước an toàn cho trẻ nhỏ.',
    link: 'https://lego.com'
  },
  {
    id: '5',
    name: 'Melissa & Doug',
    type: 'Brand',
    status: 'Verified',
    certificates: ['ASTM', 'EN71', 'FSC'],
    lastAudit: '11/2023',
    details: 'Thương hiệu Mỹ nổi tiếng với đồ chơi gỗ bền bỉ. Quy trình kiểm định chất lượng nghiêm ngặt về hàm lượng chì và các hóa chất trong sơn.',
    link: 'https://melissaanddoug.com'
  },
  {
    id: '6',
    name: 'Fisher-Price',
    type: 'Brand',
    status: 'Verified',
    certificates: ['Mattel Global Safety', 'ASTM', 'CE'],
    lastAudit: '02/2024',
    details: 'Thương hiệu lâu đời thuộc tập đoàn Mattel. Các sản phẩm được thử nghiệm trong "Play Lab" với trẻ em thật trước khi đưa ra thị trường.',
    link: 'https://fisher-price.mattel.com'
  },
  {
    id: '7',
    name: 'ASTM F963',
    type: 'Standard',
    status: 'Active',
    certificates: ['USA Standard'],
    lastAudit: 'N/A',
    details: 'Tiêu chuẩn an toàn đồ chơi của Hoa Kỳ. Bao gồm các bài kiểm tra về độ bền, tính dễ cháy, độc tính và các bộ phận nhỏ có thể gây hóc.',
    link: '#'
  },
  {
    id: '8',
    name: 'EN71',
    type: 'Standard',
    status: 'Active',
    certificates: ['EU Standard'],
    lastAudit: 'N/A',
    details: 'Tiêu chuẩn Châu Âu về an toàn đồ chơi. Được chia thành nhiều phần: EN71-1 (tính chất cơ lý), EN71-2 (tính cháy), EN71-3 (di chuyển của các nguyên tố nhất định).',
    link: '#'
  },
  {
    id: '9',
    name: 'ISO 9001',
    type: 'Standard',
    status: 'Active',
    certificates: ['Quality Management'],
    lastAudit: 'N/A',
    details: 'Hệ thống quản lý chất lượng quốc tế, đảm bảo quy trình sản xuất ổn định và kiểm soát lỗi tốt.',
    link: '#'
  },
  {
    id: '10',
    name: 'FSC',
    type: 'Standard',
    status: 'Active',
    certificates: ['Forestry Stewardship'],
    lastAudit: 'N/A',
    details: 'Chứng nhận bảo vệ rừng. Đảm bảo gỗ được khai thác từ nguồn rừng được quản lý bền vững, an toàn cho môi trường.',
    link: '#'
  },
  {
    id: '11',
    name: 'CR (Vietnam)',
    type: 'Standard',
    status: 'Active',
    certificates: ['QCVN 3:2009/BKHCN'],
    lastAudit: 'N/A',
    details: 'Dấu hợp quy (CR) là bằng chứng cho thấy đồ chơi trẻ em đã được đánh giá và xác nhận phù hợp với các quy chuẩn kỹ thuật quốc gia của Việt Nam.',
    link: '#'
  },
  {
    id: '5',
    name: 'CE (EU)',
    type: 'Standard',
    status: 'Active',
    certificates: ['EN71-1, 2, 3'],
    lastAudit: 'N/A',
    details: 'Chỉ số an toàn đồ chơi cao cấp nhất hiện nay. Quy định khắt khe về tính chất cơ lý, khả năng chống cháy và hàm lượng kim loại nặng.',
    link: '#'
  }
];

export default function SafetyCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<typeof CERTIFICATES_DATA[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const result = CERTIFICATES_DATA.find(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResult(result || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-slate-800">
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
         <div className="lg:w-1/2">
            <h1 className="text-5xl font-display font-bold mb-8">Kiểm định An toàn & Tiêu chuẩn Chất lượng</h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              PlayWise cam kết chỉ giới thiệu những sản phẩm đạt tiêu chuẩn an toàn quốc tế và khu vực. Chúng tôi hiểu rằng, an toàn của bé là ưu tiên số một.
            </p>
            <div className="flex flex-wrap gap-4">
               <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                  <CheckCircle2 size={16} /> Chứng nhận CR (VN)
               </span>
               <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                  <CheckCircle2 size={16} /> Tiêu chuẩn CE (EU)
               </span>
               <span className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100">
                  <CheckCircle2 size={16} /> BPA Free
               </span>
            </div>
         </div>
         <div className="lg:w-1/2 relative">
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="glass-card p-10 rounded-[3rem] shadow-2xl relative z-10"
            >
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Search className="text-brand-600" />
                  Tra cứu Chứng chỉ
               </h3>
               <p className="text-sm text-slate-500 mb-6">Nhập tên nhãn hàng hoặc mã vạch đồ chơi để kiểm tra độ tin cậy.</p>
               <div className="relative mb-6">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ví dụ: Winwintoys, Colormed..."
                    className="w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 text-white p-3 rounded-xl shadow-lg shadow-brand-500/20"
                  >
                     <Search size={20} />
                  </button>
               </div>
               
               <AnimatePresence mode="wait">
                 {hasSearched && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-100"
                   >
                     {searchResult ? (
                       <div className="space-y-4">
                         <div className="flex justify-between items-start">
                           <div>
                             <h4 className="font-bold text-lg text-slate-900">{searchResult.name}</h4>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 px-2 py-0.5 bg-brand-50 rounded italic">{searchResult.type}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full">
                             <CheckCircle2 size={14} />
                             {searchResult.status}
                           </div>
                         </div>
                         <p className="text-sm text-slate-600 leading-relaxed italic">"{searchResult.details}"</p>
                         <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                           <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Chứng chỉ</p>
                             <div className="flex flex-wrap gap-1">
                               {searchResult.certificates.map(c => (
                                 <span key={c} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded italic">{c}</span>
                               ))}
                             </div>
                           </div>
                           <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Kiểm định gần nhất</p>
                             <p className="text-xs font-bold text-slate-700">{searchResult.lastAudit}</p>
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-4">
                         <AlertCircle className="mx-auto text-amber-500 mb-3" size={32} />
                         <p className="text-sm font-bold text-slate-700">Không tìm thấy thông tin</p>
                         <p className="text-xs text-slate-500">Chúng tôi đang cập nhật thêm dữ liệu cho "{searchTerm}".</p>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>

               {!hasSearched && (
                 <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs flex gap-3">
                    <AlertCircle className="flex-shrink-0" size={16} />
                    <p>Hệ thống hiện đang cập nhật cơ sở dữ liệu cho 500+ nhãn hàng nội địa và quốc tế.</p>
                 </div>
               )}
            </motion.div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10" />
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-800">
         <InfoBlock 
            icon={<ShieldCheck className="text-brand-500" />}
            title="Kiểm định Chất liệu"
            description="Tất cả đồ chơi nhựa phải đáp ứng tiêu chuẩn không chứa Phthalate và Chì. Đồ chơi gỗ phải sử dụng gỗ tái chế hoặc gỗ bền vững."
         />
         <InfoBlock 
            icon={<FileText className="text-blue-500" />}
            title="Quy trình Đánh giá"
            description="Đội ngũ PlayWise trực tiếp mua và trải nghiệm thực tế sản phẩm trước khi đưa vào danh sách gợi ý cho phụ huynh."
         />
         <InfoBlock 
            icon={<CheckCircle2 className="text-green-500" />}
            title="Tín nhiệm Chuyên gia"
            description="Hơn 50 bác sĩ nhi khoa và chuyên gia tâm lý học lâm sàng đã tham gia cố vấn nội dung và tiêu chuẩn chất lượng cho PlayWise."
         />
      </div>

      <div className="mt-24 p-12 lg:p-20 rounded-[3rem] bg-white border border-slate-100 text-center shadow-xl">
         <h2 className="text-3xl lg:text-4xl mb-6">Bạn phát hiện hàng giả/kém chất lượng?</h2>
         <p className="text-slate-500 mb-10 max-w-2xl mx-auto">Giúp cộng đồng cha mẹ an toàn hơn bằng cách báo cáo sản phẩm không đủ tiêu chuẩn cho chúng tôi.</p>
         <button className="btn-secondary px-12 py-4 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer">
            Gửi báo cáo vi phạm
         </button>
      </div>
    </div>
  );
}

function InfoBlock({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h3 className="text-xl font-bold mb-4">{title}</h3>
       <p className="text-slate-500 leading-relaxed text-sm italic">"{description}"</p>
    </div>
  );
}
