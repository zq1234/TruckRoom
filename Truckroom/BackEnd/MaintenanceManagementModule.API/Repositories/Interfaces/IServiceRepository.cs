using MaintenanceManagementModule.API.Models;
using  MaintenanceManagementModule.API.ViewModels;

namespace MaintenanceManagementModule.API.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int id);
        Task AddAsync(AddServiceViewModel service);
        Task UpdateAsync(int id, UpdateServiceViewModel service);
        Task DeleteAsync(int id);
    }
}

