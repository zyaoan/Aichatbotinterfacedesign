import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { Menu } from 'lucide-react';
import logo from '../assets/dfe81da5e0aedbd29345b7e3003def48603b40a7.png';
import { nanoid } from 'nanoid';
import { parseStreaming } from './utils/parse-streaming';
import type { Source, Relate } from './utils/parse-streaming';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  relates?: Relate[] | null;
  isStreaming?: boolean;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm ECEasy, your HKUST ECE assistant. How can I help you today?",
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Keep a ref to the active AbortController so we can cancel if needed
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
    };

    // Add a placeholder assistant message that will be updated as tokens arrive
    const assistantId = nanoid();
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      sources: [],
      relates: null,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setIsLoading(true);

    const searchUuid = nanoid();

    try {
      await parseStreaming(
        controller,
        content,
        searchUuid,
        // onSources — called once the sources JSON is received
        (sources) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, sources } : m))
          );
        },
        // onMarkdown — called on every new chunk of LLM text
        (markdown) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: markdown } : m))
          );
          scrollToBottom();
        },
        // onRelates — called once the stream finishes
        (relates) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, relates, isStreaming: false } : m
            )
          );
          setIsLoading(false);
        },
        // onError
        (status) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      status === 429
                        ? 'Sorry, too many requests. Please try again later.'
                        : `Sorry, an error occurred (HTTP ${status}). Please try again.`,
                    isStreaming: false,
                  }
                : m
            )
          );
          setIsLoading(false);
        },
      );
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Sorry, something went wrong. Please try again.', isStreaming: false }
              : m
          )
        );
        setIsLoading(false);
      }
    }
  };

  const handleNewChat = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setMessages([
      {
        id: nanoid(),
        role: 'assistant',
        content: "Hello! I'm ECEasy, your HKUST ECE assistant. How can I help you today?",
      },
    ]);
    setCurrentChatId(nanoid());
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // Sidebar history is a future feature — for now just acknowledge selection
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
        {/* Header */}
        <div className="border-b border-amber-200 bg-white/95 backdrop-blur-sm">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            {/* Left: Toggle + Logo */}
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

            {/* Centre: App Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold">
                <span style={{ color: '#1e3a8a' }}>EC</span>
                <span style={{ color: '#3b82f6' }}>Easy</span>
              </h1>
            </div>

            {/* Right: balance spacer */}
            <div className="w-[88px]" />
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
                relates={message.relates}
                isStreaming={message.isStreaming}
                onRelatedQuestion={(q) => handleSendMessage(q)}
              />
            ))}

            {/* Initial loading indicator (before first token arrives) */}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-4 px-4 py-6 bg-amber-50">
                <div className="max-w-4xl mx-auto w-full flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-500">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-3">
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


