import { Component } from '@angular/core';
import { BackendInfoContainer } from '../../components/shared/backend-info-container/backend-info-container';

@Component({
    selector: 'app-city',
    standalone: true,
    imports: [BackendInfoContainer],
    templateUrl: './city.html',
    styleUrl: './city.scss',
})
export class City {

}