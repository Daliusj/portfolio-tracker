import React from 'react'
import Table from './Table'
import { usePortfolioAssets } from '@/context/portfolioAssets'
import { FullPortfolioGroupedPublic } from '@server/entities/portfolio'

export default function TableBox() {
  const assets = usePortfolioAssets()
  return <Table assets={assets.data as FullPortfolioGroupedPublic[]} />
}
