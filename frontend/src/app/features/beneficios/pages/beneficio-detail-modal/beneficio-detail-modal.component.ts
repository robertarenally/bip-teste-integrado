import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-detail-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './beneficio-detail-modal.component.html',
  styleUrl: './beneficio-detail-modal.component.css'
})
export class BeneficioDetailModalComponent {
  @Input({ required: true }) beneficio!: Beneficio;

  readonly activeModal = inject(NgbActiveModal);
}