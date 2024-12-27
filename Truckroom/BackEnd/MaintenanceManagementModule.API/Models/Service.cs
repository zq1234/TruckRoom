using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MaintenanceManagementModule.API.Models
{
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public DateTime ServiceDate { get; set; } = DateTime.Now;
        public List<Tasks> Tasks { get; set; } = new();
    }

}


