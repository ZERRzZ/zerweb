import { RTBody, RTHead } from "../../common/model";

export const head: RTHead[] = [
  { name: 'ID', field: 'id', width: '50px' },
  { name: 'NAME', field: 'name', width: '100px' },
  { name: 'TYPE', field: 'type' }
]

export const body: RTBody[] = [
  { id: 1, name: 'chengzs', type: 'human' },
  { id: 2, name: 'sadanya', type: 'human' },
  { id: 3, name: 'satania', type: 'animation' },
  { id: 4, name: 'zerzz', type: 'human' },
  { id: 5, name: 'sadanikya', type: 'human' },
  { id: 6, name: 'abc', type: 'number' },
  { id: 7, name: 'eu4', type: 'game' },
  { id: 8, name: 'dont starve', type: 'game' },
  { id: 9, name: 'dst', type: 'game' },
  { id: 10, name: 'lol', type: 'game' },
  { id: 11, name: 'doki doki', type: 'game' },
]