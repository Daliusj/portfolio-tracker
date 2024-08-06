import { useAuth } from '@/context/AuthContext'
import { Label, TextInput, Checkbox, Button } from 'flowbite-react'
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
    try {
      await login({ email, password })
    } catch {}
  }

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup({ email, userName, password })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <form className="flex max-w-md flex-col gap-4">
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
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree" className="flex">
              I agree with the&nbsp;
              <Link className="text-cyan-600 hover:underline dark:text-cyan-500" to={''}>
                terms and conditions
              </Link>
            </Label>
          </div>
        </div>
      )}
      <Button onClick={type === 'login' ? submitLogin : submitSignup} type="submit">
        {type === 'login' ? SUBMIT_BUTTON_LABEL.login : SUBMIT_BUTTON_LABEL.signup}
      </Button>
    </form>
  )
}
