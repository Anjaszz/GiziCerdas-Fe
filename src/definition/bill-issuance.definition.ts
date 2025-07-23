export const BillIssuanceStatus = {
    NOT_YET: 'notyet',
    WAIT_PAYMENT: 'waitpayment',
    WAIT_VERIFICATION: 'waitverification',
    PAID_OFF: 'paidoff',
    TROUBLE: 'trouble',
} as const

// export interface BillIssuanceData {
//     /** AWB number for the bill */
//     awbNumber: string;
//     /** Brand name */
//     brandName: string;
//     /** Name of person responsible */
//     responsibleName: string;
//     /** Payment method */
//     paymentMethod: string;
//     /** Creation timestamp */
//     createdAt: Date;
//     /** Last update timestamp */
//     updatedAt: Date;
//     /** Total bill amount */
//     totalAmount: number;
//     /** Number of packages */
//     totalPackage: number;
//     /** Total weight in kg */
//     totalWeight: number;
//     /** Whether the bill is not yet issued */
//     isNotIssued: boolean;
//     /** Time difference string */
//     timeDiff: string;
// }

export interface BillIssuanceData {
    /** Unique order ID */
    orderId: string;
    /** Brand name */
    brandName: string;
    /** Person in charge */
    personInCharge: string;
    /** Payment method */
    paymentMethod: string;
    /** Created date */
    createdAt: Date;
    /** Last updated date */
    updatedAt: Date;
    /** Order amount in Rupiah */
    amount: number;
    /** Order quantity details */
    quantity: {
      count: number;
      weight: number;
    };
  }
  


export type BillIssuanceParam = {
    status: string;
}


export const MockBillIssuances: BillIssuanceData[] = Array(20).fill(null).map((_, index) => ({
    orderId: `PDM${String(index + 1).padStart(12, '0')}`,
    brandName: `Brand Name ${index + 1}`,
    personInCharge: `Person ${index + 1}`,
    paymentMethod: index % 2 === 0 ? 'Transfer Bank' : '-',
    createdAt: new Date(2023, 0, 12, 10, 0, 0),
    updatedAt: new Date(2023, 0, 12, 10, 0, 0),
    amount: 100000 * (index + 1),
    quantity: {
       count: 2 * (index + 1),
       weight: 10 * (index + 1)
    }
 }));