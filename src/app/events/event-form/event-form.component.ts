import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: false,
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.length > 10 ? dateString.substring(0, 10) : dateString;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;
      this.isLoading = true;

      this.eventService.getById(this.eventId).subscribe({
        next: (event) => {
          this.form.patchValue({
            ...event,
            start_date: this.formatDate(event.start_date),
            end_date: this.formatDate(event.end_date)
          });
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'No se pudo cargar el evento';
          this.isLoading = false;
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formRaw = this.form.value;

    const data = {
        ...formRaw,
        start_date: this.formatDate(formRaw.start_date),
        end_date: this.formatDate(formRaw.end_date)
      };

    if (this.isEditMode && this.eventId !== null) {
      this.eventService.update(this.eventId, data).subscribe({
        next: () => {
          this.successMessage = 'Evento actualizado con éxito.';
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar el evento.';
          this.isLoading = false;
        }
      });
    } else {
      this.eventService.create(data).subscribe({
        next: () => {
          this.successMessage = 'Evento creado con éxito.';
          this.form.reset();
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Error al crear el evento.';
          this.isLoading = false;
        }
      });
    }
  }
}
