using MaintenanceManagementModule.API.Models;
using MaintenanceManagementModule.API.Repositories.Interfaces;
using MaintenanceManagementModule.API.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace MaintenanceManagementModule.API.Repositories.Implementation
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly MaintenanceDbContext _context;

        public ServiceRepository(MaintenanceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .Include(s => s.Tasks)
                .AsNoTracking() 
                .ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services
                .Include(s => s.Tasks)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.ServiceId == id);
        }

        public async Task AddAsync(AddServiceViewModel model)
        {
            var service = new Service
            {
                ServiceName = model.ServiceName,
                ServiceDate = model.ServiceDate,
                Tasks = model.TaskViewModel.Select(t => new Tasks
                {
                    TaskName = t.TaskName,
                    Description = t.Description,
                    Remarks = t.Remarks
                }).ToList()
            };

            await _context.Services.AddAsync(service);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, UpdateServiceViewModel model)
        {
            var existingService = await _context.Services
                .Include(s => s.Tasks) 
                .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (existingService != null)
            {
                existingService.ServiceName = model.ServiceName;
                existingService.ServiceDate = model.ServiceDate;

                _context.Tasks.RemoveRange(existingService.Tasks);
                existingService.Tasks = model.Tasks.Select(t => new Tasks
                {
                    TaskName = t.TaskName,
                    Description = t.Description,
                    Remarks = t.Remarks
                }).ToList();

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var service = await _context.Services
                .Include(s => s.Tasks) 
                .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (service != null)
            {
                _context.Tasks.RemoveRange(service.Tasks); 
                _context.Services.Remove(service);        
                await _context.SaveChangesAsync();
            }
        }

       
    }
}
