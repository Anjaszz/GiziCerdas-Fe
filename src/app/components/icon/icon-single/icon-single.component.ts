import { Component, Input } from '@angular/core';

export const IconSingle = {
   X_RED: 'x-red',
   COPY_PURPLE: 'copy-purple',
   BELL: 'bell',
   DOWNLOAD: 'download',
   SIDE_LEFT_YELLOW: 'side-left-yellow',
   LASTMILES: 'lastmiles',
   LASTMILES_PURPLE: 'lastmiles-purple',
   TICKET: 'ticket',
   TICKET_PURPLE: 'ticket-purple',
   ORDER: 'order',
   ORDER_PURPLE: 'order-purple',
   DASHBOARD: 'dashboard',
   DASHBOARD_GRAY: 'dashboard-gray',
   BUTTON_X_GRAY: 'button-x-gray',
   BUTTON_X_RED: 'button-x-red',
   BUTTON_X_GRAY_DARK: 'button-x-gray-dark',
   BUTTON_UP_DOWN_GRAY: 'button-up-down-gray',
   BUTTON_DOWN_GRAY: 'button-down-gray',
   EYE_OPEN: 'eye-open',
   EYE_OPEN_GRAY: 'eye-open-gray',
   EYE_CLOSE: 'eye-close',
   PAK_DOME_PLAIN: 'dome-plain',
   BACK_ARROW_GRAY: 'back-arrow-gray',
   RIGHT_ARROW_GRAY: 'right-arrow-gray',
   DOWN_ARROW_YELLOW: 'down-arrow-yellow',
   UP_ARROW_YELLOW: 'up-arrow-yellow',
   FLAG_IDN: 'flag-idn',
   MAP_GRAY: 'map-gray',
   BUTTON_X_GRAY_CIRCLE: 'button-x-gray-circle',
   BUTTON_UP_PURPLE_CIRCLE: 'button-up-purple-circle',
   BUTTON_DOWN_PURPLE_CIRCLE: 'button-down-purple-circle',
   EDIT_GRAY: 'edit-gray',
   EDIT_PURPLE: 'edit-purple',
   DELETE_GRAY: 'delete-gray',
   PAK_DOME_BIG: 'paK-dome-big',
   ORDER_SUCCESS: 'order-success',
   NO_DATA: 'no-data',
   PRINTER_GRAY: 'printer-gray',
   SEARCH_GLASSES_GRAY: 'search-glasses-gray',
   TINY_POINT_GRAY: 'tiny-point-gray',
   SQUARE_CHECKLIST_GRAY: 'square-checklist-gray',
   SQUARE_X_GRAY: 'square-x-gray',
   CAMERA_LIGHT_GRAY: 'camera-light-gray',
   BILL_RECAP: 'bill-recap',
   BILL_RECAP_PURPLE: 'bill-recap-purple',
   BILL_ISSUANCE: 'bill-issuance',
   BILL_ISSUANCE_PURPLE: 'bill-issuance-purple',
   ADDRESS_LIST: 'address-list',
   ADDRESS_LIST_PURPLE: 'address-list-purple',
   CLIENT_LIST: 'client-list',
   CLIENT_LIST_PURPLE: 'client-list-purple',
} as const;

@Component({
   selector: 'app-icon-single',
   standalone: true,
   imports: [],
   templateUrl: './icon-single.component.html',
   styleUrl: './icon-single.component.css',
})
export class IconSingleComponent {
   @Input()
   type?: (typeof IconSingle)[keyof typeof IconSingle];

   ICON_TYPE = IconSingle;
}
