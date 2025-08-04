import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  // estaba como "styleUrl"
})
export class DashboardComponent implements OnInit {

   eventos: any[] = [];

  constructor(private AuthService: EventService) {}

  ngOnInit(): void {
    this.AuthService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
      },
      error: (err) => {
        console.error('Error al obtener eventos:', err);
      }
    });
  }

}
