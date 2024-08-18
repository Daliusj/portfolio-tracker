import React from 'react'
import { Button, DarkThemeToggle, Flowbite } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logoPng from './logo.png'
import { HiSearch } from 'react-icons/hi'

export default function Header() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <div className="header mb-0 flex h-10 justify-between">
      <img src={logoPng} />
      <div className="flex justify-between">
        <Button>
          <HiSearch size={18} />
        </Button>
        {!isLoggedIn && (
          <Button as={Link} href="#" to={'/login'}>
            Login
          </Button>
        )}
        {!isLoggedIn && (
          <Button as={Link} href="#" to={'/signup'}>
            Signup
          </Button>
        )}
        {isLoggedIn && <Button onClick={logout}>Logout</Button>}
        <Flowbite>
          <DarkThemeToggle />
        </Flowbite>
      </div>
    </div>
  )
}
