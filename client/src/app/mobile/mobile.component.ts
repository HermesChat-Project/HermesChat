import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent {
  constructor(private router: Router) { }

  ngOnInit(){
    if(window.innerWidth > 768)
      this.router.navigate([''])
  }
  lottieOptions = {
    path: 'assets/animation/coding.json',
  };

  light: boolean = false;

  triggerLamp(){
    this.light = !this.light;
  }
}
