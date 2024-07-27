import { DarkThemeToggle, Flowbite } from 'flowbite-react'

export default function Header() {
  return (
    <div className="h-20">
      <Flowbite>
        <DarkThemeToggle />
      </Flowbite>
    </div>
  )
}
