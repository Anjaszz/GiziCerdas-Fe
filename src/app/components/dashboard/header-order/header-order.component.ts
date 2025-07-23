import { Component, OnInit } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header-order',
  templateUrl: './header-order.component.html',
  styleUrls: ['./header-order.component.scss'],
  standalone: true,
  imports: [IonHeader, IconModule,CommonModule,RouterLink]
})
export class HeaderOrderComponent  implements OnInit {

  constructor( private location: Location) { }

  goBack(): void {
    this.location.back();
  }
  
  ngOnInit() {}

}
