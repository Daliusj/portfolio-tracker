import React from 'react'
import { Button, DarkThemeToggle, Flowbite } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logoPng from './logo.png'
import { useLocation } from 'react-router-dom'

const LOGIN_URL = '/login'
const SIGNUP_URL = '/signup'

export default function Header() {
  const { isLoggedIn, logout } = useAuth()

  const location = useLocation()

  const getBtnStyles = (btnLink: string) => {
    return `text-slate-900 dark:text-slate-300 ${location.pathname === btnLink && 'bg-slate-100 dark:bg-slate-700'}`
  }

  return (
    <div className="mb-0 flex h-10 justify-between">
      <img src={logoPng} />
      <div className="flex justify-between ">
        {!isLoggedIn && (
          <Button as={Link} href="#" to={LOGIN_URL} className={getBtnStyles(LOGIN_URL)}>
            Login
          </Button>
        )}
        {!isLoggedIn && (
          <Button as={Link} href="#" to={SIGNUP_URL} className={getBtnStyles(SIGNUP_URL)}>
            Signup
          </Button>
        )}
        {isLoggedIn && (
          <Button onClick={logout} className="text-slate-900 dark:text-slate-300">
            Logout
          </Button>
        )}
        <Flowbite>
          <DarkThemeToggle />
        </Flowbite>
      </div>
    </div>
  )
}
