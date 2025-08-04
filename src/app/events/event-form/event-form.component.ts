import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-event-form',
  standalone: false,
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {

  form: FormGroup;
  isEditMode = false;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required], // Agregado
      end_date: ['', Validators.required]     // Agregado
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;

      this.eventService.getById(this.eventId).subscribe({
        next: (event) => this.form.patchValue(event),
        error: () => alert('No se pudo cargar el evento'),
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.isEditMode && this.eventId !== null) {
      this.eventService.update(this.eventId, data).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.eventService.create(data).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

}
