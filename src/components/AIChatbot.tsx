import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatWithBeeknoee } from '../lib/aiService';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, limit, deleteDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

const MODELS = [
  { id: 'glm-4.5-flash', name: 'GLM 4.5 Flash' },
  { id: 'glm-4.7-flash', name: 'GLM 4.7 Flash' },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B' },
  { id: 'qwen-3-235b-a22b-instruct-2507', name: 'Qwen 3 235B' }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showModels, setShowModels] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isMock } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Firebase
  useEffect(() => {
    if (!user || isMock || !isOpen) return;

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        role: doc.data().role as 'user' | 'assistant',
        content: doc.data().content
      }));
      if (history.length > 0) {
        setMessages(history);
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'chats'));

    return () => unsubscribe();
  }, [user, isMock, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatWithBeeknoee([...messages, userMessage], selectedModel);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result || 'Xin lỗi, tôi không nhận được phản hồi.'
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save to Firebase
      if (user && !isMock) {
        try {
          const batch = writeBatch(db);
          // Use auto-generated IDs
          const userMsgRef = doc(collection(db, 'chats'));
          const assistantMsgRef = doc(collection(db, 'chats'));
          
          batch.set(userMsgRef, {
            ...userMessage,
            userId: user.uid,
            createdAt: serverTimestamp()
          });
          
          batch.set(assistantMsgRef, {
            ...assistantMessage,
            userId: user.uid,
            createdAt: serverTimestamp()
          });
          
          await batch.commit();
        } catch (err) {
          console.error('Failed to save chat to Firebase:', err);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!user || isMock) {
      setMessages([]);
      return;
    }

    try {
      const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setMessages([]);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'chats');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-strong rounded-full animate-bounce flex items-center justify-center">
          <Sparkles size={14} />
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[600px] bg-white sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">PlayWise AI</h3>
                  <div className="relative">
                    <button 
                      onClick={() => setShowModels(!showModels)}
                      className="text-[10px] uppercase tracking-widest font-bold opacity-80 flex items-center gap-1 hover:opacity-100"
                    >
                      {MODELS.find(m => m.id === selectedModel)?.name}
                      <ChevronDown size={10} />
                    </button>
                    
                    {showModels && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-100 py-2 z-10 overflow-hidden">
                        {MODELS.map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id);
                              setShowModels(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors ${selectedModel === model.id ? 'bg-brand-50 text-brand-600 font-bold' : ''}`}
                          >
                            {model.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button 
                    onClick={clearChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                    title="Xóa cuộc trò chuyện"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10 italic text-slate-400">
                  <p>Chào ba mẹ! Con là trợ lý AI của PlayWise.</p>
                  <p className="text-sm mt-2">Ba mẹ cần tư vấn về đồ chơi hay sự phát triển của bé?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none animate-pulse">
                    Đang suy nghĩ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-slate-100 flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của ba mẹ..."
                className="flex-grow p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
