import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';
  repetirContrasena: string= '';
  esChofer: boolean = false;
  telefono: string = '';

  constructor(
    private storage: Storage,
    private alertController: AlertController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }

  async registrarUsuario() {
    const usuarioRegistrado = await this.storage.get(this.usuario);
    if (usuarioRegistrado) {
      this.mostrarAlerta('Error', 'El usuario ya está registrado');
    } else {
      if (this.usuario && this.contrasena && this.repetirContrasena) {
        if (this.contrasena.length >= 8) { // Validar longitud mínima de la contraseña
          if (this.contrasena === this.repetirContrasena) {
            await this.storage.set(this.usuario, this.contrasena);
            await this.storage.set(`${this.usuario}_esChofer`, this.esChofer);
            await this.storage.set(`${this.usuario}_telefono`, this.telefono);
            this.mostrarAlerta('Registro exitoso', 'El usuario se ha registrado correctamente');
            this.redirigirDespuesDeEspera();
          } else {
            this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
          }
        } else {
          this.mostrarAlerta('Error', 'La contraseña debe tener al menos 8 caracteres');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos');
      }
    }
  }

  redirigirDespuesDeEspera() {
    setTimeout(() => {
      this.router.navigate(['/principal']);
    }, 1000);
  }
}

