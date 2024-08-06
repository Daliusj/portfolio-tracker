import { Dropdown } from 'flowbite-react'
import Chart from './Chart'
import React from 'react'

export default function ChartBox() {
  return (
    <div>
      <div className="flex w-full space-x-80 ">
        <div>
          <div>Portfolio balance</div>
          <div className="flex">
            <div>$8000.34</div>
            <div className="pl-2">+511.56 (8.74%) 24h</div>
          </div>
        </div>
        <div>
          <Dropdown label="Dropdown button" dismissOnClick={false}>
            <Dropdown.Item>Week</Dropdown.Item>
            <Dropdown.Item>Month</Dropdown.Item>
            <Dropdown.Item>Year</Dropdown.Item>
            <Dropdown.Item>3 Year</Dropdown.Item>
            <Dropdown.Item>5 Year</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <Chart />
    </div>
  )
}
