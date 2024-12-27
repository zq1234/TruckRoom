using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MaintenanceManagementModule.API.Models
{
    public class MaintenanceDbContext : IdentityDbContext<ApplicationUser>
    {
        public MaintenanceDbContext(DbContextOptions<MaintenanceDbContext> options) : base(options) { }
        public DbSet<Service> Services { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
    }

}

