import { createTestDatabase } from '@tests/utils/database'
import { fakeAsset, fakeExchange } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { assetRepository } from '../assetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = assetRepository(db)

describe('create', () => {
  it('should create a new asset and return created assets', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const asset = fakeAsset({ exchangeShortName: exchange.shortName })
    const createdAssets = await repository.create(asset)
    expect(createdAssets).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Date),
        ...asset,
        price: `${asset.price}`,
      },
    ])
  })

  it('should create new assets and return created assets with array of assets data', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const createdAssets = await repository.create([
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
    ])
    expect(createdAssets).toHaveLength(5)
  })
})

describe('findById', () => {
  it('should find asset by id', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const assetsFound = await repository.findById(asset.id)
    expect(assetsFound).toEqual([asset])
  })

  it('should find assets by array of ids', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [assetOne, assetTwo] = await insertAll(db, 'asset', [
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
    ])
    const assetsFound = await repository.findById([assetOne.id, assetTwo.id])
    expect(assetsFound).toEqual([assetOne, assetTwo])
  })

  it('should return an empty array if no assets are found', async () => {
    const assetId = 456
    const assetFound = await repository.findById(assetId)
    expect(assetFound).toEqual([])
  })
})

describe('findAsset', () => {
  it('should find asset by provided full stock name', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('Apple', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should find asset by provided full stock name in lower case', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('apple', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should find asset by provided partial stock name in lower case', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('pple', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should find asset by provided full symbol', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('AAPL', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should find asset by provided full symbol in lower case', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('aapl', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should find asset by provided partial symbol in lower case', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({
        name: 'Apple',
        symbol: 'AAPL',
        exchangeShortName: exchange.shortName,
      })
    )
    const assetsFound = await repository.findAsset('apl', {
      offset: 0,
      limit: 10,
    })
    expect(assetsFound).toEqual({ data: [asset], total: '1' })
  })

  it('should return an empty array if no assets are found', async () => {
    const assetFound = await repository.findAsset('btc', {
      offset: 0,
      limit: 10,
    })
    expect(assetFound).toEqual({ data: [], total: '0' })
  })
})

describe('findAll', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  it('should return all assets', async () => {
    const [assetOne, assetTwo] = await insertAll(db, 'asset', [
      fakeAsset({ exchangeShortName: exchange.shortName }),
      fakeAsset({ exchangeShortName: exchange.shortName }),
    ])
    const assetsFound = await repository.findAll()
    expect(assetsFound).toEqual([assetOne, assetTwo])
  })

  it('should return an empty array if no assets are found', async () => {
    const assetFound = await repository.findAll()
    expect(assetFound).toEqual([])
  })
})
describe('isAssetsEmpty', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  it('should return false if database is not empty', async () => {
    await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const isEmpty = await repository.isAssetsEmpty()
    expect(isEmpty).toBeFalsy()
  })

  it('should return true if database is empty', async () => {
    const isEmpty = await repository.isAssetsEmpty()
    expect(isEmpty).toBeTruthy()
  })
})

describe('updatePrice', () => {
  it('should update assets prices', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset1, asset2] = await insertAll(db, 'asset', [
      fakeAsset({ symbol: 'AAPL', exchangeShortName: exchange.shortName }),
      fakeAsset({ symbol: 'GOOG', exchangeShortName: exchange.shortName }),
    ])
    const updateAsset = await repository.updatePrices([
      {
        price: '100.0',
        symbol: 'AAPL',
      },
      {
        price: '100.0',
        symbol: 'GOOG',
      },
    ])
    expect(updateAsset).toEqual([
      { ...asset1, price: '100.0' },
      { ...asset2, price: '100.0' },
    ])
  })
})
