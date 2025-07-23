import { ResponseStatus } from "./rest.interface";

export type BodyDetailOrder = {
    uuid: string;
}

export type ResponseDetailOrder = ResponseStatus<DataDetailOrder>;

export interface DataDetailOrder {
    transaction_serial_id:           number;
    transaction_uuid:                string;
    transaction_service_type:        string;
    transaction_shipping_type:       string;
    transaction_price:               string;
    transaction_kgs_charge:          number;
    transaction_volumes:             number;
    transaction_status:              number;
    transaction_booking_number:      string;
    transaction_airwaybill:          string;
    transaction_last_mile_id:        number;
    transaction_from_name:           string;
    transaction_from_phone:          string;
    transaction_from_email:          string;
    transaction_from_address1:       string;
    transaction_from_province:       string;
    transaction_from_city:           string;
    transaction_from_district:       string;
    transaction_from_subdistrict:    string;
    transaction_from_postal:         string;
    transaction_to_name:             string;
    transaction_to_phone:            string;
    transaction_to_email:            string;
    transaction_to_address1:         string;
    transaction_to_province:         string;
    transaction_to_city:             string;
    transaction_to_district:         string;
    transaction_to_subdistrict:      string;
    transaction_to_postal:           string;
    transaction_pickup_data:         string;
    transaction_note:                string;
    transaction_expired:             Date;
    transaction_rates:               string;
    transaction_third_party_respose: string;
    transaction_box_type:            null;
    transaction_tlc_from:            null;
    transaction_tlc_to:              null;
    transaction_insured:             boolean;
    transaction_insured_value:       string;
    transaction_pod_imgs:            null;
    deleted:                         number;
    created_by:                      string;
    updated_by:                      string;
    created_at:                      Date;
    updated_at:                      Date;
    created_to_lastmile:             Date;
    b2b_account_member_id:           null;
    owner:                           string;
    owner_type:                      string;
    b2c_id:                          null;
    b2b_id:                          null;
    admin_id:                        number;
    collie:                          Collie[];
    transaction_status_name:         string;
    last_mile:                       LastMile;
	  pickup_data: PickupData;
    transaction_shipping_cost:        number;
    transaction_insurance_cost:       number;
    
 }

 export interface PickupDataAddress {
	address1: string;
	address2: string;
	province: string;
	city: string;
	district: string;
	subdistrict: string;
	postal: string;
  }
  
  export interface PickupDataParcelJob {
	insured_value: number;
	is_pickup_required: boolean;
	pickup_address_id: string;
	pickup_service_type: string;
	pickup_service_level: string;
	pickup_date: string;
	pickup_timeslot: {
	  start_time: string;
	  end_time: string;
	  timezone: string;
	};
	pickup_instructions: string;
	delivery_instructions: string;
	delivery_start_date: string;
	delivery_timeslot: {
	  start_time: string;
	  end_time: string;
	  timezone: string;
	};
	dimensions: {
	  weight: number;
	};
	items: Array<{
	  item_description: string;
	  quantity: number;
	  is_dangerous_good: boolean;
	}>;
  }

  export interface PickupData {
	address: PickupDataAddress;
	parcel_job: PickupDataParcelJob;
	name: string;
	phone: string;
	email: string | null;
  }

export interface Collie {
    id:             number;
    weight:         string;
    charge:         string;
    width:          string;
    length:         string;
    height:         string;
    value:          string;
    created_at:     Date;
    updated_at:     Date;
    transaction_id: number;
    collie_items:   CollieItem[];
}

export interface CollieItem {
    id:          number;
    desc:        string;
    qty:         string;
    unit_id:     number;
    value:       string;
    category_id: number;
    collie_id:   number;
    created_at:  Date;
    updated_at:  Date;
    category:    Category;
    unit:        Category;
}

export interface Category {
    name: string;
}

export interface LastMile {
    last_mile_serial_id:    number;
    last_mile_uuid:         string;
    last_mile_name:         string;
    last_mile_logo:         string;
    last_mile_code:         string;
    last_mile_drop:         number;
    last_mile_pickup:       number;
    last_mile_multi_collie: number;
    created_by:             string;
    updated_by:             string;
    created_at:             Date;
    updated_at:             Date;
    deleted:                number;
    status:                 number;
}

