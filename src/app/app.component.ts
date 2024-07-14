import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreeComponent } from './components/three/three.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ThreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';
}
