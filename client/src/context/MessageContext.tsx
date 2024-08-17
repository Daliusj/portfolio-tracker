import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'

type MessageType = 'success' | 'warning' | 'error' | ''
interface Message {
  type: MessageType
  text: string
}

type MessageContextType = {
  message: Message
  setMessage: (type: MessageType, text: string) => void
  clearMessage: () => void
}

type MessageProviderProps = {
  children: ReactNode
}

const defaultMessageContext: MessageContextType = {
  message: { type: '', text: '' },
  setMessage: () => {
    throw new Error('setMessage function not initialized')
  },
  clearMessage: () => {
    throw new Error('clearMessage function not initialized')
  },
}

const MessageContext = createContext<MessageContextType>(defaultMessageContext)

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [message, setMessageState] = useState<Message>({ type: '', text: '' })
  let timerRef: number | null = null

  const setMessage = (type: MessageType, text: string) => {
    let timeout = 0

    switch (type) {
      case 'warning':
      case 'success':
        timeout = 10000 // 10 seconds
        break
      case 'error':
        timeout = 0 // Error messages persist until manually cleared
        break
      default:
        timeout = 10000 // Default to 10 seconds
    }

    setMessageState({ type, text })

    if (timerRef) {
      clearTimeout(timerRef)
    }

    if (timeout > 0) {
      timerRef = window.setTimeout(() => {
        clearMessage()
      }, timeout)
    }
  }

  const clearMessage = () => {
    setMessageState({ type: '', text: '' })
    if (timerRef) {
      clearTimeout(timerRef)
      timerRef = null
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef) {
        clearTimeout(timerRef)
      }
    }
  }, [])

  return (
    <MessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  return useContext(MessageContext)
}
