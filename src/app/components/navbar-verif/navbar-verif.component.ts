import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { IconModule } from '../icon/icon.module';
import { Router, RouterLink } from '@angular/router';
import { CostumModalV1Component } from "../modalbox/costum-modal-v1/costum-modal-v1.component";
import { CommonModule } from '@angular/common';
import { ProfileService } from 'src/app/services/auth/profile.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-navbar-verif',
  templateUrl: './navbar-verif.component.html',
  styleUrls: ['./navbar-verif.component.scss'],
  standalone: true,
  imports: [RouterLink, IconModule, ButtonComponent, CostumModalV1Component,CommonModule],
})
export class NavbarVerifComponent   {
  @Input() showExitButton: boolean = true;
  showModal: boolean = false;

  constructor( private router: Router,private profileService: ProfileService) { }

  openmodal() {
    this.showModal = true;
  }

    handleConfirm() {
     this.profileService.clearProfile();
     localStorage.clear();
     this.router.navigate(['/masuk']);
     this.showModal = false;
  }

  handleCancel() {
    this.showModal = false;
  }

}
