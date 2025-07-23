import { ObjectVal } from "./global.definition";


export const ClientListConstant = {
    REGISTERED: 'registered',
    UNREGISTERED: 'unregistered'
} as const

export const ClientListStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    IN_PROGRESS: 'in_progress',
    CANCELED: 'canceled'
}

export type ClientListParam = {
    tab: string;
    status: string;
}