import { Table } from 'flowbite-react'
import React from 'react'

export default function () {
  return (
    <Table.Head>
      <Table.HeadCell>Name</Table.HeadCell>
      <Table.HeadCell>Amount</Table.HeadCell>
      <Table.HeadCell>Avg. Buy Price</Table.HeadCell>
      <Table.HeadCell>Allocation</Table.HeadCell>
      <Table.HeadCell>Price</Table.HeadCell>
      <Table.HeadCell>Total</Table.HeadCell>
      <Table.HeadCell>P/L</Table.HeadCell>
    </Table.Head>
  )
}
