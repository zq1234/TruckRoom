import { Component, inject ,Inject} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../services/http.service';
import { TruckService, Task } from '../../interfaces/TruckServiceModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-truckService-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, 
    FormsModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './truckService-form.component.html',
  styleUrls: ['./truckService-form.component.css'],
})
export class TruckServiceFormComponent {
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toaster = inject(ToastrService);

  truckServiceForm: FormGroup;
  serviceId!: number;
  isEdit = false;

  constructor() {
    this.truckServiceForm = this.formBuilder.group({
      serviceId: [0, [Validators.required]],
      serviceName: ['', [Validators.required]],
      serviceDate: ['', [Validators.required]],
      tasks: this.formBuilder.array([], Validators.required), 
    });
  }

  ngOnInit() {
    this.serviceId = this.route.snapshot.params['serviceId'];
    

    if (this.serviceId) {

      this.isEdit = true;
      this.httpService.getTruckService(this.serviceId).subscribe((result: TruckService) => {
        const formattedDate = this.formatDate(result.serviceDate);
        console.log(result);
        this.truckServiceForm.patchValue({
          serviceId: result.serviceId,
          serviceName: result.serviceName,
          serviceDate: result.serviceDate,
        });

        // Set tasks in the form array
        this.setTasks(result.taskViewModel);
      });
    }
  }
 // Format date to YYYY-MM-DD
 formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month (0-based index, so add 1)
  const day = String(d.getDate()).padStart(2, '0'); // Get day
  return `${year}-${month}-${day}`;
}

  // Getter for tasks FormArray
  get tasks(): FormArray {
    return this.truckServiceForm.get('tasks') as FormArray;
  }

  // Helper function to get specific task control
  getTaskControl(index: number): FormGroup {
    return this.tasks.at(index) as FormGroup;
  }
  setTasks(tasks: Task[] | undefined) {
    // Ensure tasks is always an array
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    
    const taskFormGroups = safeTasks.map((task) =>
      this.formBuilder.group({
        taskId: [task.taskId, [Validators.required]],
        taskName: [task.taskName, [Validators.required]],
        description: [task.description],
        remarks: [task.remarks],
      })
    );
    
    this.tasks.clear(); // Clear any previous tasks before adding new ones
    taskFormGroups.forEach((taskGroup) => this.tasks.push(taskGroup)); // Add new tasks to FormArray
  }
  


  // Save function to either update or create the truck service
  save() {
    if (this.truckServiceForm.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }

    console.log(this.truckServiceForm.value);
    const truckService: TruckService = {
      serviceId: this.truckServiceForm.value.serviceId,
      serviceName: this.truckServiceForm.value.serviceName,
      serviceDate: this.truckServiceForm.value.serviceDate,
      taskViewModel: this.truckServiceForm.value.tasks.map((task: any) => ({
        taskId: task.taskId,
        taskName: task.taskName,
        description: task.description,
        remarks: task.remarks,
      })),
    };

    if (this.isEdit) {
      this.httpService
        .updateTruckService(this.serviceId, truckService)
        .subscribe(() => {
          this.toaster.success('Record updated successfully.');
          this.router.navigateByUrl('/servicelist');
        });
    } else {
      this.httpService.createTruckService(truckService).subscribe(() => {
        this.toaster.success('Record added successfully.');
        this.router.navigateByUrl('/servicelist');
      });
    }
  }

  // Add a new task to the tasks FormArray
  addTask() {
    const taskGroup = this.formBuilder.group({
      taskId: [0, [Validators.required]],
      taskName: ['', [Validators.required]],
      description: [''],
      remarks: [''],
    });
    this.tasks.push(taskGroup); // Add new task to FormArray
  }

  removeTask(index: number) {
    this.tasks.removeAt(index); // Remove task from FormArray
  }

  cancel() {
    this.router.navigate(['/servicelist']);
  }
}
