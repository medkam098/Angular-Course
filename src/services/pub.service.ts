import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pub } from '../models/Pub';

@Injectable({
  providedIn: 'root'
})
export class PubService {
  private apiUrl = 'http://localhost:3000/Pub'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Fetch all publications
  getPublications(): Observable<Pub[]> {
    return this.http.get<Pub[]>(`${this.apiUrl}`);
  }

  // Fetch a single publication by ID
  getPublicationById(id: number): Observable<Pub> {
    return this.http.get<Pub>(`${this.apiUrl}/${id}`);
  }

  // Create a new publication
  createPublication(publication: Pub): Observable<Pub> {
    return this.http.post<Pub>(`${this.apiUrl}`, publication);
  }

  // Update an existing publication
  updatePublication(id: number, publication: Pub): Observable<Pub> {
    return this.http.put<Pub>(`${this.apiUrl}/${id}`, publication);
  }

  // Delete a publication
  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
