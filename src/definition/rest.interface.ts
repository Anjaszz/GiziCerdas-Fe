export interface ResponseApi<T> {
	message: string;
	data: T;
}

export interface ResponseStatus<T> {
	status: number;
	message: string;
	data: T;
}

export interface ResponseStatusArray<T> {
	status: number;
	message: string;
	data: T[];
}

export type ResponsePagination<T> = {
	total_all: number;
    total_by_status: number;
    show: number;
    next_page: number;
	result: T[];
}

export interface Pagination<T> {
	page: number;
	per_page: number;
	total: number;
	last_page: number;
	data: T[];
}
export interface ParamsPagination {
	page: number;
	limit: number;
	sort_by: string;
	search: string;
	order_by: string;
	start_date?: string;
	end_date?: string;
	status?: string;
}




// DUMMY
export interface DataPartnerList {
    uuid:       string;
    username?:   string;
    status:     number;
    detail:     DetailPartnerList;
    created_by: string;
    updated_by: string;
    created_at: Date;
    updated_at: Date;
}

export interface DetailPartnerList {
    pic_name?:         string;
    pic_phone?:        string;
    company_logo?:     string;
    company_brand?:    string;
    company_name?:     string;
    company_province?: string;
    rate?:             string;
    description?:      string;
}

export type DataDummy = Pick<DetailPartnerList, 'pic_name' | 'description' > & Pick<DataPartnerList, 'uuid' | 'created_at' | 'created_by' >
export type ResponseDummy = Pagination<DataDummy>