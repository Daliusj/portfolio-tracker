import React from 'react'
import { Toast } from 'flowbite-react'
import { useMessage } from '@/context/MessageContext'

export default function MessageToasts() {
  const { message } = useMessage()

  const getToastStyles = () => {
    if (message.type === 'success') return 'dark:bg-green-800 bg-green-800'
    if (message.type === 'warning') return 'dark:bg-orange-800 bg-orange-800'
    if (message.type === 'error') return 'dark:bg-red-900 bg-red-900'
  }

  return (
    <Toast className={`min-h-5 min-w-96 flex-col gap-2 text-center ${getToastStyles()}`}>
      {message.text.map((text, index) => (
        <div key={index} className="y w-full text-sm font-normal">
          {text}
        </div>
      ))}
    </Toast>
  )
}
