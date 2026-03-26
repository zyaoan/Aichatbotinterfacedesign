# LLM Model Selection Feature

The ECEasy frontend now includes a built-in LLM model selector that allows users to switch between different AI models in real-time.

## Available Models

### 1. OpenAI (GPT-4)
- **Icon**: ⚡ Lightning bolt
- **Color**: Green
- **Description**: Most capable
- **Use Case**: Best for complex queries requiring deep reasoning

### 2. DeepSeek
- **Icon**: 🤖 Bot
- **Color**: Blue
- **Description**: Fast and efficient
- **Use Case**: Quick responses, good balance of speed and quality

### 3. Ollama (Local)
- **Icon**: 🖥️ Server
- **Color**: Purple
- **Description**: Local deployment
- **Use Case**: Privacy-focused, runs locally without external API calls

## UI Location

The model selector is located in the **top-right corner** of the chat interface header, next to the connection status indicator.

## How It Works

### User Flow
```
1. User clicks model selector dropdown
   ↓
2. Dropdown menu opens showing all available models
   ↓
3. User selects preferred model
   ↓
4. Selected model is highlighted with checkmark
   ↓
5. All subsequent messages use selected model
```

### Technical Flow
```
Frontend (ChatPage)
   ↓
selectedModel state updated
   ↓
apiService.sendMessage({ model: selectedModel })
   ↓
Backend receives model preference
   ↓
Routes request to appropriate LLM
   ↓
Response streamed back to frontend
```

## Backend Integration

### Request Format

When a message is sent, the frontend includes the model parameter:

```typescript
POST /chat
Content-Type: multipart/form-data

{
  message: "What are the ECE course prerequisites?",
  session_id: "abc-123",
  model: "openai" | "deepseek" | "ollama",
  files: [...]
}
```

### Backend Implementation

Your FastAPI backend should handle the model parameter:

```python
from fastapi import FastAPI, Form
from typing import Optional

@app.post("/chat")
async def chat(
    message: str = Form(...),
    session_id: Optional[str] = Form(None),
    model: Optional[str] = Form("openai")  # Default to OpenAI
):
    # Route to appropriate LLM based on model parameter
    if model == "openai":
        response = await openai_client.generate(message)
    elif model == "deepseek":
        response = await deepseek_client.generate(message)
    elif model == "ollama":
        response = await ollama_client.generate(message)
    
    return response
```

## Configuration

### Default Model

Set the default model in `ChatPage.tsx`:

```typescript
const [selectedModel, setSelectedModel] = useState<ModelType>('openai'); // Default
```

### Adding New Models

To add a new model option:

1. Update the type definition:
```typescript
type ModelType = 'openai' | 'deepseek' | 'ollama' | 'your-model';
```

2. Add model option in `ModelSelector.tsx`:
```typescript
const modelOptions: ModelOption[] = [
  // ... existing models
  {
    id: 'your-model',
    name: 'Your Model',
    icon: <YourIcon size={16} />,
    description: 'Your model description',
    color: 'text-your-color',
  },
];
```

3. Update backend to handle the new model

## Styling Customization

### Change Model Colors

In `ModelSelector.tsx`, update the color for each model:

```typescript
{
  id: 'openai',
  name: 'OpenAI',
  icon: <Zap size={16} />,
  description: 'GPT-4 - Most capable',
  color: 'text-green-600',  // Change this
}
```

### Change Icons

Replace icons from `lucide-react`:

```typescript
import { Zap, Bot, Server, YourIcon } from 'lucide-react';
```

## User Experience

### Visual Feedback

- **Selected model** shows checkmark indicator
- **Hover state** highlights option with amber background
- **Current model** displayed in header button
- **Dropdown closes** automatically after selection

### Accessibility

- Keyboard navigation supported
- Screen reader friendly
- Clear visual indicators
- Descriptive hover titles

## Model Persistence

Currently, model selection is **per-session** (not persisted across page reloads).

### To Add Persistence

Add localStorage support in `ChatPage.tsx`:

```typescript
// Load from localStorage
const [selectedModel, setSelectedModel] = useState<ModelType>(() => {
  const saved = localStorage.getItem('selectedModel');
  return (saved as ModelType) || 'openai';
});

// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('selectedModel', selectedModel);
}, [selectedModel]);
```

## Testing

### Frontend Testing

1. Click model selector in header
2. Verify dropdown opens
3. Select each model
4. Check visual feedback (checkmark)
5. Verify button updates to show selected model

### Backend Testing

Test that model parameter is received:

```bash
curl -X POST http://localhost:8000/chat \
  -F "message=Test message" \
  -F "model=deepseek"
```

Check backend logs to confirm model parameter is parsed correctly.

## Troubleshooting

### Model Not Changing

**Problem**: Selected model doesn't affect responses

**Solution**:
1. Check browser console for errors
2. Verify backend receives `model` parameter
3. Check backend routing logic for different models
4. Ensure backend has credentials/access for all models

### Dropdown Not Opening

**Problem**: Click doesn't open dropdown

**Solution**:
1. Check for JavaScript errors in console
2. Verify z-index isn't causing overlay issues
3. Test in different browsers

### Model Not Showing in Request

**Problem**: Backend doesn't receive model parameter

**Solution**:
1. Check `apiService.sendMessage()` includes model
2. Verify FormData appends model correctly
3. Check backend endpoint accepts model parameter

## Best Practices

### Model Selection UX

1. **Default to most capable**: Start with OpenAI for best experience
2. **Show descriptions**: Help users understand model differences
3. **Visual distinction**: Use colors/icons to differentiate models
4. **Preserve selection**: Remember choice during session

### Backend Implementation

1. **Graceful fallback**: If model unavailable, fallback to default
2. **Validate model**: Check model parameter is valid
3. **Error handling**: Return clear errors if model fails
4. **Logging**: Log which model handles each request

## Future Enhancements

### Planned Features

- [ ] Model-specific settings (temperature, max tokens)
- [ ] Cost estimation per model
- [ ] Performance metrics (response time)
- [ ] Model availability indicators
- [ ] Per-conversation model memory
- [ ] Model comparison mode

### Advanced Options

- **Custom parameters**: Allow temperature/token adjustments
- **Model presets**: Save preferred configurations
- **Auto-selection**: Choose model based on query type
- **Fallback chain**: Try alternate model if primary fails

## Examples

### Basic Usage

```typescript
// User selects DeepSeek model
setSelectedModel('deepseek');

// Message sent with model parameter
await apiService.sendMessage({
  message: "Explain RAG architecture",
  model: 'deepseek',  // ← Model parameter included
  sessionId: currentSessionId
});
```

### With Error Handling

```typescript
try {
  await apiService.sendMessage({
    message: userInput,
    model: selectedModel,
  });
} catch (error) {
  if (error.message.includes('model not available')) {
    // Fallback to default model
    setSelectedModel('openai');
    toast.error('Selected model unavailable, switching to OpenAI');
  }
}
```

## Summary

The LLM model selector provides:

✅ **User choice** - Switch between models easily  
✅ **Visual feedback** - Clear indication of selected model  
✅ **Backend integration** - Model parameter sent with requests  
✅ **Extensible** - Easy to add new models  
✅ **Accessible** - Keyboard and screen reader support  
✅ **Professional UI** - Matches ECEasy design system  

The feature is fully integrated and ready to use with the ECEasy backend!
