import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type FormType<T> = FormGroup<{
    [k in keyof T]:
    T[k] extends any[] ? FormArray<FormType<T[k][0]>> :
    T[k] extends object ? FormType<T[k]> :
    FormControl<T[k]>;
}>

export type FieldError = { label: string, msg: string };

export type FormError<T> = FieldError & {
    [k in keyof T]:
    T[k] extends any[] ? FormError<T[k]> & FieldError :
    T[k] extends object ? FormError<T[k]> & FieldError :
    FieldError;
};

export type FormErrorServer<T extends object> = Record<keyof T, string>;


export type DataItem = { [key: string]: any };