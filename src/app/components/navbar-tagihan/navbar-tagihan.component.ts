import { Component, OnInit } from '@angular/core';
import { IconModule } from '../icon/icon.module';
import { RouterLink } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar-tagihan',
  templateUrl: './navbar-tagihan.component.html',
  standalone: true,
  imports: [IonHeader, RouterLink, IconModule],
})
export class NavbarTagihanComponent   {

  constructor() { }

}