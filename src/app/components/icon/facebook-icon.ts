import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fb-icon',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <svg [attr.width]="width" [attr.height]="height" viewBox="0 0 22 20" [attr.fill]="fill" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3976 20C17.2831 19.3191 21.0439 15.1236 21.0439 10.0486H21.0453C21.0453 4.49904 16.5476 0 10.9997 0C5.45182 0 0.954102 4.49904 0.954102 10.0486C0.954102 15.0495 4.60701 19.1979 9.38964 19.9683V13.2065H6.89301V10.2578H9.38964V7.57954C9.38964 5.91792 10.7361 4.57031 12.398 4.57031V4.57172C12.4004 4.57172 12.4027 4.57137 12.405 4.57102C12.4073 4.57066 12.4096 4.57031 12.412 4.57031H15.1051V7.12048H13.3454C12.8224 7.12048 12.398 7.54504 12.398 8.06817L12.3973 8.06887V10.2578H15.1043L14.6757 13.2065H12.3973V20C12.3974 20 12.3975 20 12.3976 20Z" [attr.fill]="fill"/>
    </svg>
  `
})
export class FbIconComponent {
  @Input() width: string = '22';
  @Input() height: string = '20';
  @Input() fill: string = '#2C3E5D';
}