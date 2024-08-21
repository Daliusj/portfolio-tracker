import { useAuth } from '@/context/AuthContext'
import { Label, TextInput, Button } from 'flowbite-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SUBMIT_BUTTON_LABEL = { login: 'Login', signup: 'Signup' }

type UserFormProps = {
  type: 'login' | 'signup'
}

export function UserForm({ type }: UserFormProps) {
  const { login, signup } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [userName, setUserName] = useState('')

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) await login({ email, password })
  }

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && password === repeatPassword && userName)
      await signup({ email, userName, password })
  }

  return (
    <form className="flex max-w-md flex-col">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2" value="Your email" />
        </div>
        <TextInput
          id="email2"
          type="email"
          placeholder="name@flowbite.com"
          required
          shadow
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="mt-1 h-8 text-xs text-red-600">{!email && 'Enter your Email'}</p>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password2" value="Your password" />
        </div>
        <TextInput
          id="password2"
          type="password"
          required
          shadow
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="mt-1 h-8 text-xs text-red-600">{!password && 'Enter your Password'}</p>
      </div>
      {type === 'signup' && (
        <div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="repeat-password" value="Repeat password" />
            </div>
            <TextInput
              id="repeat-password"
              type="password"
              required
              shadow
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <p className="mt-1 h-8 text-xs text-red-600">
              {!repeatPassword && 'Repeat your Password'}
              {repeatPassword && repeatPassword !== password && 'Your password does not match'}
            </p>

            <div className="mb-2 block">
              <Label htmlFor="user-name" value="User name" />
            </div>
            <TextInput
              id="user-name"
              type="text"
              required
              shadow
              onChange={(e) => setUserName(e.target.value)}
            />
            <p className="mt-1 h-8 text-xs text-red-600">{!userName && 'Enter your User Name'}</p>
          </div>
        </div>
      )}
      <Button
        className="my-6 bg-orange-600"
        onClick={type === 'login' ? submitLogin : submitSignup}
        type="submit"
      >
        {type === 'login' ? SUBMIT_BUTTON_LABEL.login : SUBMIT_BUTTON_LABEL.signup}
      </Button>
      <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-gray-300">
        {type === 'login' ? 'Not registered?' : 'Have an account?'}
        <Link
          className="text-cyan-700 hover:underline dark:text-cyan-500"
          to={type === 'login' ? '/signup' : '/login'}
        >
          {type === 'login' ? 'Create account' : 'Login'}
        </Link>
      </div>
    </form>
  )
}
