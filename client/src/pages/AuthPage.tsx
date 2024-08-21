import React from 'react'
import { UserForm } from '@/components/UserForm'

type AuthPageProps = {
  mode: 'login' | 'signup'
}

export default function Login({ mode }: AuthPageProps) {
  return (
    <div className="flex justify-center">
      <UserForm key={mode} type={mode} />
    </div>
  )
}
