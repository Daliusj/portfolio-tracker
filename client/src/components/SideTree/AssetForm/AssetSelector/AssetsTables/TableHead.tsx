import { Table } from 'flowbite-react'
import React from 'react'

export default function () {
  return (
    <Table.Head>
      <Table.HeadCell>Name</Table.HeadCell>
      <Table.HeadCell>Type</Table.HeadCell>
      <Table.HeadCell>Price</Table.HeadCell>
      <Table.HeadCell>Exchange</Table.HeadCell>
    </Table.Head>
  )
}
