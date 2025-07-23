import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-skeleton',
    template: `
        <div class="flex flex-col gap-1">
            @for (item of iteration; track $index) {
                <p-skeleton [shape]="shape" [width]="width" [height]="height" />
            }
        </div>
    `,
    standalone: true,
    imports: [SkeletonModule, CommonModule],
})
export class SkeletonComponent implements OnInit {
    @Input()
    width: string = '100%';

    @Input()
    height: string = '100%';

    @Input()
    shape: string = '';

    @Input()
    iterationProps: number = 1;

    iteration: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.iterationEvent(this.iterationProps);
    }

    iterationEvent(ev: number): void {
        for (let index = 0; index < ev; index++) {
            let it = '1';
            this.iteration.push(it);
        }
    }
}
