import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import { Menu } from 'lucide-react';
import logo from '../../imports/logo_noname_(1).svg';
import { apiService, StreamChunk } from '../../services/api.service';

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
  isStreaming?: boolean;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm ECEasy, your AI assistant for ECE students. How can I help you today?",
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create placeholder for assistant response
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Send message to API with streaming
      await apiService.sendMessage(
        {
          message: content,
          sessionId: sessionId,
          files: files,
        },
        (chunk: StreamChunk) => {
          // Update the assistant message based on chunk type
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantId) return msg;

              const updated = { ...msg };

              if (chunk.type === 'text' && chunk.content) {
                updated.content += chunk.content;
              } else if (chunk.type === 'sources' && chunk.sources) {
                updated.sources = chunk.sources.map((src) => ({
                  title: src.title,
                  url: src.metadata?.source || '#',
                  snippet: src.content,
                }));
              } else if (chunk.type === 'related' && chunk.relatedQuestions) {
                updated.relatedQuestions = chunk.relatedQuestions;
              } else if (chunk.type === 'done') {
                updated.isStreaming = false;
              }

              return updated;
            })
          );
        }
      );

      setIsLoading(false);
      abortControllerRef.current = null;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update assistant message with error
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== assistantId) return msg;
          return {
            ...msg,
            content: 'Sorry, I encountered an error while processing your request. Please make sure the backend server is running and try again.',
            isStreaming: false,
          };
        })
      );
      
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      
      // Mark the last streaming message as complete
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.isStreaming) {
            return { ...msg, isStreaming: false };
          }
          return msg;
        })
      );
    }
  };

  const handleNewChat = async () => {
    try {
      // Create new session on backend
      const { sessionId: newSessionId } = await apiService.createSession();
      setSessionId(newSessionId);
      
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Hello! I'm ECEasy, your AI assistant for ECE students. How can I help you today?",
        },
      ]);
      setCurrentChatId(newSessionId);
    } catch (error) {
      console.error('Error creating new chat:', error);
      
      // Fallback to local-only new chat
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Hello! I'm ECEasy, your AI assistant for ECE students. How can I help you today?",
        },
      ]);
      setCurrentChatId(Date.now().toString());
      setSessionId(undefined);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    setSessionId(chatId);
    
    try {
      // Load chat history from backend
      const history = await apiService.getChatHistory(chatId);
      const loadedMessages: Message[] = history.map((msg, idx) => ({
        id: `${chatId}-${idx}`,
        role: msg.role,
        content: msg.content,
        sources: msg.sources?.map((src) => ({
          title: src.title,
          url: src.metadata?.source || '#',
          snippet: src.content,
        })),
        relatedQuestions: msg.relatedQuestions,
      }));
      
      setMessages(loadedMessages.length > 0 ? loadedMessages : [
        {
          id: '1',
          role: 'assistant',
          content: "Hello! I'm ECEasy, your AI assistant for ECE students. How can I help you today?",
        },
      ]);
    } catch (error) {
      console.error('Error loading chat history:', error);
      
      // Fallback message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Unable to load chat history. Please make sure the backend server is running.`,
        },
      ]);
    }
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
              {/* Logo placeholder - Replace with your logo.png */}
              <img className="h-12 w-12" src={logo} alt="Logo" />
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
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading}
          isLoading={isLoading}
          onStopGeneration={handleStopGeneration}
        />
      </div>
    </div>
  );
}