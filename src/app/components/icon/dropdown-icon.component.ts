import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<span class="icon" [innerHTML]="sanitizedIcon"></span>`,
})
export class DropdownIconComponent {
  @Input() set icon(value: string) {
    this._sanitizedIcon = this.sanitizer.bypassSecurityTrustHtml(value);
  }

  _sanitizedIcon: SafeHtml = '';

  get sanitizedIcon(): SafeHtml {
    return this._sanitizedIcon;
  }

  constructor(private sanitizer: DomSanitizer) {}
}