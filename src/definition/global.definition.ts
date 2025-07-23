import { ModalBasicVariant } from "src/app/components/modalbox/modal-basic/modal-basic.component";

export type Const<T> = T[keyof T]

export type ObjectVal<T> = T[keyof T];

export type ToastStatus = 'error' | 'success' | 'warning' | 'info'

export interface DateSelected {
	day: number;
	month: number;
	year: number;
}

export type ToastState = {
	status: ToastStatus
	header: string
	description: string
}


export type BasicModalState = {
	header?: string
	description?: string
	confirmText?: string
	cancelText?: string
	onConfirm?: () => void
    onCancel?: () => void
	loading?: boolean
    variant?: ObjectVal<typeof ModalBasicVariant>
	// onCancel: () => void
}

export const REQUEST_TIMOUT_MS = 25000;