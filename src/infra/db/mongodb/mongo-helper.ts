import { MongoClient, type Collection } from 'mongodb'

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

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
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
