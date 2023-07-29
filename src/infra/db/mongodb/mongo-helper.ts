import { MongoClient, type Collection, type InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  insertMap (data: any, result: InsertOneResult): any {
    const { _id, ...collectionWithoutId } = data
    return {
      id: result.insertedId.toString(),
      ...collectionWithoutId
    }
  },

  map (data: any): any {
    const { _id, ...collectionWithoutId } = data
    return {
      id: _id,
      ...collectionWithoutId
    }
  },

  mapArray (collection: any[]): any[] {
    return collection.map(item => this.map(item))
  }

}
