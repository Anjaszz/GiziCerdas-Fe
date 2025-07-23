import { ResponseDetailTroli } from "src/interface/detail-order";
import { ResponsePagination, ResponseStatus, ResponseStatusArray } from './rest.interface';



export const OrderListConstant = {
   IN_PROGRESS: 'inprogress',
   ON_DELIVERY: 'ondelivery',
   DELIVERED: 'delivered',
   TROUBLE: 'trouble',
   REJECTED: 'rejected',
} as const;

export type OrderListParam = {
   status: string;
};

// mock u/ detail order
export const DummyDetailOrder: ResponseDetailTroli = {
   transaction_serial_id: 123456,
   transaction_uuid: 'TR-UUID-123456',
   transaction_service_type: 'Regular',
   transaction_shipping_type: 'B2C',
   transaction_price: '150000',
   transaction_kgs_charge: 2.5,
   transaction_volumes: 0.5,
   transaction_status: 1,
   transaction_booking_number: 'BK123456',
   transaction_airwaybill: 'AWB123456789',
   transaction_last_mile_id: 1,
   transaction_from_name: 'Bambang Laskito',
   transaction_from_phone: '081234567890',
   transaction_from_email: 'bambang@example.com',
   transaction_from_address1: 'Jl. Raya Kelapa Gading No. 10',
   transaction_from_province: 'DKI Jakarta',
   transaction_from_city: 'Jakarta Utara',
   transaction_from_district: 'Kelapa Gading',
   transaction_from_subdistrict: 'Kelapa Gading Barat',
   transaction_from_postal: '14240',
   transaction_to_name: 'Firman Utina',
   transaction_to_phone: '087654321098',
   transaction_to_email: 'firman@example.com',
   transaction_to_address1: 'Jl. Raya Rawamangun No. 15',
   transaction_to_province: 'DKI Jakarta',
   transaction_to_city: 'Jakarta Timur',
   transaction_to_district: 'Rawamangun',
   transaction_to_subdistrict: 'Rawamangun',
   transaction_to_postal: '13220',
   transaction_pickup_data: 'Pickup at warehouse',
   transaction_note: 'Handle with care',
   transaction_expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
   transaction_rates: 'standard',
   transaction_third_party_respose: null,
   transaction_box_type: 'BOX',
   transaction_tlc_from: null,
   transaction_tlc_to: null,
   transaction_insured: true,
   transaction_insured_value: '1000000',
   transaction_pod_imgs: null,
   deleted: 0,
   created_by: 'SYSTEM',
   updated_by: 'SYSTEM',
   created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
   updated_at: new Date(),
   created_to_lastmile: null,
   transaction_status_name: 'WAREHOUSE IN PROGRESS',
   collie_sys: [
      {
         id: 1,
         weight: '1.5',
         charge: '75000',
         width: '30',
         length: '40',
         height: '20',
         value: '500000',
         created_at: new Date(),
         updated_at: new Date(),
         transaction_sys_id: 123456,
         collie_items_sys: [
            {
               id: 1,
               desc: 'Pakaian',
               qty: '10',
               unit_sys_id: 1,
               value: '300000',
               category_sys_id: 1,
               collie_sys_id: 1,
               created_at: new Date(),
               updated_at: new Date(),
               category_sys: { name: 'Fashion' },
               unit_sys: { name: 'PCS' },
            },
         ],
      },
      {
         id: 2,
         weight: '1',
         charge: '75000',
         width: '25',
         length: '35',
         height: '15',
         value: '500000',
         created_at: new Date(),
         updated_at: new Date(),
         transaction_sys_id: 123456,
         collie_items_sys: [
            {
               id: 2,
               desc: 'Elektronik',
               qty: '2',
               unit_sys_id: 1,
               value: '700000',
               category_sys_id: 2,
               collie_sys_id: 2,
               created_at: new Date(),
               updated_at: new Date(),
               category_sys: { name: 'Electronics' },
               unit_sys: { name: 'UNIT' },
            },
         ],
      },
   ],
   last_mile: {
      last_mile_serial_id: 1,
      last_mile_uuid: 'LM-UUID-123',
      last_mile_name: 'Ninja Van',
      last_mile_logo: '/assets/pakdome-login.png',
      last_mile_code: 'NINJA',
      last_mile_drop: 1,
      last_mile_pickup: 1,
      last_mile_multi_collie: 1,
      created_by: 'SYSTEM',
      updated_by: 'SYSTEM',
      created_at: new Date(),
      updated_at: new Date(),
      deleted: 0,
      status: 1,
   },
};

export interface DataStatusOrderList {
   id: number;
   name: string;
   code: string;
   sort: number;
}

export type ResponseStatusOrderList = ResponseStatusArray<DataStatusOrderList>;



export interface BodyOrderList {
    search: string;
    show:   number;
    page:   number;
    status: string;
    filter: FilterOrderList;
}

export const DefaultOrderListParam: BodyOrderList = {
    search: "",
    show: 25,
    page: 1,
    status: "",
    filter: {
        account_id: [],
        lastmile_id: [],
        created_date_range: {
            from: "",
            to: ""
        },
        updated_date_range: {
            from: "",
            to: ""
        }
    }
 };

export interface FilterOrderList {
    account_id:         string[];
    lastmile_id:        string[];
    created_date_range: DateRange;
    updated_date_range: DateRange;
}

export interface DateRange {
    from: string;
    to:   string;
}


export interface DataOrderList {
    transaction_uuid:           string;
    transaction_from_name:      string;
    transaction_from_city:      string;
    transaction_to_name:        string;
    transaction_to_city:        string;
    transaction_expired:        Date;
    transaction_service_type:   string;
    transaction_shipping_type:  string;
    transaction_booking_number: string;
    transaction_airwaybill:     string;
    transaction_price:          string;
    transaction_kgs_charge:     number;
    transaction_volumes:        number;
    created_at:                 Date;
    last_mile_name:             string;
    last_mile_code:             string;
    transaction_status:         string;
    transaction_status_code:    string;
    transaction_status_id:      number;
    created_by:                 string;
    updated_by:                 string;
    total_collie:               number;

    account_name:   string;
    account_type:   string;
}

export type ResponseOrderList = ResponseStatus<ResponsePagination<DataOrderList>>;

