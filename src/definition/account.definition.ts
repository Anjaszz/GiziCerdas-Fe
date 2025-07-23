import { ResponseStatusArray } from "./rest.interface"

export interface DataListAccount {
    name: string
    id: number
}


export type ResponseListAccount = ResponseStatusArray<DataListAccount>