import React from 'react'
import { PortfolioProvider } from '@/context/PortfolioContext'
import Dashboard from './Dashboard'
import CreatePortfolio from '../components/CreatePortfolio'

export default function App() {
  return (
    <PortfolioProvider>
      <CreatePortfolio />
      <Dashboard />
    </PortfolioProvider>
  )
}
