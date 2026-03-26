import { Bot, Zap, Server } from 'lucide-react';
import { useState } from 'react';

type ModelType = 'openai' | 'deepseek' | 'ollama';

interface ModelOption {
  id: ModelType;
  name: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const modelOptions: ModelOption[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <Zap size={16} />,
    description: 'GPT-4 - Most capable',
    color: 'text-green-600',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: <Bot size={16} />,
    description: 'Fast and efficient',
    color: 'text-blue-600',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: <Server size={16} />,
    description: 'Local deployment',
    color: 'text-purple-600',
  },
];

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = modelOptions.find((m) => m.id === selectedModel) || modelOptions[0];

  return (
    <div className="relative">
      {/* Selected Model Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 transition-colors text-sm"
        title="Select AI Model"
      >
        <span className={currentModel.color}>{currentModel.icon}</span>
        <span className="font-medium text-gray-700">{currentModel.name}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-amber-200 z-20 overflow-hidden">
            <div className="p-2 border-b border-amber-100 bg-amber-50">
              <p className="text-xs text-gray-600 font-medium">Select AI Model</p>
            </div>
            <div className="py-1">
              {modelOptions.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left ${
                    selectedModel === model.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <span className={`mt-0.5 ${model.color}`}>{model.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{model.name}</span>
                      {selectedModel === model.id && (
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{model.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-amber-100 bg-amber-50">
              <p className="text-xs text-gray-500">
                Model selection is sent to the backend for processing
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
