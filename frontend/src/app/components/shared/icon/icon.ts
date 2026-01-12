import { Component, input } from '@angular/core';

export type IconName = 
  // Heroicons
  | 'archive-box'
  | 'arrow-right-on-rectangle'
  | 'calendar'
  | 'chevron-down'
  | 'envelope'
  | 'flag'
  | 'lock-closed'
  | 'magnifying-glass'
  | 'map-pin'
  | 'moon'
  | 'sun'
  | 'user-group'
  | 'user-plus'
  | 'user'
  | 'x-mark'
  // Social
  | 'facebook'
  | 'instagram'
  | 'x';

export type IconCategory = 'heroicons' | 'social';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img 
      [src]="iconPath()" 
      [alt]="alt()" 
      [class]="iconClass()"
      [style.width]="size()"
      [style.height]="size()"
    />
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    img {
      display: block;
    }
  `]
})
export class Icon {
  name = input.required<IconName>();
  category = input<IconCategory>('heroicons');
  size = input<string>('24px');
  alt = input<string>('');
  iconClass = input<string>('');

  iconPath = () => {
    return `assets/icons/${this.category()}/${this.name()}.svg`;
  };
}
