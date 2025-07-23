/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { IonFooter} from '@ionic/angular/standalone';
import { IconModule } from "../icon/icon.module";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IconModule,RouterLink]

})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
