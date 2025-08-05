import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  // estaba como "styleUrl"
})
export class DashboardComponent implements OnInit {

  eventos: any[] = [];
  usuario: any = null;

    constructor(
    private eventService: EventService, // ✅ para obtener eventos
    private authService: AuthService,   // ✅ para logout
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener eventos
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
      },
      error: (err) => {
        console.error('Error al obtener eventos:', err);
      }
    });

    // Obtener datos del usuario
    this.authService.getUser().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }


  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }


  eliminarEvento(id: number): void {
  if (!confirm('¿Estás seguro que querés eliminar este evento?')) return;

  this.eventService.delete(id).subscribe({
    next: () => {
      // Elimina el evento del array local sin recargar
      this.eventos = this.eventos.filter(e => e.id !== id);
    },
    error: (err) => {
      console.error('Error al eliminar el evento:', err);
      alert('Error al eliminar. Revisá la consola.');
    }
  });
}

isEventoPasado(evento: any): boolean {
  const hoy = new Date();
  const fin = new Date(evento.end_date);
  // Compara solo la fecha, no la hora
  return fin < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
}
}
