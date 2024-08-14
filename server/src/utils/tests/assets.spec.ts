import type {
  FullPortfolioPublic,
  FullPortfolioGroupedPublic,
} from '@server/entities/portfolio'
import { groupAssets } from '../assets' // replace with the correct import path

describe('groupAssets', () => {
  it('should group assets by id', () => {
    const assets: FullPortfolioPublic[] = [
      {
        assetId: 1,
        assetName: 'Asset 1',
        assetPrice: '100',
        assetType: 'stock',
        currencyCode: 'USD',
        portfolioItemId: 1,
        quantity: '10',
        purchaseDate: new Date('2023-01-01'),
        purchasePrice: '100',
      },
      {
        assetId: 1,
        assetName: 'Asset 1',
        assetPrice: '100',
        assetType: 'stock',
        currencyCode: 'USD',
        portfolioItemId: 2,
        quantity: '5',
        purchaseDate: new Date('2023-02-01'),
        purchasePrice: '105',
      },
      {
        assetId: 2,
        assetName: 'Asset 2',
        assetPrice: '200',
        assetType: 'fund',
        currencyCode: 'EUR',
        portfolioItemId: 3,
        quantity: '15',
        purchaseDate: new Date('2023-01-15'),
        purchasePrice: '200',
      },
    ]

    const expectedOutput: FullPortfolioGroupedPublic[] = [
      {
        assetId: 1,
        assetName: 'Asset 1',
        assetPrice: '100',
        assetType: 'stock',
        currencyCode: 'USD',
        purchases: [
          {
            portfolioItemId: 1,
            quantity: '10',
            purchaseDate: new Date('2023-01-01'),
            purchasePrice: '100',
          },
          {
            portfolioItemId: 2,
            quantity: '5',
            purchaseDate: new Date('2023-02-01'),
            purchasePrice: '105',
          },
        ],
      },
      {
        assetId: 2,
        assetName: 'Asset 2',
        assetPrice: '200',
        assetType: 'fund',
        currencyCode: 'EUR',
        purchases: [
          {
            portfolioItemId: 3,
            quantity: '15',
            purchaseDate: new Date('2023-01-15'),
            purchasePrice: '200',
          },
        ],
      },
    ]

    const result = groupAssets(assets)
    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array when given empty input', () => {
    const result = groupAssets([])
    expect(result).toEqual([])
  })

  it('should handle multiple assets with no common ids', () => {
    const assets: FullPortfolioPublic[] = [
      {
        assetId: 3,
        assetName: 'Asset 3',
        assetPrice: '150',
        assetType: 'stock',
        currencyCode: 'USD',
        portfolioItemId: 4,
        quantity: '20',
        purchaseDate: new Date('2023-03-01'),
        purchasePrice: '150',
      },
      {
        assetId: 4,
        assetName: 'Asset 4',
        assetPrice: '250',
        assetType: 'stock',
        currencyCode: 'USD',
        portfolioItemId: 5,
        quantity: '25',
        purchaseDate: new Date('2023-04-01'),
        purchasePrice: '250',
      },
    ]

    const expectedOutput: FullPortfolioGroupedPublic[] = [
      {
        assetId: 3,
        assetName: 'Asset 3',
        assetPrice: '150',
        assetType: 'stock',
        currencyCode: 'USD',
        purchases: [
          {
            portfolioItemId: 4,
            quantity: '20',
            purchaseDate: new Date('2023-03-01'),
            purchasePrice: '150',
          },
        ],
      },
      {
        assetId: 4,
        assetName: 'Asset 4',
        assetPrice: '250',
        assetType: 'stock',
        currencyCode: 'USD',
        purchases: [
          {
            portfolioItemId: 5,
            quantity: '25',
            purchaseDate: new Date('2023-04-01'),
            purchasePrice: '250',
          },
        ],
      },
    ]

    const result = groupAssets(assets)
    expect(result).toEqual(expectedOutput)
  })

  it('should correctly group and aggregate multiple purchases under the same asset', () => {
    const assets: FullPortfolioPublic[] = [
      {
        assetId: 5,
        assetName: 'Asset 5',
        assetPrice: '300',
        assetType: 'crypto',
        currencyCode: 'BTC',
        portfolioItemId: 6,
        quantity: '2',
        purchaseDate: new Date('2023-05-01'),
        purchasePrice: '300',
      },
      {
        assetId: 5,
        assetName: 'Asset 5',
        assetPrice: '300',
        assetType: 'stock',
        currencyCode: 'BTC',
        portfolioItemId: 7,
        quantity: '3',
        purchaseDate: new Date('2023-06-01'),
        purchasePrice: '310',
      },
    ]

    const expectedOutput: FullPortfolioGroupedPublic[] = [
      {
        assetId: 5,
        assetName: 'Asset 5',
        assetPrice: '300',
        assetType: 'crypto',
        currencyCode: 'BTC',
        purchases: [
          {
            portfolioItemId: 6,
            quantity: '2',
            purchaseDate: new Date('2023-05-01'),
            purchasePrice: '300',
          },
          {
            portfolioItemId: 7,
            quantity: '3',
            purchaseDate: new Date('2023-06-01'),
            purchasePrice: '310',
          },
        ],
      },
    ]

    const result = groupAssets(assets)
    expect(result).toEqual(expectedOutput)
  })
})
