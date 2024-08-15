import { Table } from 'flowbite-react'
import React, { useId } from 'react'
import { PortfolioStatsPublic } from '@server/shared/types'
import getSymbolFromCurrency from 'currency-symbol-map'
import { usePortfolio } from '@/context/PortfolioContext'
import ProfitLoss from '../ProfitLoss'

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
      <Table.Cell
        className={cellStyles}
      >{`${getSymbolFromCurrency(asset.assetCurrencyCode)}${asset.price}`}</Table.Cell>
      <Table.Cell className={cellStyles}>
        <div>{`${getSymbolFromCurrency(asset.assetCurrencyCode)}${asset.value}`}</div>
        {activePortfolio && activePortfolio?.currencySymbol !== asset.assetCurrencyCode && (
          <div>
            {`(${getSymbolFromCurrency(activePortfolio?.currencySymbol)}${asset.valueInBaseCurrencie})`}
          </div>
        )}
      </Table.Cell>
      <Table.Cell className={cellStyles}>
        <ProfitLoss asset={asset} full={true} />
      </Table.Cell>
    </Table.Row>
  )
}
