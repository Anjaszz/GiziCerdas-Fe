import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';

@Component({
  selector: 'app-diskon-info',
  templateUrl: './diskon-info.component.html',
  styleUrls: ['./diskon-info.component.scss'],
  standalone: true,
  imports: [ButtonComponent, CommonModule, IconModule],
})
export class DiskonInfoComponent  implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() isOpen = false;
  @Input() lastmileName: string = '-'; // Default value
  @Input() discountValue: string = '-'; // Default value

  constructor() { }

  ngOnInit() {}

  onClose() {
    this.close.emit();
  }

}
