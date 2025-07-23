import { RouteData } from "./route.definition";


export const ClientDetailTab = {
    OVERVIEW: RouteData.CLIENT_LIST_CHILDREN.DETAIL_CHILDREN.OVERVIEW,
    ACCOUNT_INFO: RouteData.CLIENT_LIST_CHILDREN.DETAIL_CHILDREN.ACCOUNT_INFO,
    ADDRESS_LIST: RouteData.CLIENT_LIST_CHILDREN.DETAIL_CHILDREN.ADDRESS_LIST,
} as const

export type ClientDetailParam = {
    tab: string;
}