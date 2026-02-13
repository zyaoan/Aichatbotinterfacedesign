import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex gap-4 px-4 py-6 ${
        isUser ? 'bg-amber-100' : 'bg-amber-50'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                : 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white'
            }`}
          >
            {isUser ? <User size={18} /> : <Bot size={18} />}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="prose max-w-none">
            <p className="text-gray-900 leading-7 whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}