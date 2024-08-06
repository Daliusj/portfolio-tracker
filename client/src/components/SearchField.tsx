import React from 'react'
import { TextInput } from 'flowbite-react'
import { HiSearch } from 'react-icons/hi'

export default function () {
  return (
    <div className="mx-auto flex max-w-md items-center">
      <div className="relative w-full">
        <TextInput icon={HiSearch} type="search" placeholder="Search..." className="w-full pl-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
      </div>
    </div>
  )
}
