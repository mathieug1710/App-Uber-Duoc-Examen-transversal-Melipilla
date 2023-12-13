import { Component } from '@angular/core';
import { AnimationController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private anim: AnimationController,
    private nav: NavController
  ) { }

  async ionViewDidEnter(){
    let element = document.querySelector("img")
    await this.anim.create().addElement(element!)
      .duration(1000).fromTo('opacity', 0, 1)
      .fromTo('transform', 'scale(.5)', 'scale(1)')
      .delay(1000).play()

    await this.anim.create().addElement(element!)
      .duration(1000).fromTo('opacity', 1, 0)
      .fromTo('transform', 'scale(1)', 'scale(0)')
      .delay(1000)
      .onFinish(()=>{
        this.nav.navigateForward('principal')
      })
      .play()
  }

}

