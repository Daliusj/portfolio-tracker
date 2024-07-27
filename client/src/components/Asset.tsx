import React from 'react'
export default function Asset({ asset }) {
  return (
    <div className="flex space-x-12">
      <div className="flex">
        {asset.logo}
        <div className="ml-2">
          <div className="text-sm">{asset.name}</div>
          <div className="text-xs">{`${asset.quantity} ${asset.symbol} ${asset.price}`}</div>
        </div>
      </div>
      <div>
        <div className="text-sm">{asset.totalValue}</div>
        <div className="text-xs">{asset.valueChange}</div>
      </div>
    </div>
  )
}
