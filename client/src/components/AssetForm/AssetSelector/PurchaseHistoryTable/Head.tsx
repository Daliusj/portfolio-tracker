import { Table } from 'flowbite-react'
import React from 'react'

export default function PurchaseTableHead() {
  return (
    <Table.Head>
      <Table.HeadCell>Purchase Date</Table.HeadCell>
      <Table.HeadCell>Quantity</Table.HeadCell>
      <Table.HeadCell>Purchase Price</Table.HeadCell>
    </Table.Head>
  )
}
