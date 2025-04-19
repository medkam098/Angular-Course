import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { PubService } from 'src/services/pub.service';
import { EventService } from 'src/services/event.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Statistiques
  membersCount: number = 0;
  publicationsCount: number = 0;
  eventsCount: number = 0;
  toolsCount: number = 0;

  // Données pour les événements à venir
  upcomingEvents: any[] = [];

  // Indicateur de chargement
  isLoading: boolean = true;

  constructor(
    private memberService: MemberService,
    private pubService: PubService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Utiliser forkJoin pour exécuter plusieurs requêtes en parallèle
    forkJoin({
      members: this.memberService.getAllMembers(),
      publications: this.pubService.getPublications(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (results) => {
        // Mettre à jour les compteurs
        this.membersCount = results.members.length;
        this.publicationsCount = results.publications.length;
        this.eventsCount = results.events.length;
        this.toolsCount = 5; // Valeur par défaut car pas de service pour les outils

        // Traiter les événements pour obtenir les événements à venir
        this.processUpcomingEvents(results.events);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  processUpcomingEvents(events: any[]): void {
    const today = new Date();

    // Filtrer les événements à venir (date de début supérieure à aujourd'hui)
    const upcoming = events
      .filter(event => {
        const eventDate = new Date(event.datedebut);
        return eventDate >= today;
      })
      .sort((a, b) => {
        // Trier par date de début (croissant)
        return new Date(a.datedebut).getTime() - new Date(b.datedebut).getTime();
      })
      .slice(0, 3); // Prendre les 3 premiers événements

    // Formater les événements pour l'affichage
    this.upcomingEvents = upcoming.map(event => {
      const eventDate = new Date(event.datedebut);
      return {
        id: event.id,
        title: event.titre,
        location: event.lieu,
        day: eventDate.getDate(),
        month: eventDate.toLocaleString('default', { month: 'short' })
      };
    });
  }
}
