import { PortfolioStatsPublic } from '@server/services/types'
import React from 'react'
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from 'react-icons/hi'

type ProfitLossProps = {
  asset: PortfolioStatsPublic
  full: boolean
}

export default function ({ asset, full }: ProfitLossProps) {
  return (
    <div
      className={`flex items-center gap-1 text-sm ${Number(asset.valueChange) > 0 ? 'text-emerald-500' : 'text-orange-600'} `}
    >
      <div>
        {Number(asset.valueChange) > 0 ? (
          <HiOutlineArrowSmUp className="h-6 w-6" />
        ) : (
          <HiOutlineArrowSmDown className="h-6 w-6" />
        )}
      </div>
      <div>
        {full && <div>{asset.valueChange.replace('-', '')}</div>}
        <div>{`${asset.percentageChange.replace('-', '')}%`}</div>
      </div>
    </div>
  )
}
