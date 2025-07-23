import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet,ToastController } from '@ionic/angular/standalone';
import { AlertComponent } from "./components/alert/alert.component";
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [ IonApp, IonRouterOutlet, AlertComponent],
})
export class AppComponent implements OnInit {
  backButtonPressedOnce = false;
  backButtonTimeout: any;

  constructor(
    private platform: Platform,
    private router: Router,
    private location: Location,
    private toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backButtonEvent();
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      
      // Jika berada di halaman root/dashboard
      if (url === '/dashboard' || url === '/masuk' || url === '/') {
        if (this.backButtonPressedOnce) {
          // Jika sudah ditekan sebelumnya, keluar dari aplikasi
          clearTimeout(this.backButtonTimeout);
          App.exitApp();
        } else {
          // Set flag bahwa tombol back sudah ditekan sekali
          this.backButtonPressedOnce = true;
          
          // Tampilkan toast
          this.presentToast('Tekan sekali lagi untuk keluar');
          
          // Reset flag setelah 2 detik jika tombol tidak ditekan lagi
          this.backButtonTimeout = setTimeout(() => {
            this.backButtonPressedOnce = false;
          }, 2000);
        }
      } else {
        // Navigasi ke halaman sebelumnya
        this.location.back();
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  ngOnInit() {
    // Initialize any necessary data or services here
  }
}