import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pub } from 'src/models/Pub';

@Component({
  selector: 'app-modal-article',
  templateUrl: './modal-article.component.html',
  styleUrls: ['./modal-article.component.css']
})
export class ModalArticleComponent {
  form!: FormGroup;
  dialogTitle: string = 'Add Publication';

  constructor(
    public dialogRef: MatDialogRef<ModalArticleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pub | null
  ) {
    if (data) { // Edit mode
      this.dialogTitle = 'Edit Publication';
      this.form = new FormGroup({
        title: new FormControl(data.title, [Validators.required]),
        type: new FormControl(data.type, [Validators.required]),
        lien: new FormControl(data.lien, [Validators.required]),
        Date: new FormControl(data.Date, [Validators.required]),
        sourcePDF: new FormControl(data.sourcePDF)
      });
    } else { // Create mode
      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        lien: new FormControl('', [Validators.required]),
        Date: new FormControl('', [Validators.required]),
        sourcePDF: new FormControl('')
      });
    }
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
