import { useState, useRef, useEffect } from 'react'
import useAiChat from '../../hooks/useAiChat'

function ChatMessage({ message, onPageClick, onEdit, onRetry, isLoading }) {
  const isUser = message.role === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.content)
  const editRef = useRef(null)

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus()
      editRef.current.style.height = 'auto'
      editRef.current.style.height = editRef.current.scrollHeight + 'px'
    }
  }, [isEditing])

  const handleEditSubmit = () => {
    if (!editText.trim() || editText.trim() === message.content) {
      setIsEditing(false)
      return
    }
    onEdit(message.id, editText.trim())
    setIsEditing(false)
  }

  if (isUser && isEditing) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] w-full">
          <textarea
            ref={editRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSubmit() }
              if (e.key === 'Escape') setIsEditing(false)
            }}
            className="w-full bg-surface-container-low border border-primary/40 rounded-xl px-3 py-2 text-sm font-body text-on-surface resize-none outline-none focus:ring-2 focus:ring-primary"
            style={{ minHeight: '36px' }}
          />
          <div className="flex justify-end gap-1.5 mt-1">
            <button onClick={() => setIsEditing(false)} className="text-[10px] px-2 py-1 text-on-surface-variant hover:text-on-surface rounded transition-colors">
              Cancel
            </button>
            <button onClick={handleEditSubmit} className="text-[10px] px-2 py-1 bg-primary-container text-white rounded transition-colors hover:opacity-90">
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed relative ${
        isUser
          ? 'bg-primary-container text-white rounded-br-sm'
          : 'bg-surface-container text-on-surface rounded-bl-sm'
      }`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {message.streaming && (
          <span className="inline-block w-1.5 h-4 bg-current opacity-60 animate-pulse ml-0.5 align-middle" />
        )}
        {message.status === 'cancelled' && (
          <span className="block text-[10px] opacity-60 mt-1 italic">Generation stopped</span>
        )}
        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-outline-variant/20">
            {[...new Set(message.sources.map(s => s.pageNumber))].sort((a, b) => a - b).map(page => (
              <button
                key={page}
                onClick={() => onPageClick(page)}
                className="text-[10px] px-1.5 py-0.5 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors font-bold"
              >
                p.{page}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons (show on hover) */}
        {isUser && !isLoading && (
          <button
            onClick={() => { setEditText(message.content); setIsEditing(true) }}
            className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-on-surface-variant hover:text-on-surface rounded"
            title="Edit message"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        )}
        {!isUser && message.status === 'error' && (
          <button
            onClick={() => onRetry(message.id)}
            className="mt-1.5 text-[10px] px-2 py-1 bg-error/10 text-error rounded hover:bg-error/20 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[12px]">refresh</span>
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

function PremiumGate({ messagesUsed, messagesLimit, onUpgrade }) {
  return (
    <div className="p-4 text-center">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <span className="material-symbols-outlined text-amber-600 text-3xl mb-2">lock</span>
        <p className="text-sm font-bold text-amber-800 mb-1">Free Limit Reached</p>
        <p className="text-xs text-amber-700 mb-3">
          You've used {messagesUsed} of {messagesLimit} free messages this month.
        </p>
        <button
          onClick={onUpgrade}
          className="w-full px-4 py-2.5 bg-primary-container text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Upgrade to Premium
        </button>
        <p className="text-[10px] text-amber-600 mt-2">Unlimited AI chat + more features</p>
      </div>
    </div>
  )
}

export default function AiChatPanel({ topicId, onNavigateToPage }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const {
    messages, isLoading, error, aiStatus,
    sendMessage, stopGeneration, editMessage, retryMessage, clearConversation,
  } = useAiChat(topicId)
  const isPremium = aiStatus?.isPremium || false
  const messagesUsed = aiStatus?.messagesUsed || 0
  const messagesLimit = aiStatus?.messagesLimit || 5

  const isLimitReached = !isPremium && messagesUsed >= messagesLimit

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus()
  }, [isExpanded])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    if (isLimitReached) {
      setShowUpgrade(true)
      return
    }
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleUpgrade = () => {
    // Navigate to subscription page or open Paystack checkout
    window.open('/subscription', '_blank')
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary-container text-white rounded-full shadow-lg hover:shadow-xl hover:opacity-95 transition-all active:scale-95 group"
      >
        <span className="material-symbols-outlined text-xl">smart_toy</span>
        <span className="font-button text-sm">Ask AI</span>
        {!isPremium && messagesUsed > 0 && (
          <span className="text-[10px] opacity-75">{messagesLimit - messagesUsed} left</span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[520px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-lg">smart_toy</span>
          <div>
            <h3 className="font-h3 text-sm text-primary-container">
              AI Study Assistant
              {isPremium && (
                <span className="ml-1.5 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold align-middle">PRO</span>
              )}
            </h3>
            <span className="text-[10px] text-on-surface-variant">
              {aiStatus?.indexStatus === 'completed' ? `${aiStatus.totalChunks} chunks indexed`
                : aiStatus?.indexStatus === 'processing' ? 'Indexing...'
                : aiStatus?.indexStatus === 'not_indexed' ? 'Material not indexed'
                : 'Ready'}
              {!isPremium && (
                <span className="ml-1.5 text-on-surface-variant/60">
                  ({messagesUsed}/{messagesLimit} msgs)
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="p-1.5 text-on-surface-variant hover:text-error rounded transition-colors"
              title="Clear conversation"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded transition-colors"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !showUpgrade && (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-3 opacity-40">psychology</span>
            <p className="text-sm font-bold mb-1">Ask about your material</p>
            <p className="text-xs leading-relaxed max-w-[250px] mx-auto">
              Ask questions about the study material and get answers with page references.
            </p>
            <div className="mt-4 space-y-1.5">
              {['Summarize the key points', 'Explain the main cases cited', 'What are the time limits?'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="block w-full text-left text-xs px-3 py-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onPageClick={onNavigateToPage}
            onEdit={editMessage}
            onRetry={retryMessage}
            isLoading={isLoading}
          />
        ))}
        {error && (
          <div className="text-xs text-error bg-error-container/20 rounded-lg px-3 py-2 border border-error/20">
            {error}
          </div>
        )}
        {showUpgrade && isLimitReached && (
          <PremiumGate messagesUsed={messagesUsed} messagesLimit={messagesLimit} onUpgrade={handleUpgrade} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-outline-variant/30 flex-shrink-0">
        {isLimitReached ? (
          <button
            onClick={handleUpgrade}
            className="w-full py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            Upgrade to Premium
          </button>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-sm font-body text-on-surface resize-none outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 placeholder:text-on-surface-variant/50 max-h-20"
              style={{ minHeight: '36px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
              }}
            />
            {isLoading ? (
              <button
                onClick={stopGeneration}
                className="p-2 bg-error/90 text-white rounded-xl hover:bg-error transition-colors flex-shrink-0"
                title="Stop generation"
              >
                <span className="material-symbols-outlined text-lg">stop</span>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-primary-container text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
