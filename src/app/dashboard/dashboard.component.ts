import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { PubService } from 'src/services/pub.service';
import { EventService } from 'src/services/event.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType, ChartData } from 'chart.js';

// Custom interfaces for our data types
interface CustomEvent {
  id: string;
  titre: string;
  datedebut: string;
  datefin: string;
  lieu: string;
}

interface CustomMember {
  id: string;
  cin: string;
  nom: string;
  type: string;
  createDate: string;
}

interface CustomPublication {
  id: string;
  title: string;
  type: string;
  Date: string;
  lien: string;
  sourcePDF: string;
}

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
  NbStudents: number = 0;
  NbTeachers: number = 0;

  // Chart data for member distribution
  memberChartData: ChartConfiguration['data']['datasets'] = [
    {
      label: 'Membres',
      data: [],
      backgroundColor: ['#3F51B5', '#009688'],
      borderColor: ['#303F9F', '#00796B'],
      borderWidth: 1,
      hoverOffset: 6,
      borderRadius: 4
    }
  ];
  memberChartLabels: string[] = ["Student", "Teacher"];

  // Chart data for events distribution by location
  eventLocationChartData: ChartConfiguration['data']['datasets'] = [
    {
      label: 'Événements par lieu',
      data: [],
      backgroundColor: ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'],
      borderColor: ['#D32F2F', '#1976D2', '#388E3C', '#FFA000', '#7B1FA2', '#0097A7'],
      borderWidth: 1,
      hoverOffset: 6,
      borderRadius: 4
    }
  ];
  eventLocationLabels: string[] = [];

  // Common chart options
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 5,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 8,
        cornerRadius: 4,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 3,
        usePointStyle: true
      }
    }
  };

  // Line chart data for PrimeNG
  lineChartData: any;

  // Year selector properties
  selectedYear: number = new Date().getFullYear(); // Default to current year
  availableYears: number[] = [];

  // Line chart options for PrimeNG
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois'
        },
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre'
        },
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Loading indicator
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
    // Use forkJoin to execute multiple requests in parallel
    forkJoin({
      members: this.memberService.getAllMembers(),
      publications: this.pubService.getPublications(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (results) => {
        // Update global counters
        this.membersCount = results.members.length;
        this.publicationsCount = results.publications.length;
        this.eventsCount = results.events.length;



        // Reset student and teacher counters
        this.NbStudents = 0;
        this.NbTeachers = 0;

        // Loop through members and count students and teachers (case-insensitive)
        for (let member of results.members) {
          const memberType = member.type ? member.type.toLowerCase() : '';
          if (memberType === 'student') {
            this.NbStudents++;
          } else if (memberType === 'teacher') {
            this.NbTeachers++;
          }
        }

        // Update the member distribution chart data
        this.memberChartData = [
          {
            label: 'Membres',
            data: [this.NbStudents, this.NbTeachers],
            backgroundColor: ['#3F51B5', '#009688'],
            borderColor: ['#303F9F', '#00796B'],
            borderWidth: 1,
            hoverOffset: 6,
            borderRadius: 4
          }
        ] as ChartConfiguration['data']['datasets'];

        // Process event locations for the second chart
        const locationCounts: {[key: string]: number} = {};

        // Count events by location - using type assertion with unknown as intermediate step
        const customEvents = results.events as unknown as CustomEvent[];
        for (let event of customEvents) {
          const location = event.lieu;
          if (location) {
            if (locationCounts[location]) {
              locationCounts[location]++;
            } else {
              locationCounts[location] = 1;
            }
          }
        }

        // Convert to arrays for chart data
        const locations = Object.keys(locationCounts);
        const counts = locations.map(loc => locationCounts[loc]);

        // Set colors based on number of locations
        const backgroundColors = ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'];
        const borderColors = ['#D32F2F', '#1976D2', '#388E3C', '#FFA000', '#7B1FA2', '#0097A7'];

        // Limit to the first 6 colors if there are more locations
        const bgColors = backgroundColors.slice(0, locations.length);
        const bdColors = borderColors.slice(0, locations.length);

        // Update event location chart data
        this.eventLocationLabels = locations;
        this.eventLocationChartData = [
          {
            label: 'Événements par lieu',
            data: counts,
            backgroundColor: bgColors,
            borderColor: bdColors,
            borderWidth: 1,
            hoverOffset: 6,
            borderRadius: 4
          }
        ] as ChartConfiguration['data']['datasets'];

        // Generate data for the line chart
        this.generateLineChartData(results.members as unknown as CustomMember[],
                                  results.events as unknown as CustomEvent[],
                                  results.publications as unknown as CustomPublication[]);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Generate data for the line chart showing distribution of members, events, and publications over time
   */
  generateLineChartData(members: CustomMember[], events: CustomEvent[], publications: CustomPublication[]): void {
    // Define months for x-axis
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    // Initialize data arrays with zeros
    const membersData = Array(12).fill(0);
    const eventsData = Array(12).fill(0);
    const publicationsData = Array(12).fill(0);

    // Generate list of available years from data
    this.generateAvailableYears(members, events, publications);

    // Process members data
    members.forEach(member => {
      try {
        let date = new Date(member.createDate);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = date.getMonth();

          // Only count if it matches the selected year
          if (year === this.selectedYear) {
            membersData[month]++;
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Process events data
    events.forEach(event => {
      try {
        let date = new Date(event.datedebut);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = date.getMonth();

          // Only count if it matches the selected year
          if (year === this.selectedYear) {
            eventsData[month]++;
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Process publications data
    publications.forEach(pub => {
      try {
        let date = new Date(pub.Date);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = date.getMonth();

          // Only count if it matches the selected year
          if (year === this.selectedYear) {
            publicationsData[month]++;
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Create the line chart data
    this.lineChartData = {
      labels: months,
      datasets: [
        {
          label: 'Membres',
          data: membersData,
          fill: false,
          borderColor: '#3F51B5',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          tension: 0.4,
          pointBackgroundColor: '#3F51B5',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3F51B5'
        },
        {
          label: 'Événements',
          data: eventsData,
          fill: false,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          tension: 0.4,
          pointBackgroundColor: '#F44336',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#F44336'
        },
        {
          label: 'Publications',
          data: publicationsData,
          fill: false,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4CAF50'
        }
      ]
    };
  }

  /**
   * Generate list of available years from data
   */
  generateAvailableYears(members: CustomMember[], events: CustomEvent[], publications: CustomPublication[]): void {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();

    // Always include current year and previous year
    years.add(currentYear);
    years.add(currentYear - 1);

    // Extract years from members data
    members.forEach(member => {
      try {
        const date = new Date(member.createDate);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Extract years from events data
    events.forEach(event => {
      try {
        const date = new Date(event.datedebut);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Extract years from publications data
    publications.forEach(pub => {
      try {
        const date = new Date(pub.Date);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Convert Set to Array and sort in descending order (newest first)
    this.availableYears = Array.from(years).sort((a, b) => b - a);

    // If selected year is not in the list, default to the most recent year
    if (!this.availableYears.includes(this.selectedYear) && this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    }
  }

  /**
   * Handle year selection change
   */
  onYearChange(event: any): void {
    this.selectedYear = parseInt(event.target.value);
    // Reload dashboard data to update the chart with the new selected year
    this.loadDashboardData();
  }
}
