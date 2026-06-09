import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'

export default function useAiChat(topicId) {
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!topicId) return
    api.get(`/ai/status/${topicId}`).then(res => {
      setAiStatus(res.data)
    }).catch(() => {
      setAiStatus({ available: false, apiKeyConfigured: false, indexStatus: 'error' })
    })
  }, [topicId])

  useEffect(() => {
    if (!topicId) return
    api.get(`/ai/conversations/${topicId}`).then(res => {
      const convos = res.data || []
      if (convos.length > 0) {
        const latest = convos[0]
        setConversationId(latest.id)
        api.get(`/ai/messages/${latest.id}`).then(msgRes => {
          setMessages((msgRes.data || []).map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.contextChunks ? JSON.parse(m.contextChunks) : [],
          })))
        }).catch(() => {})
      }
    }).catch(() => {})
  }, [topicId])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return
    setError(null)

    const userMsg = { id: `temp-${Date.now()}`, role: 'user', content: text, sources: [] }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const assistantMsg = { id: `stream-${Date.now()}`, role: 'assistant', content: '', sources: [], streaming: true }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, message: text, conversationId }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let finalSources = []
      let finalConvId = conversationId

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'content') {
              fullContent += data.content
              setMessages(prev => prev.map(m =>
                m.id === assistantMsg.id ? { ...m, content: fullContent } : m
              ))
            } else if (data.type === 'done') {
              finalSources = data.sources || []
              finalConvId = data.conversationId
            } else if (data.type === 'error') {
              throw new Error(data.message)
            }
          } catch (e) {
            if (e.message !== data?.message) { /* JSON parse error, ignore partial */ }
          }
        }
      }

      setMessages(prev => prev.map(m =>
        m.id === assistantMsg.id
          ? { ...m, content: fullContent, sources: finalSources, streaming: false }
          : m
      ))
      if (finalConvId) setConversationId(finalConvId)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
      setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [topicId, conversationId, isLoading])

  const clearConversation = useCallback(async () => {
    if (conversationId) {
      try {
        await api.delete(`/ai/conversations/${conversationId}`)
      } catch {}
    }
    setMessages([])
    setConversationId(null)
    setError(null)
  }, [conversationId])

  return {
    messages,
    conversationId,
    isLoading,
    error,
    aiStatus,
    sendMessage,
    clearConversation,
  }
}
