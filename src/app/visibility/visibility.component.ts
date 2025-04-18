import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from 'src/services/event.service';

@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.css']
})
export class VisibilityComponent {
  evt: any;

  constructor(
    public dialogRef: MatDialogRef<VisibilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService
  ) {
    console.log("datarecuper", data);
    this.fetchEventDetails(data);
  }

  fetchEventDetails(id: number): void {
    this.eventService.getEventById(id).subscribe((event) => {
      this.evt = event;
      console.log("Event details", this.evt);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}