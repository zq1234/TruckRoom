import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';  
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-delete-confirmation',
  standalone: true, 
  imports: [MatDialogModule, MatButtonModule],  
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: { serviceId: number }
  ) {}

  confirm() {
    this.dialogRef.close('confirm');
  }

  cancel() {
    this.dialogRef.close();
  }
}
