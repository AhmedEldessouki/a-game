type SpawnAbleAnimals = 'sheep' | 'wolf' | 'bear'
type AnimalsType = {
  type: SpawnAbleAnimals
  location: {latitude: number; longitude: number}
  createdAt: number
  color: string
  id: string
}[]

export {AnimalsType, SpawnAbleAnimals}
