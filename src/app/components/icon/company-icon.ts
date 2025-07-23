import { Component, Input, Inject, Optional } from '@angular/core';

@Component({
  selector: 'company-icon',
  standalone: true,
  template: `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="36" height="36" rx="6" [attr.fill]="bgColor" [attr.fill-opacity]="fillOpacity"/>
<path d="M14 20V23M18 20V23M22 20V23M9 27H27M9 16H27M9 13L18 9L27 13M10 16H26V27H10V16Z" [attr.stroke]="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `,
})
export class CompanyIcon{
  // Use injected values if available, otherwise use defaults
  constructor(
    @Optional() @Inject('color') private injectedColor: string,
    @Optional() @Inject('bgColor') private injectedBgColor: string,
    @Optional() @Inject('fillOpacity') private injectedFillOpacity: string
  ) {}

  @Input() size: string = '20'; // Default size
  
  // Get color from injector if available, otherwise use input or default
  @Input() set color(value: string) {
    this._color = value;
  }
  get color(): string {
    return this.injectedColor || this._color || '#8993A5';
  }
  private _color: string = '#8993A5';
  
  // Get bgColor from injector if available, otherwise use input or default
  @Input() set bgColor(value: string) {
    this._bgColor = value;
  }
  get bgColor(): string {
    return this.injectedBgColor || this._bgColor || '#E3E4E8';
  }
  private _bgColor: string = '#E3E4E8';

  // Get fillOpacity from injector if available, otherwise use input or default
  @Input() set fillOpacity(value: string) {
    this._fillOpacity = value;
  }
  get fillOpacity(): string {
    return this.injectedFillOpacity || this._fillOpacity || '0.3';
  }
  private _fillOpacity: string = '0.3';
}