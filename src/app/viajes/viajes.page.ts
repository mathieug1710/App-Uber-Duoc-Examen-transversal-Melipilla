import { Storage } from '@ionic/storage-angular';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface Viaje {
  id: number,
  hora: string,
  capacidad: number,
  destino: string,
  precio: number,
  fecha: string,
  pasajeros: number,
  nombres?: string[];
  telefono: string;
}

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  viajes: Viaje[] = [];
  nombreDeUsuario: string = '';
  telefono: string = '';

  constructor(private storage: Storage, private alertCtrl: AlertController) { }

  async ngOnInit() {
    await this.loadUsuario();
    await this.loadViajes();
  }

  async loadUsuario() {
    this.nombreDeUsuario = await this.storage.get('nombreDeUsuario') || '';
  }

  async loadViajes() {
    if (this.nombreDeUsuario) {
      const claveViajes = `viajes_${this.nombreDeUsuario}`;
      this.viajes = await this.storage.get(claveViajes) || [];
    } else {
      console.error("Error: Usuario no ha iniciado sesión.");
      // También podrías mostrar un mensaje o redirigir a una página de inicio de sesión.
    }
  }

  async ionViewDidEnter() {
    // Mantén esta función para cargar los viajes en el evento de entrada de la vista si es necesario.
  }
  
  async eliminarViaje(id: number) {
    const confirmacion = await this.confirmarEliminacion();
    if (confirmacion) {
      this.viajes = this.viajes.filter(viaje => viaje.id !== id);
      const claveViajes = `viajes_${this.nombreDeUsuario}`;
      await this.storage.set(claveViajes, this.viajes);
    }
  }
  
  async confirmarEliminacion(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar',
        message: '¿Seguro que quieres eliminar este viaje?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Eliminar',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }
}
