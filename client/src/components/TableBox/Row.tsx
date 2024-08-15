import { Table } from 'flowbite-react'
import React, { useId } from 'react'
import { PortfolioStatsPublic } from '@server/shared/types'
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from 'react-icons/hi'
import getSymbolFromCurrency from 'currency-symbol-map'
import { usePortfolio } from '@/context/PortfolioContext'

type TableRowProps = {
  asset: PortfolioStatsPublic
}
export default function ({ asset }: TableRowProps) {
  const cellStyles = 'font-small whitespace-no-wrap items-center text-gray-900 dark:text-white'
  const { activePortfolio } = usePortfolio()

  return (
    <Table.Row className={` bg-white dark:border-gray-700 dark:bg-gray-800 `} key={useId()}>
      <Table.Cell className={cellStyles}>{asset.name}</Table.Cell>
      <Table.Cell className={cellStyles}>{asset.totalQuantity}</Table.Cell>
      <Table.Cell
        className={cellStyles}
      >{`${getSymbolFromCurrency(asset.assetCurrencyCode)}${asset.avgBuyPrice}`}</Table.Cell>
      <Table.Cell className={cellStyles}>{asset.allocation}</Table.Cell>
      <Table.Cell className={cellStyles}>{asset.price}</Table.Cell>
      <Table.Cell className={cellStyles}>
        <div>{`${getSymbolFromCurrency(asset.assetCurrencyCode)}${asset.value}`}</div>
        {activePortfolio && activePortfolio?.currencySymbol !== asset.assetCurrencyCode && (
          <div>
            {`(${getSymbolFromCurrency(activePortfolio?.currencySymbol)}${asset.valueInBaseCurrencie})`}
          </div>
        )}
      </Table.Cell>
      <Table.Cell className={cellStyles}>
        <div
          className={`flex items-center gap-1 ${Number(asset.valueChange) > 0 ? 'text-emerald-500' : 'text-orange-600'} `}
        >
          <div>
            {Number(asset.valueChange) > 0 ? (
              <HiOutlineArrowSmUp className="h-6 w-6 " />
            ) : (
              <HiOutlineArrowSmDown className="h-6 w-6 " />
            )}
          </div>
          {`${asset.valueChange.replace('-', '')}\n${asset.percentageChange.replace('-', '')}%`}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}
