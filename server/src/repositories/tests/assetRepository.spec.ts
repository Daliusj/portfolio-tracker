import { createTestDatabase } from '@tests/utils/database'
import { fakeAsset } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { assetRepository } from '../assetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = assetRepository(db)

describe('create', () => {
  it('should create a new comment', async () => {
    const asset = fakeAsset({})
    const createdAsset = await repository.create(asset)
    expect(createdAsset).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Date),
      ...asset,
    })
  })
})

describe('findById', () => {
  it('should find asset by id', async () => {
    const [asset] = await insertAll(db, 'asset', fakeAsset({}))
    const assetsFound = await repository.findById(asset.id)
    expect(assetsFound).toEqual(asset)
  })

  it('should return undifined if no assets are found', async () => {
    const assetId = 456
    const assetFound = await repository.findById(assetId)
    expect(assetFound).toBeUndefined()
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
})
