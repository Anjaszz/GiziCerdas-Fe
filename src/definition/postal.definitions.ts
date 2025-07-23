import { ResponseStatus } from "./rest.interface";

export interface BodyPostalAutoComplete {
    get:         string;
    province:    string;
    city:        string;
    district:    string;
    subdistrict: string;
    search:      string;
}

export interface DataPostalAutoComplete {
    province: string;
}


export type ResponsePostalAutoComplete = ResponseStatus<DataPostalAutoComplete[]>;


export interface DataTreeProvince {
    city: string;
}

export type ResponseTreeProvince = ResponseStatus<DataTreeProvince[]>

export interface DataTreeCity {
    district: string;
}

export type ResponseTreeCity = ResponseStatus<DataTreeCity[]>

export interface DataTreeDistrict {
    subdistrict: string;
}

export type ResponseTreeDistrict = ResponseStatus<DataTreeDistrict[]>

export interface DataTreeSubdistrict {
    postal: string;
}

export type ResponseTreeSubdistrict = ResponseStatus<DataTreeSubdistrict[]>


