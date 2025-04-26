import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Pub>;
  isLoading: boolean = true;
  displayedColumns: string[] = ['title', 'type', 'lien', 'Date', 'actions'];

  constructor(
    private pubService: PubService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Pub>();
  }

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.isLoading = true;
    this.pubService.getPublications().subscribe({
      next: (data: Pub[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
          // Refresh the data after deletion
          this.fetchArticles();
        });
      }
    });
  }
}