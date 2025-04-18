import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
      // Injection de HttpClient dans le service
    }
    // Fonction qui retourne un tableau de membres
    getAllEvents(): Observable<Event[]> {
      return this.http.get<Event[]>('http://localhost:3000/Events');
    }
    addEvent(event: Event): Observable<void> {
        return this.http.post<void>('http://localhost:3000/Events', event);
      }
      updateEvent(id: number,event: Event): Observable<void> {
        return this.http.put<void>(`http://localhost:3000/Events/${id}`, event);
      }
      getEventById(id: number): Observable<Event> {
          return this.http.get<Event>(`http://localhost:3000/Events/${id}`);
        }
        deleteEvent(id: number): Observable<void> {
            return this.http.delete<void>(`http://localhost:3000/Events/${id}`);
          }
}
