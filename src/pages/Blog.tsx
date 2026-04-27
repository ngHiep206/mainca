import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, User, ArrowRight, Sparkles, X, ChevronLeft } from 'lucide-react';

const POSTS = [
  {
    id: '1',
    title: '3 sai lầm phổ biến khi chọn đồ chơi cho bé 1 tuổi',
    excerpt: 'Việc lạm dụng đồ chơi điện tử phát nhạc có thể ảnh hưởng đến khả năng tập trung lâu dài của trẻ...',
    content: `
      Khi trẻ bước vào giai đoạn 1 tuổi, đây là thời kỳ bùng nổ về nhận thức và vận động. Tuy nhiên, nhiều phụ huynh thường mắc phải 3 sai lầm nghiêm trọng sau:

      1. Chọn đồ chơi quá phức tạp: Đồ chơi có quá nhiều nút bấm, ánh sáng và âm thanh liên tục khiến não bộ trẻ bị quá tải, dẫn đến việc trẻ nhanh chán và giảm khả năng tập trung sâu.
      2. Ưu tiên số lượng hơn chất lượng: Quá nhiều đồ chơi khiến trẻ bị xao nhãng. Thay vào đó, hãy áp dụng phương pháp "Toy Rotation" (xoay vòng đồ chơi) để trẻ luôn cảm thấy mới mẻ với những món cũ.
      3. Bỏ qua yếu tố an toàn vật liệu: Trẻ 1 tuổi vẫn còn thói quen cho đồ chơi vào miệng. Hãy đảm bảo đồ chơi không chứa BPA, sơn an toàn và không có các chi tiết nhỏ dễ rời.

      Lời khuyên: Hãy chọn những món đồ chơi mở (open-ended toys) như khối gỗ, lật đật hoặc các bộ xếp hình đơn giản để khuyến khích sự sáng tạo của bé.
    `,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000',
    date: '20/10/2023',
    author: 'Chuyên gia Mai Anh',
    category: 'Giáo dục sớm'
  },
  {
    id: '2',
    title: 'Phát triển vận động tinh qua phương pháp Montessori',
    excerpt: 'Đôi bàn tay là công cụ của trí tuệ. Hãy cùng tìm hiểu cách rèn luyện 10 ngón tay cho bé...',
    content: `
      Bà Maria Montessori từng nói: "Đôi bàn tay là công cụ của trí tuệ loài người". Vận động tinh là khả năng điều khiển các cơ nhỏ ở bàn tay và ngón tay.

      Các hoạt động giúp bé phát triển vận động tinh hiệu quả:
      - Hoạt động chuyển đồ vật: Dùng nhíp gắp bông gòn, dùng thìa chuyển hạt từ bát này sang bát khác.
      - Xâu chuỗi: Luồn dây qua các hạt gỗ lớn giúp rèn luyện sự phối hợp tay-mắt.
      - Chơi với đất nặn: Thao tác bóp, nặn, cán giúp các cơ ngón tay khỏe mạnh và linh hoạt hơn.

      Việc rèn luyện vận động tinh sớm giúp trẻ dễ dàng tự lập trong các hoạt động cá nhân như tự xúc ăn, cài cúc áo và sau này là khả năng cầm bút viết.
    `,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000',
    date: '18/10/2023',
    author: 'ThS. Nguyễn Bình',
    category: 'Vận động'
  },
  {
    id: '3',
    title: 'Tại sao trẻ 18 tháng lại bắt đầu có dấu hiệu chậm nói?',
    excerpt: 'Hiểu đúng về cột mốc ngôn ngữ để không bỏ lỡ giai đoạn vàng trong sự phát triển của con...',
    content: `
      18 tháng là độ tuổi bản lề trong sự phát triển ngôn ngữ. Thông thường, ở giai đoạn này trẻ nên có vốn từ khoảng 10-20 từ đơn.

      Nguyên nhân thường gặp:
      - Trẻ được xem tivi/điện thoại quá nhiều: Đây là hình thức giao tiếp một chiều, trẻ không có nhu cầu phản hồi.
      - Phụ huynh đoán ý con quá nhanh: Khi con chỉ cần chỉ tay đã được đáp ứng, con sẽ lười sử dụng ngôn ngữ.
      - Thiếu môi trường tương tác: Trẻ ít được trò chuyện, đọc sách cùng cha mẹ.

      Giải pháp: Hãy dành ít nhất 30 phút mỗi ngày tương tác hoàn toàn với con thông qua việc mô tả các hoạt động đang làm, đọc sách vải và đặt câu hỏi lựa chọn cho con. Nếu đến 24 tháng trẻ vẫn chưa nói được từ đơn, phụ huynh nên đưa trẻ đi đánh giá sàng lọc chuyên sâu.
    `,
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=1000',
    date: '15/10/2023',
    author: 'BS. Lê Hoàn',
    category: 'Ngôn ngữ'
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<(typeof POSTS)[0] | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16 text-center max-w-3xl mx-auto">
         <h1 className="text-5xl font-display font-bold mb-6 italic underline decoration-brand-200">Kiến thức Education</h1>
         <p className="text-slate-500 text-lg">Cập nhật những xu hướng giáo dục sớm và kiến thức khoa học từ các chuyên gia hàng đầu.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         {POSTS.map((post, i) => (
           <motion.article 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={post.id} 
             className="glass-card rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all flex flex-col h-full"
           >
              <div className="aspect-video overflow-hidden">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-600 mb-4">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-slate-400">{post.date}</span>
                 </div>
                 <h3 className="text-xl font-bold mb-4 group-hover:text-brand-600 transition-colors flex-grow">{post.title}</h3>
                 <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3 italic">
                   "{post.excerpt}"
                 </p>
                 <button 
                   onClick={() => setSelectedPost(post)}
                   className="flex items-center gap-2 text-brand-600 font-bold text-sm group/btn cursor-pointer"
                 >
                    Đọc tiếp <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
           </motion.article>
         ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-brand-600 shadow-sm"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto">
                <div className="h-64 sm:h-80 relative">
                  <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-3 opacity-80">
                      <span className="px-3 py-1 bg-brand-600 rounded-full">{selectedPost.category}</span>
                      <span>{selectedPost.date}</span>
                    </div>
                    <h2 className="text-3xl font-bold max-w-2xl">{selectedPost.title}</h2>
                  </div>
                </div>

                <div className="p-10 lg:p-16">
                  <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selectedPost.author}</p>
                      <p className="text-xs text-slate-500">Người viết bài chuyên môn</p>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    {selectedPost.content.split('\n').map((paragraph, i) => (
                      paragraph.trim() && (
                        <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                          {paragraph.trim()}
                        </p>
                      )
                    ))}
                  </div>

                  <div className="mt-12 p-8 rounded-3xl bg-brand-50 border border-brand-100 italic text-brand-700 text-sm">
                    Lưu ý: Nội dung trên đây chỉ mang tính chất tham khảo. Ba mẹ hãy luôn quan sát và thấu hiểu đặc điểm riêng biệt của con mình để có phương pháp giáo dục phù hợp nhất.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-20 bg-brand-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
         <div className="relative z-10 lg:flex items-center justify-between gap-12">
            <div>
               <h2 className="text-3xl lg:text-4xl mb-6">Đăng ký nhận bản tin PlayWise Weekly</h2>
               <p className="text-brand-100 max-w-md">Bí quyết nuôi dạy con khoa học được gửi trực tiếp vào email của bạn mỗi sáng Thứ Hai.</p>
            </div>
            <div className="mt-8 lg:mt-0 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
               {isSubscribed ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="w-full p-5 rounded-2xl bg-white/20 border border-white/30 text-center font-bold"
                 >
                   ✨ Đã đăng ký thành công! Kiểm tra email vào Thứ Hai tới nhé.
                 </motion.div>
               ) : (
                 <>
                   <input 
                     type="email" 
                     placeholder="Email của ba mẹ..."
                     className="flex-grow p-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-white"
                   />
                   <button 
                     onClick={() => setIsSubscribed(true)}
                     className="bg-white text-brand-600 px-8 py-5 rounded-2xl font-bold hover:bg-brand-50 transition-colors shadow-xl cursor-pointer"
                   >
                     Đăng ký
                   </button>
                 </>
               )}
            </div>
         </div>
         <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
