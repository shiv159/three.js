import { Routes } from '@angular/router';
import { ThreeComponent } from './components/three/three.component';
import { LookatComponent } from './components/lookat/lookat.component';
import { TextureComponent } from './components/texture/texture.component';
import { ParticalsComponent } from './components/particals/particals.component';
import { ModelsComponent } from './components/models/models.component';

export const routes: Routes = [
  { path: 'home', component: ThreeComponent },
  { path: 'lookat', component: LookatComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'texture', component: TextureComponent },
  { path: 'particals', component: ParticalsComponent },
  { path: 'model', component: ModelsComponent },
];
