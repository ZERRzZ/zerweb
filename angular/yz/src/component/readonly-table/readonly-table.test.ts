import { RTBody, RTHead } from "../../common/model";

export const head: RTHead[] = [
  { name: 'ID', field: 'id', width: '50px' },
  { name: 'NAME', field: 'name', width: '200px' },
  { name: 'TYPE', field: 'type' }
]

export const body: RTBody[] = [
  { id: 1, name: 'chengzs', type: 'human' },
  { id: 2, name: 'sadanya', type: 'human' }
]