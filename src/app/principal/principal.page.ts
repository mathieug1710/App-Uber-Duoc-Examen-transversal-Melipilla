import { Component } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular'; // Importa el AlertController
import { Router } from '@angular/router'; // Importa el Router de Angular
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage {

  usuario = "";
  contrasena = "";

  constructor(
    private anim: AnimationController, 
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private toastCtrl: ToastController
    ) {}

    async login() {
      const storedPassword = await this.storage.get(this.usuario); // Obtener la contraseña almacenada para el usuario
  
      if (storedPassword === this.contrasena) {
        await this.storage.set('nombreDeUsuario', this.usuario); // Almacena el nombre de usuario en el storage
        const esChofer = await this.storage.get(`${this.usuario}_esChofer`);
        if (esChofer) {
          this.router.navigate(['/adminmenu']);
          await this.verToast();
        } else {
          this.router.navigate(['/usuario']);
        }
      } else {
        await this.toastError();
      }
    }


    async mostrarAlerta(titulo: string, mensaje: string) {
      const alert = await this.alertController.create({
        header: titulo,
        message: mensaje,
        buttons: ['OK']
      });
  
      await alert.present();
    }

    async verToast(){
      await this.toastCtrl.create({
        message: "Bienvenido 😊",
        duration: 1000,
        position: 'top'
      }).then (res => res.present());
    }

    async toastError(){
      await this.toastCtrl.create({
        message: "Credenciales incorrectas!!",
        duration: 1000,
        position: 'top'
      }).then (res => res.present());
    }
    
    
}
