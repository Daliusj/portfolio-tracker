import { AssetStatsPublic, PortfolioStatsPublic } from '@server/services/types'
import React from 'react'
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from 'react-icons/hi'

type ProfitLossProps = {
  asset: AssetStatsPublic | PortfolioStatsPublic
  full: boolean
  flat: boolean
}

export default function ProfitLoss({ asset, full, flat }: ProfitLossProps) {
  return (
    <div
      className={`flex items-center gap-1 text-sm ${Number(asset.valueChange) < 0 ? 'text-orange-700 dark:text-orange-500' : 'text-emerald-700 dark:text-emerald-500'} `}
    >
      <div>
        {Number(asset.valueChange) < 0 ? (
          <HiOutlineArrowSmDown className="h-6 w-6" />
        ) : (
          <HiOutlineArrowSmUp className="h-6 w-6" />
        )}
      </div>
      <div className={`${flat && 'flex space-x-4'}`}>
        {full && <div>{asset.valueChange.replace('-', '')}</div>}
        <div>{`${flat ? '(' : ''}${asset.percentageChange.replace('-', '')}%${flat ? ')' : ''}`}</div>
      </div>
    </div>
  )
}
