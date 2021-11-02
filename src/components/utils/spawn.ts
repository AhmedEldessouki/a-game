import faker from 'faker'
import type {SpawnAbleAnimals} from '../../../types/animals'

const spawn = (max: number, min: number) => {
  // ? Sheep s > 0 && s <= 100
  // ? Wolf w > 101 && w <= 110 Radius: 15%
  // ? Bear b > 111 && b <= 115 Radius: 20%
  const num = faker.datatype.number(115)
  const animal: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
    color: string
    id: string
  } = {
    type: 'sheep',
    location: {
      longitude: Number(faker.address.latitude(max, min)),
      latitude: Number(faker.address.longitude(max, min)),
    },
    createdAt: Date.now(),
    color: 'white',
    id: faker.datatype.uuid(),
  }
  if (num < 101) {
    // ? Defaulted
  } else if (num < 111) {
    animal.type = 'wolf'
    animal.color = '#ff0035'
  } else {
    animal.type = 'bear'
    animal.color = '#1b45d7'
  }
  return animal
}

export default spawn
