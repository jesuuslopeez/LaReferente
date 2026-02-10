import { Component } from '@angular/core';
import { BackendInfoPresent } from '../backend-info-present/backend-info-present'

@Component({
  selector: 'app-backend-info-container',
  imports: [BackendInfoPresent],
  templateUrl: './backend-info-container.html',
  styleUrl: './backend-info-container.scss',
})
export class BackendInfoContainer {

}
