import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PubService } from 'src/services/pub.service';
import { Pub } from 'src/models/Pub';
import { ModalArticleComponent } from '../modal-article/modal-article.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Pub[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['title', 'type', 'lien', 'Date', 'actions'];

  constructor(
    private pubService: PubService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.pubService.getPublications().subscribe({
      next: (data: Pub[]) => {
        this.articles = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
        this.isLoading = false;
      }
    });
  }

  addArticle(): void {
    const dialogRef = this.dialog.open(ModalArticleComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pubService.createPublication(result).subscribe(() => {
          this.fetchArticles();
        });
      }
    });
  }

  viewArticle(id: number): void {
    // Logic to view article details
    console.log('View Article:', id);
  }

  editArticle(id: number): void {
    this.pubService.getPublicationById(id).subscribe(article => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '500px';
      dialogConfig.data = article;

      const dialogRef = this.dialog.open(ModalArticleComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.pubService.updatePublication(id, result).subscribe(() => {
            this.fetchArticles();
          });
        }
      });
    });
  }

  deleteArticle(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this publication?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pubService.deletePublication(id).subscribe(() => {
          this.articles = this.articles.filter((article) => article.id !== id);
        });
      }
    });
  }
}