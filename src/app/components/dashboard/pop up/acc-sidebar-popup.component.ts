/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { Router } from '@angular/router';
import { AvatarComponent } from "../../avatar/avatar.component";
import { ProfileService } from 'src/app/services/auth/profile.service';

@Component({
  selector: 'acc-sidebar-popup',
  standalone: true,
  imports: [CommonModule, IconModule, AvatarComponent],
  template: `
<div 
  *ngIf="isOpen"
  class="absolute left-1 top-full mt-2 bg-surface-sunken rounded-lg shadow-lg border border-gray-200 w-[280px] h-auto z-50 flex flex-col">
    
    <!-- Header Notifikasi -->
    <div class="bg-surface-default p-3 flex gap-3 justify-between items-center">
       <app-avatar
       [name]="userName"
       [description]="userRole === '0' ? 'Free Account' : 'Premium Account'"
       variant="square"
       size="sm">

       </app-avatar>
    </div>
    
    <!-- Konten Notifikasi -->
    <div class="p-3 ">
        <div class="p-3">
        <div class="flex-1 flex flex-col justify-center items-center text-center gap-6 p-3">
        <div class="w-[100px] h-[100px]">
            <img src="assets/cek-tarif/empty-result.svg" alt="Notifikasi Icon" class="w-full h-full">
        </div>
       <div class="flex flex-col gap-3">
       <div class="flex flex-col gap-1 max-w-[18rem] mx-auto">
            <p class="text-text-bolder text-sm font-semibold tracking-custom">
               Daftarkan Brand
            </p>
            <p class="text-text-subtler text-xs tracking-custom">
            Dapatkan Fitur Pengaturan Brand untuk dapat mengatur pesanan dengan nama Brandmu sendiri.
            </p>
        </div>
        <div class="py-2 px-3 bg-surface-default border border-line-default rounded-md">
           <p class="text-sm text-text-bolder font-semibold"> Upgrade Akun</p>
        </div>
       </div>
    </div>
        </div>
    </div>
</div>

  `,
})
export class AccountPopupComponent implements OnInit {
  @Input() isOpen = false;
  userName = '';
  userRole = '';


 
  constructor(private profileService: ProfileService) {}

  ngOnInit() {
  
  }



  

 
}
