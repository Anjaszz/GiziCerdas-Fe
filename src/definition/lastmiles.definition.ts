
import { Lastmiles } from "src/interface/lastmiles";
import { ResponseStatusArray } from "./rest.interface";

export type ResponseGetLastMiles = ResponseStatusArray<Lastmiles>;

export type CheckboxLastMiles = { 
    label: string;
    id: string;
    value: boolean;
 };