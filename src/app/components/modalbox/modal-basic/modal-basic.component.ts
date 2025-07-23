import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ObjectVal } from 'src/definition/global.definition';
import { Button2Component } from "../../button2/button.component";




export const ModalBasicVariant = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
} as const

@Component({
	selector: 'modal-basic',
	template: `
		<p-dialog
			appendTo="body"
			[visible]="visibleModal"
			[modal]="true"
			[dismissableMask]="false"
			(onHide)="cancel.emit()"
		>
			<ng-template pTemplate="headless">
				<div [ngClass]="styleWidth" class="flex flex-col gap-5 bg-surface-default justify-center p-[2.625rem] rounded-2xl ">
					<div class="flex flex-col gap-1.5">
						<h1 class="font-inter text-center font-bold text-base text-text-default">{{header}}</h1>
						<p class="font-inter font-normal text-center text-sm text-text-subtler">{{content}}</p>
						<ng-content select='[optional]'/>
					</div>
					<div 
                        [ngClass]="[
                            'gap-2 mx-4',
                            computedClasses
                        ]"
                    >
						<app-button2
							theme="tint-purple"
							[fullWidth]="true"
							(clicked)="cancel.emit()"
						>
							{{labelCancel}}
						</app-button2>
						<app-button2
							theme="solid-purple"
							[fullWidth]="true"
							(clicked)="submit.emit()"
							[loading]="loading"
						>
							{{labelSubmit}}
						</app-button2>
					</div>
				</div>
			</ng-template>
		</p-dialog>
	`,
	standalone: true,
	imports: [
    CommonModule,
    DialogModule,
    Button2Component,
]
})
export class ModalBasicComponent implements OnInit {
	@Output()
	submit: EventEmitter<void> = new EventEmitter();
	
	@Output()
	cancel: EventEmitter<void> = new EventEmitter();

	@Input()
	visibleModal: boolean = false

    @Input()
    variant: ObjectVal<typeof ModalBasicVariant> = ModalBasicVariant.HORIZONTAL

	@Input()
	header: string = "";
	@Input()
	content: string = "";
	@Input()
	labelSubmit: string = "";
	@Input()
	labelCancel: string = "";
	@Input()
	loading: boolean = false;

	@Input()
	styleWidth: string = "w-[360px]"

    get computedClasses(): string {
        const classes = [
          this.variant === ModalBasicVariant.HORIZONTAL ? 'grid grid-cols-2' : 'flex flex-col-reverse'
        ];
    
        return classes.filter(Boolean).join(' ');
      }

	constructor() {}

	ngOnInit() {}
}
