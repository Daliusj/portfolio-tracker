import React from 'react'
import { PortfolioProvider, usePortfolio } from '@/context/PortfolioContext'
import Dashboard from './Dashboard'
import CreatePortfolio from '../components/CreatePortfolio'

export default function App() {
  const { activePortfolio } = usePortfolio()
  return (
    <PortfolioProvider>
      {!activePortfolio && <CreatePortfolio />}
      <Dashboard />
    </PortfolioProvider>
  )
}
