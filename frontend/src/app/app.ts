import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomExampleComponent } from './components/dom-example/dom-example.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DomExampleComponent,
    MenuComponent,
    ModalComponent,
    TabsComponent,
    TooltipDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly themeService = inject(ThemeService);

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
