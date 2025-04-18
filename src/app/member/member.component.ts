import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/Member';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit {
  dataSource: Member[] = [];
  displayedColumns: string[] = [
    'id',
    'cin',
    'name',
    'type',
    'createDate',
    'action',
  ];
  // Injection de MemberService dans le composant
  constructor(private memberService: MemberService,private dialog: MatDialog) {}

  ngOnInit() {
    this.memberService.getAllMembers().subscribe((data) => {
      this.dataSource = data;
    });
  }
  deleteMember(id: string) {
    // ouvrir boite (mil ConfirmComponent)
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '400px',
      width: '600px',
    });
    //attendre le résultat de click 
    //3 si click = confirm => effacer
    dialogRef.afterClosed().subscribe(result => {
     if(result)
      {this.memberService.deleteMember(id).subscribe(() => {
      this.dataSource = this.dataSource.filter((member) => member.id !== id);
    });}
    });
    
    
  }
}
