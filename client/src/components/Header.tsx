import React from 'react'
import { Button, DarkThemeToggle, Flowbite } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <div className="h-20">
      <Flowbite>
        <DarkThemeToggle />
      </Flowbite>
      <div className="flex space-x-6">
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
      </div>
    </div>
  )
}
