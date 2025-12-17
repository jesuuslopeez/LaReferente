import { Component } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { CompetitionCard } from '../../components/shared/competition-card/competition-card';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { FormCheckbox } from '../../components/shared/form-checkbox/form-checkbox';
import { Alert } from '../../components/shared/alert/alert';

@Component({
  selector: 'app-style-guide',
  imports: [Button, Card, CompetitionCard, FormInput, FormTextarea, FormSelect, FormCheckbox, Alert],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {
  countryOptions: SelectOption[] = [
    { value: 'es', label: 'España' },
    { value: 'fr', label: 'Francia' },
    { value: 'it', label: 'Italia' },
    { value: 'de', label: 'Alemania' },
    { value: 'uk', label: 'Reino Unido' },
  ];

  positionOptions: SelectOption[] = [
    { value: 'gk', label: 'Portero' },
    { value: 'def', label: 'Defensa' },
    { value: 'mid', label: 'Centrocampista' },
    { value: 'fwd', label: 'Delantero' },
  ];

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
