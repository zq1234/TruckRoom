// src/app/models/truckservice.model.ts
export interface TruckService {
  serviceId: number;
  serviceName: string;
  serviceDate: string;
  taskViewModel: Task[];
}

export interface Task {
  taskId: number;
  taskName: string;
  description?: string;
  remarks?: string;
}
