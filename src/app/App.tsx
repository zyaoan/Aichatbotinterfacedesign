import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { Menu } from 'lucide-react';
import logo from 'figma:asset/dfe81da5e0aedbd29345b7e3003def48603b40a7.png';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet?: string;
  }>;
  relatedQuestions?: string[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm an AI assistant. How can I help you today?",
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: \"${content}\"\n\nThis is a demo interface, so I'm providing a mock response. In a real implementation, this would be connected to an AI model API to generate intelligent responses based on your input.`,
        sources: [
          {
            title: 'Example Source 1 - Documentation',
            url: 'https://example.com/doc1',
            snippet: 'This is a relevant snippet from the first source that provides context...',
          },
          {
            title: 'Example Source 2 - Research Paper',
            url: 'https://example.com/doc2',
            snippet: 'Additional information from academic research on this topic...',
          },
          {
            title: 'Example Source 3 - Tutorial',
            url: 'https://example.com/doc3',
          },
        ],
        relatedQuestions: [
          'How does this concept apply to real-world scenarios?',
          'What are the best practices for implementation?',
          'Can you explain the differences between similar approaches?',
          'What are common pitfalls to avoid?',
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm an AI assistant. How can I help you today?",
      },
    ]);
    setCurrentChatId(Date.now().toString());
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, you would load the messages for the selected chat
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `This is the chat history for conversation ${chatId}. In a real implementation, messages would be loaded from storage.`,
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-amber-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col relative transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header with toggle button */}
        <div className="border-b border-amber-200 bg-white/95 backdrop-blur-sm">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            {/* Left: Logo and Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
                title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              >
                <Menu size={20} />
              </button>
              <img src={logo} alt="ECEasy" className="h-12" />
            </div>

            {/* Center: App Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold">
                <span style={{ color: '#1e3a8a' }}>EC</span>
                <span style={{ color: '#3b82f6' }}>Easy</span>
              </h1>
            </div>

            {/* Right: Spacer for balance */}
            <div className="w-[88px]"></div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-amber-50">
          <div className="min-h-full flex flex-col">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                sources={message.sources}
                relatedQuestions={message.relatedQuestions}
                onQuestionClick={handleSendMessage}
              />
            ))}
            {isLoading && (
              <div className="flex gap-4 px-4 py-6 bg-white">
                <div className="max-w-4xl mx-auto w-full flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}