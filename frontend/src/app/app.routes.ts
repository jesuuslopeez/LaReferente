import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Competitions } from './pages/competitions/competitions';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'style-guide', component: StyleGuide },
  { path: 'competiciones', component: Competitions },
];
