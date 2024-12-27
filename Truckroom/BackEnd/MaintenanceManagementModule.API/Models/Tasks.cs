using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MaintenanceManagementModule.API.Models;
using System.Text.Json.Serialization;

namespace MaintenanceManagementModule.API.Models
{
    public class Tasks
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Remarks { get; set; } = string.Empty;
        public int ServiceId { get; set; }
        [JsonIgnore] // Avoid cycles during serialization
        public Service? Service { get; set; }
    }
}




