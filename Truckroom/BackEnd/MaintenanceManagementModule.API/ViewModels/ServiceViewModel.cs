
using System;
using System.ComponentModel.DataAnnotations.Schema;
using MaintenanceManagementModule.API.Models;

namespace MaintenanceManagementModule.API.ViewModels
{
    public class AddServiceViewModel
    {
        [NotMapped]
        public int? ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public DateTime ServiceDate { get; set; } = DateTime.Now;
        public List<TaskViewModel> TaskViewModel { get; set; } = new();
    }
    public class TaskViewModel
    {
        public string TaskName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Remarks { get; set; }
        
    }
    public class UpdateServiceViewModel
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public DateTime ServiceDate { get; set; }
        public List<TaskViewModel> Tasks { get; set; } = new();
    }
}

