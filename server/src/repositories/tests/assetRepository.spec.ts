import { createTestDatabase } from '@tests/utils/database'
import { fakeAsset } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { assetRepository } from '../assetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = assetRepository(db)

describe('create', () => {
  it('should create a new asset and return created assets', async () => {
    const asset = fakeAsset({})
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
})

describe('findById', () => {
  it('should find asset by id', async () => {
    const [asset] = await insertAll(db, 'asset', fakeAsset({}))
    const assetsFound = await repository.findById(asset.id)
    expect(assetsFound).toEqual([asset])
  })

  it('should find assets by array of ids', async () => {
    const [assetOne, assetTwo] = await insertAll(db, 'asset', [
      fakeAsset({}),
      fakeAsset({}),
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
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('Apple')
    expect(assetsFound).toEqual([asset])
  })

  it('should find asset by provided full stock name in lower case', async () => {
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('apple')
    expect(assetsFound).toEqual([asset])
  })

  it('should find asset by provided partial stock name in lower case', async () => {
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('pple')
    expect(assetsFound).toEqual([asset])
  })

  it('should find asset by provided full symbol', async () => {
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('AAPL')
    expect(assetsFound).toEqual([asset])
  })

  it('should find asset by provided full symbol in lower case', async () => {
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('aapl')
    expect(assetsFound).toEqual([asset])
  })

  it('should find asset by provided partial symbol in lower case', async () => {
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ name: 'Apple', symbol: 'AAPL' })
    )
    const assetsFound = await repository.findAsset('apl')
    expect(assetsFound).toEqual([asset])
  })

  it('should return an empty array if no assets are found', async () => {
    const assetFound = await repository.findAsset('btc')
    expect(assetFound).toEqual([])
  })
})

describe('findAll', () => {
  it('should return all assets', async () => {
    const [assetOne, assetTwo] = await insertAll(db, 'asset', [
      fakeAsset({}),
      fakeAsset({}),
    ])
    const assetsFound = await repository.findAll()
    expect(assetsFound).toEqual([assetOne, assetTwo])
  })

  it('should return an empty array if no assets are found', async () => {
    const assetFound = await repository.findAll()
    expect(assetFound).toEqual([])
  })

  describe('isAssetsEmpty', () => {
    it('should return false if database is not empty', async () => {
      await insertAll(db, 'asset', fakeAsset({}))
      const isEmpty = await repository.isAssetsEmpty()
      expect(isEmpty).toBeFalsy()
    })

    it('should return true if database is empty', async () => {
      const isEmpty = await repository.isAssetsEmpty()
      expect(isEmpty).toBeTruthy()
    })
  })
})

describe('updatePrice', () => {
  it('should update assets prices', async () => {
    const [asset1, asset2] = await insertAll(db, 'asset', [
      fakeAsset({ symbol: 'AAPL' }),
      fakeAsset({ symbol: 'GOOG' }),
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
