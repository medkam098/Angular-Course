import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-event',
  templateUrl: './modal-event.component.html',
  styleUrls: ['./modal-event.component.css']
})
export class ModalEventComponent  {
  form!: FormGroup;

    constructor(public dialogRef: MatDialogRef<ModalEventComponent>,
      @Inject(MAT_DIALOG_DATA) data: any
    ) {
      if(data){ // extraction données
        console.log("donnes reçus",data);
        this.form = new FormGroup({
          titre: new FormControl(data.titre),
          datedebut: new FormControl(data.datedebut),
          datefin: new FormControl(data.datefin),
          lieu: new FormControl(data.lieu),
        });
      } else // create
      {
        this.form=new FormGroup({
          titre:new FormControl(null),
          datedebut:new FormControl(null),
          datefin:new FormControl(null),
          lieu:new FormControl(null),
      })

     }
    }

//forçage de type

  //déclaration de form
  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
close() {
    this.dialogRef.close();
}
// code de save et close 
}
