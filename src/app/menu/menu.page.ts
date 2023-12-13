import { Component, OnInit, NgZone } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
declare var google: any;

export interface Viaje {
  id: number,
  hora: string,
  capacidad: number,
  destino: string,
  precio: number,
  fecha: string,
  usuario: string,
  pasajeros: number,
  nombres?: string[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public map: any;
  public userLocationMarker: any;
  public start: any = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
  public end: any = "Duoc UC: Sede Melipilla - Serrano, Melipilla, Chile";
  public latitude: any;
  public longitude: any;
  public directionsService: any;
  public directionsDisplay: any;
  public autocompleteItems: any[] = [];


  toAdd: Viaje = {
    id: 0,
    hora: "",
    precio: 0,
    capacidad: 0,
    destino: "Pomaire",
    fecha: "",
    usuario: "",
    pasajeros: 0
  }

  isModalOpen = false;

  @ViewChild('map') mapElement: ElementRef | undefined;

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private storage: Storage,
    private modalController: ModalController,
    private toastCtrl: ToastController
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
  }

  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async ngOnInit() {
    const nombreDeUsuarioActual = await this.storage.get('nombreDeUsuario');
  
    if (nombreDeUsuarioActual) {
      const claveViajes = `viajes_${nombreDeUsuarioActual}`;
      let viajes = await this.storage.get(claveViajes) || [];
  
      this.toAdd = {
        id: viajes.length + 1,
        hora: "",
        precio: 0,
        capacidad: 0,
        destino: "Pomaire",
        fecha: "",
        usuario:"",
        pasajeros: 0,
        //nombres que voy a guardar en una lista los usuarios que acepten el viaje
        nombres:[]
      };
  
      await this.storage.create();
    } else {
      console.error("Error: Usuario no ha iniciado sesión.");
      //mostrar un mensaje o redirigir a una página de inicio de sesión.
    }
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.initMap();
      setTimeout(() => {
        this.setOpen(false); // Cierra el modal después de 2 segundos
      }, 1000);
    });
  }

  async crearViaje() {
    const nombreDeUsuarioActual = await this.storage.get('nombreDeUsuario');
    if (nombreDeUsuarioActual) {
      this.toAdd.usuario = nombreDeUsuarioActual;
      const claveViajes = `viajes_${nombreDeUsuarioActual}`;
      let viajes = await this.storage.get(claveViajes) || [];
      this.toAdd.id = viajes.length + 1;
      viajes.push(this.toAdd);
      await this.storage.set(claveViajes, viajes);
      this.verToast();
      if (this.toAdd.capacidad > 5) {
        this.capacidad();
      }
    } else {
      console.error("Error: Usuario no ha iniciado sesión.");
    }
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    let mapOptions = {
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
    };
    this.map = new google.maps.Map(this.mapElement!.nativeElement, mapOptions);
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  updateSearchResults() {
    let GoogleAutocomplete = new google.maps.places.AutocompleteService();
    if (this.toAdd.destino == '') {
      this.autocompleteItems = [];
      return;
    }
    GoogleAutocomplete!.getPlacePredictions({ input: this.toAdd.destino },
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems!.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item: any) {
    this.toAdd.destino = item.description
    this.autocompleteItems = []
    this.initMap()
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.toAdd.destino,
      travelMode: 'DRIVING'
    }, (response: any, status: string) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  async verToast(){
    await this.toastCtrl.create({
      message: "Viaje Creado!!",
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

  async capacidad(){
    await this.toastCtrl.create({
      message: "La capacidad máxima es 5!!",
      duration: 1000,
      position: 'top'
    }).then (res => res.present());
  }
}

