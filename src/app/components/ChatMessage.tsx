import { Bot, User, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet?: string;
  }>;
  relatedQuestions?: string[];
  onQuestionClick?: (question: string) => void;
}

export function ChatMessage({ role, content, sources, relatedQuestions, onQuestionClick }: ChatMessageProps) {
  const isUser = role === 'user';
  const [showSources, setShowSources] = useState(false);

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

          {/* Cited Sources */}
          {sources && sources.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
              >
                {showSources ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{sources.length} {sources.length === 1 ? 'Source' : 'Sources'}</span>
              </button>

              {showSources && (
                <div className="mt-3 space-y-2">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                              {index + 1}. {source.title}
                            </span>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-amber-600" />
                          </div>
                          {source.snippet && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {source.snippet}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Related Questions */}
          {relatedQuestions && relatedQuestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Related questions:</p>
              <div className="space-y-2">
                {relatedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(question)}
                    className="block w-full text-left p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-sm text-gray-700 hover:text-amber-800"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}