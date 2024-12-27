// truckservice-list.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TruckService, Task } from '../../interfaces/TruckServiceModel';
import { HttpService } from '../../services/http.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TruckServiceFormComponent } from '../truckservice-form/truckservice-form.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-truckService-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './truckService-list.component.html',
  styleUrls: ['./truckService-list.component.css'],
})
export class TruckServiceListComponent {
  truckServiceList: TruckService[] = [];
  httpService = inject(HttpService);
  toaster = inject(ToastrService);
  dialog = inject(MatDialog);
  router = inject(Router);

  displayedColumns: string[] = ['serviceId', 'serviceName', 'serviceDate', 'tasks', 'action'];

  ngOnInit() {
    this.getTruckServiceFromServer();
  }

  // Fetch all truck services from the server
  getTruckServiceFromServer() {
    this.httpService.getAllTruckService().subscribe((result) => {
      this.truckServiceList = result;
    });
  }

  // Open the dialog to edit a truck service
  edit(id: number) {
    this.httpService.getTruckService(id).subscribe((result: TruckService) => {
      const dialogRef = this.dialog.open(TruckServiceFormComponent, {
        data: { serviceId: id },
        width: '600px',
      });

      dialogRef.afterOpened().subscribe(() => {
        const componentInstance = dialogRef.componentInstance;
        componentInstance.truckServiceForm.patchValue({
          serviceId: result.serviceId,
          serviceName: result.serviceName,
          serviceDate: result.serviceDate,
        });
        componentInstance.setTasks(result.taskViewModel);
      });
    });
  }

  // Delete a truck service
  delete(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: { serviceId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.httpService.deleteTruckService(id).subscribe(() => {
          this.getTruckServiceFromServer();
          this.toaster.success('Service deleted successfully');
        });
      }
    });
  }

  // Navigate to the create service page
  navigateToCreateService() {
    this.router.navigate(['/createservice']);
  }

  // Helper function to get task names as a string
  getTaskNames(tasks: Task[]): string {
    return tasks.map((task) => task.taskName).join(', ');
  }
}
