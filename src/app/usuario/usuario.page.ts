import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  viajes: any[] = [];
  filtrados: any[] = [];
  nombreDeUsuario: string = '';
  filtro: string = '';
  telefono: string = '';

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private platform: Platform
  ){}

  async ngOnInit() {
    await this.inicializarStorage();
    await this.cargarViajes();
  }

  async inicializarStorage() {
    await this.storage.create();
  }

  async cargarViajes() {
    this.nombreDeUsuario = await this.storage.get('nombreDeUsuario') || '';
    const claveViajes = `viajes_${this.nombreDeUsuario}`;
    this.viajes = await this.storage.get(claveViajes) || [];
    console.log('Viajes cargados:', this.viajes, " ", claveViajes);
    this.filtrados = this.viajes;
  }

  filtrar() {
    this.filtrados = this.viajes.filter((v) => {
      return v.destino.toLowerCase().includes(this.filtro.toLowerCase());
    });
  }

  async ionViewDidEnter() {
    await this.cargarViajes();
  }

  async aceptarViaje(id: number) {
    const viaje = this.viajes.find((v) => v.id === id);
    if (viaje) {
      console.log('Viaje encontrado:', viaje);
      if (!viaje.nombres) {
        viaje.nombres = []; // Inicializa el array si aún no existe
      }
      if (viaje.nombres.length >= viaje.capacidad) {
        this.error();
        return;
      }
      viaje.nombres.push(this.nombreDeUsuario);
      viaje.pasajeros = viaje.pasajeros + 1;
      const claveViajes = `viajes_${this.nombreDeUsuario}`; // Actualiza el array de viajes en el storage
      await this.storage.set(claveViajes, this.viajes);
      this.verToast();
      console.log('Viaje aceptado. Estado actualizado:', this.viajes);
    }
  }

  async verToast() {
    await this.toastCtrl.create({
      message: "Viaje Aceptado!!",
      duration: 1000,
      position: 'top'
    }).then(res => res.present());
  }

  async error() {
    await this.toastCtrl.create({
      message: "No queda capacidad!!",
      duration: 1000,
      position: 'top'
    }).then(res => res.present());
  }

  abrirWhatsapp(telefono: string) {
    if (this.platform.is('mobile')) {
      // Forma el enlace de WhatsApp
      const enlaceWhatsapp = `whatsapp://send?phone=${telefono}`;
      window.open(enlaceWhatsapp, '_system');
    } else if (typeof window.open !== 'undefined') {
      window.open(`https://web.whatsapp.com/send?phone=${telefono}`);
    } else {
      console.warn(
        'Esta función solo está disponible en dispositivos móviles.'
      );
    }
  }
}
