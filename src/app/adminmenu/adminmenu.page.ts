import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router de Angular
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-adminmenu',
  templateUrl: './adminmenu.page.html',
  styleUrls: ['./adminmenu.page.scss'],
})
export class AdminmenuPage implements OnInit {

  usuario: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private ngZone: NgZone
    ) { }

    async ngOnInit() {
      await this.storage.create(); // Inicializa el almacenamiento
  
      // Recupera el nombre de usuario del almacenamiento
      this.usuario = await this.storage.get('nombreDeUsuario');

    //this.ngZone.run(() => {
      //this.router.navigate(['adminmenu']);
    //});
  }

  login() {
    this.router.navigate(['menu']);
  }

  viajes() {
    this.router.navigate(['usuario']);
  }

  misviajes() {
    this.router.navigate(['viajes']);
  }

  async cerrar() {
    this.router.navigate(['/principal']);
  }

}
