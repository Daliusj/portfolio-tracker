import React from 'react'
import { Toast } from 'flowbite-react'
import { useMessage } from '@/context/MessageContext'

export default function MessageToasts() {
  const { message } = useMessage()

  const getToastStyles = () => {
    if (message.type === 'success') return 'dark:bg-green-800 bg-green-800 shadow-md'
    if (message.type === 'warning') return 'dark:bg-orange-800 bg-orange-800 shadow-md'
    if (message.type === 'error') return 'dark:bg-red-900 bg-red-900 shadow-md'
  }

  return (
    <div data-testid={message.type === 'success' && 'successMessage'}>
      {message.text.length && (
        <Toast
          className={`min-w-96 flex-col gap-2 bg-slate-300 text-center shadow-none dark:bg-slate-800 ${getToastStyles()}`}
        >
          {message.text.map((text, index) => (
            <div key={index} className="y w-full text-sm font-normal">
              {text}
            </div>
          ))}
        </Toast>
      )}
    </div>
  )
}
