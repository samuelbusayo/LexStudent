import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'

interface AiStatus {
  available: boolean
  indexStatus: string
  totalChunks: number
  isPremium: boolean
  messagesUsed: number
  messagesLimit: number
}

interface Source {
  chunkId: number
  pageNumber: number
  snippet: string
}

interface Message {
  id: string | number
  role: 'user' | 'assistant'
  content: string
  sources: Source[]
  streaming?: boolean
  status?: string
}

export default function useAiChat(topicId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null)
  const [isLocalMode, setIsLocalMode] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef<string | null>(null)

  const getLocalToken = useCallback((): string | null => {
    return localStorage.getItem('auth_token') || null
  }, [])

  const getToken = useCallback(async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  }, [])

  const getFunctionUrl = useCallback((name: string): string => {
    const url = import.meta.env.VITE_SUPABASE_URL
    return `${url}/functions/v1/${name}`
  }, [])

  const getApiUrl = useCallback((path: string): string => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    return `${base}${path}`
  }, [])

  // Fetch AI status
  useEffect(() => {
    if (!topicId) return
    let cancelled = false

    ;(async () => {
      try {
        const token = await getToken()
        if (token) {
          const res = await fetch(`${getFunctionUrl('ai-status')}?topicId=${topicId}`, {
            headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
          })
          const data = await res.json()
          if (!cancelled) {
            setAiStatus(data)
            setIsLocalMode(false)
          }
          return
        }

        const localToken = getLocalToken()
        if (localToken) {
          const res = await fetch(getApiUrl(`/ai/status/${topicId}`), {
            headers: { Authorization: `Bearer ${localToken}` },
          })
          const data = await res.json()
          if (!cancelled) {
            setAiStatus(data)
            setIsLocalMode(true)
          }
          return
        }

        if (!cancelled) {
          setAiStatus({ available: false, indexStatus: 'not_indexed', totalChunks: 0, isPremium: false, messagesUsed: 0, messagesLimit: 5 })
        }
      } catch {
        if (!cancelled) setAiStatus({ available: false, indexStatus: 'error', totalChunks: 0, isPremium: false, messagesUsed: 0, messagesLimit: 5 })
      }
    })()

    return () => { cancelled = true }
  }, [topicId, getToken, getFunctionUrl, getLocalToken, getApiUrl])

  // Load existing conversation
  useEffect(() => {
    if (!topicId) return
    let cancelled = false

    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: convos } = await supabase
            .from('ai_conversations')
            .select('id, title, updated_at')
            .eq('topic_id', Number(topicId))
            .eq('user_id', session.user.id)
            .order('updated_at', { ascending: false })
            .limit(1)

          if (cancelled || !convos?.length) return

          const latest = convos[0]
          setConversationId(latest.id)

          const { data: msgs } = await supabase
            .from('ai_messages')
            .select('id, role, content, context_chunks, status')
            .eq('conversation_id', latest.id)
            .order('id', { ascending: true })

          if (cancelled || !msgs) return

          setMessages(msgs
            .filter((m: any) => m.status !== 'error' || m.role === 'user')
            .map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              sources: m.context_chunks || [],
              status: m.status,
              streaming: m.status === 'processing',
            }))
          )

          const processingMsg = msgs.find((m: any) => m.status === 'processing' && m.role === 'assistant')
          if (processingMsg) {
            pollForCompletion(processingMsg.id, latest.id)
          }
          return
        }

        const localToken = getLocalToken()
        if (localToken) {
          const convRes = await fetch(getApiUrl(`/ai/conversations/${topicId}`), {
            headers: { Authorization: `Bearer ${localToken}` },
          })
          const convos = await convRes.json()
          if (cancelled || !convos?.length) return

          const latest = convos[0]
          setConversationId(latest.id)

          const msgRes = await fetch(getApiUrl(`/ai/messages/${latest.id}`), {
            headers: { Authorization: `Bearer ${localToken}` },
          })
          const msgs = await msgRes.json()
          if (cancelled || !msgs) return

          setMessages(msgs.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.context_chunks ? JSON.parse(m.context_chunks) : [],
            status: 'completed',
            streaming: false,
          })))
        }
      } catch {}
    })()

    return () => { cancelled = true }
  }, [topicId, getLocalToken, getApiUrl])

  const pollForCompletion = useCallback(async (messageId: number, convId: number) => {
    setIsLoading(true)
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000))
      const { data: msg } = await supabase
        .from('ai_messages')
        .select('id, content, context_chunks, status')
        .eq('id', messageId)
        .single()

      if (!msg) break
      if (msg.status === 'completed' || msg.status === 'cancelled') {
        setMessages(prev => prev.map(m =>
          m.id === messageId ? { ...m, content: msg.content, sources: msg.context_chunks || [], streaming: false, status: msg.status } : m
        ))
        setConversationId(convId)
        setIsLoading(false)
        return
      }
      if (msg.status === 'error') {
        setError('Request failed')
        setMessages(prev => prev.filter(m => m.id !== messageId))
        setIsLoading(false)
        return
      }
    }
    setIsLoading(false)
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    setError(null)

    const token = await getToken()
    const localToken = getLocalToken()
    const authToken = token || localToken

    if (!authToken) { setError('Please sign in to use AI chat'); return }

    const usingLocal = !token && !!localToken
    setIsLocalMode(usingLocal)

    const requestId = crypto.randomUUID()
    requestIdRef.current = requestId

    const userMsg: Message = { id: `temp-${Date.now()}`, role: 'user', content: text, sources: [] }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const assistantMsg: Message = { id: `stream-${Date.now()}`, role: 'assistant', content: '', sources: [], streaming: true }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const controller = new AbortController()
      abortRef.current = controller

      let response
      if (usingLocal) {
        response = await fetch(getApiUrl('/ai/chat'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localToken}`,
          },
          body: JSON.stringify({ topicId, message: text, conversationId }),
          signal: controller.signal,
        })
      } else {
        response = await fetch(getFunctionUrl('ai-chat'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ topicId, message: text, conversationId, requestId }),
          signal: controller.signal,
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(errData.error || 'Request failed')
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let finalSources: Source[] = []
      let finalConvId = conversationId
      let finalMsgId: number | null = null

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
              finalMsgId = data.messageId
            } else if (data.type === 'cancelled') {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsg.id
                  ? { ...m, content: (data.content || fullContent) + '\n\n_(Generation stopped)_', sources: [], streaming: false, status: 'cancelled' }
                  : m
              ))
              return
            } else if (data.type === 'error') {
              throw new Error(data.message)
            }
          } catch (e: any) {
            if (!(e instanceof SyntaxError)) throw e
          }
        }
      }

      setMessages(prev => prev.map(m =>
        m.id === assistantMsg.id
          ? { ...m, id: finalMsgId || m.id, content: fullContent, sources: finalSources, streaming: false, status: 'completed' }
          : m
      ))
      if (finalConvId) setConversationId(finalConvId)
      if (aiStatus && !usingLocal) setAiStatus(prev => prev ? { ...prev, messagesUsed: (prev.messagesUsed || 0) + 1 } : prev)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (!usingLocal) {
          setMessages(prev => prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: m.content || 'Processing...', streaming: true } : m
          ))
          return
        }
        setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
      } else {
        setError(err.message)
        setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
      requestIdRef.current = null
    }
  }, [topicId, conversationId, isLoading, getToken, getLocalToken, getFunctionUrl, getApiUrl, aiStatus])

  const stopGeneration = useCallback(async () => {
    const requestId = requestIdRef.current
    if (!requestId) return
    try {
      const token = await getToken()
      if (token) {
        await fetch(getFunctionUrl('ai-cancel'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
          body: JSON.stringify({ requestId }),
        })
      }
      if (abortRef.current) abortRef.current.abort()
    } catch (e: any) {
      console.error('[useAiChat] Stop failed:', e.message)
    }
  }, [getToken, getFunctionUrl])

  const editMessage = useCallback(async (messageId: string | number, newContent: string) => {
    if (isLoading || !newContent.trim()) return
    const msgIndex = messages.findIndex(m => m.id === messageId)
    if (msgIndex === -1) return

    const removedMessages = messages.slice(msgIndex)
    setMessages(prev => prev.slice(0, msgIndex))

    for (const msg of removedMessages) {
      if (typeof msg.id === 'number') {
        if (isLocalMode) {
          const localToken = getLocalToken()
          if (localToken) {
            await fetch(getApiUrl(`/ai/messages/${msg.id}`), {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localToken}` },
            })
          }
        } else {
          await supabase.from('ai_messages').delete().eq('id', msg.id)
        }
      }
    }
    await sendMessage(newContent)
  }, [messages, isLoading, sendMessage, isLocalMode, getLocalToken, getApiUrl])

  const retryMessage = useCallback(async (messageId: string | number) => {
    const msgIndex = messages.findIndex(m => m.id === messageId)
    if (msgIndex === -1) return

    let userMsg: Message | null = null
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { userMsg = messages[i]; break }
    }
    if (!userMsg) return

    setMessages(prev => prev.filter(m => m.id !== messageId))
    if (typeof messageId === 'number') {
      if (isLocalMode) {
        const localToken = getLocalToken()
        if (localToken) {
          await fetch(getApiUrl(`/ai/messages/${messageId}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localToken}` },
          })
        }
      } else {
        await supabase.from('ai_messages').delete().eq('id', messageId)
      }
    }
    await sendMessage(userMsg.content)
  }, [messages, sendMessage, isLocalMode, getLocalToken, getApiUrl])

  const clearConversation = useCallback(async () => {
    if (conversationId) {
      try {
        if (isLocalMode) {
          const localToken = getLocalToken()
          if (localToken) {
            await fetch(getApiUrl(`/ai/conversations/${conversationId}`), {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localToken}` },
            })
          }
        } else {
          await supabase.from('ai_messages').delete().eq('conversation_id', conversationId)
          await supabase.from('ai_conversations').delete().eq('id', conversationId)
        }
      } catch {}
    }
    setMessages([])
    setConversationId(null)
    setError(null)
  }, [conversationId, isLocalMode, getLocalToken, getApiUrl])

  return { messages, conversationId, isLoading, error, aiStatus, sendMessage, stopGeneration, editMessage, retryMessage, clearConversation }
}
