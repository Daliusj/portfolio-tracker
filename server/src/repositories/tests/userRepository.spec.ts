import { createTestDatabase } from '@tests/utils/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { pick } from 'lodash-es'
import { userKeysPublic } from '@server/entities/user'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)

describe('create', () => {
  it('should create a new user', async () => {
    const user = fakeUser()
    const createdUser = await repository.create(user)

    expect(createdUser).toEqual({
      id: expect.any(Number),
      ...pick(user, userKeysPublic),
    })
  })
})

describe('findeByEmail', () => {
  it('should find user by email', async () => {
    const email = 'test@email.com'
    const [user] = await insertAll(db, 'user', fakeUser({ email }))
    const foundUser = await repository.findByEmail(email)
    expect(foundUser).toEqual(user)
  })
})
