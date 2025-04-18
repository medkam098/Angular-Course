import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from 'src/services/event.service';
import { ModalEventComponent } from '../modal-event/modal-event.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { VisibilityComponent } from '../visibility/visibility.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements AfterViewInit,OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'titre',
    'datedebut',
    'datefin',
    'lieu',
    'Actions',
  ];
dataSource: MatTableDataSource<Event>;

constructor(private ES:EventService,private dialog:MatDialog) {
  this.dataSource = new MatTableDataSource();
 }
ngOnInit():void{
    this.fetchData();
}
fetchData()
{
  this.ES.getAllEvents().subscribe((data)=>{
  this.dataSource.data=data
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
//lanceer et ouvrir la boite de dialogue
open(){
  const dialogRef = this.dialog.open(ModalEventComponent);
  //subscriber
  dialogRef.afterClosed().subscribe((result)=>{
    if(result){
      this.ES.addEvent(result).subscribe(()=>{
        this.fetchData();
      })
    }
  })
}
openEdit(id: number): void {
  this.ES.getEventById(id).subscribe((EventRecupere) => {
    const x = new MatDialogConfig();
    x.data = EventRecupere;
    const dialogRef = this.dialog.open(ModalEventComponent, x);
    console.log("données", x.data);

    dialogRef.afterClosed().subscribe((EventRecupere) => {
      if (EventRecupere) {
        this.ES.updateEvent(id, EventRecupere).subscribe(() => {
          this.fetchData();
        });
      }
    });
  });
}
delete(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent);
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.ES.deleteEvent(id).subscribe(() => {
        this.fetchData();
      });
    }
  });
}
openvis(id:number){
  //envoyer id vers la bôite de dialogue
  const x = new MatDialogConfig();
  x.data = id;
  const dialogRef = this.dialog.open(VisibilityComponent, x);
}
}