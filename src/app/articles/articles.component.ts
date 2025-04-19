import { Component, OnInit } from '@angular/core';
import { PubService } from 'src/services/pub.service';
import { Pub } from 'src/models/Pub';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Pub[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['title', 'type', 'lien', 'Date', 'actions'];

  constructor(private pubService: PubService) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.pubService.getPublications().subscribe(
      (data: Pub[]) => {
        this.articles = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching articles:', error);
        this.isLoading = false;
      }
    );
  }

  addArticle(): void {
    // Logic to add a new article (e.g., open a dialog or navigate to a form)
    console.log('Add Article button clicked');
  }

  viewArticle(id: number): void {
    // Logic to view article details
    console.log('View Article:', id);
  }

  editArticle(id: number): void {
    // Logic to edit an article
    console.log('Edit Article:', id);
  }

  deleteArticle(id: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.pubService.deletePublication(id).subscribe(() => {
        this.articles = this.articles.filter((article) => article.id !== id);
      });
    }
  }
}