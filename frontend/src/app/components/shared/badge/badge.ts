import { Component, input } from '@angular/core'; 

  @Component({                                                                                 
    selector: 'app-badge',                                                                     
    imports: [],                                                                               
    templateUrl: './badge.html',                                                               
    styleUrl: './badge.scss',                                                                  
  })  
  export class Badge {                                                                         
    readonly text = input.required<string>();                                                  
    readonly variant = input<string>('default');                                               
    readonly size = input<string>('md');                                                                                                                                            
  }        