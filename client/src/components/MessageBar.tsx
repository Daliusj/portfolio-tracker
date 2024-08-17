import React from 'react'
import { Toast } from 'flowbite-react'
import { HiExclamation } from 'react-icons/hi'
import { useMessage } from '@/context/MessageContext'

export default function () {
  const { message } = useMessage()

  const getToastStyles = () => {
    if (message.type === 'success') return 'dark:bg-green-800 bg-green-800 '
    if (message.type === 'warning') return 'dark:bg-orange-800 bg-orange-800'
    if (message.type === 'error') return 'dark:bg-red-900 bg-red-900 '
  }

  return (
    <Toast className={`w-fit  ${getToastStyles()}`}>
      {message.type === 'error' && <HiExclamation className="h-5 w-5" />}
      {<div className="text-sm font-normal">{message.text}</div>}
    </Toast>
  )
}
