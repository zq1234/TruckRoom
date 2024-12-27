using MaintenanceManagementModule.API.Models;
using MaintenanceManagementModule.API.Repositories.Interfaces;
using MaintenanceManagementModule.API.ViewModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaintenanceManagementModule.API.Controllers
{
	[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceRepository _repository;

        public ServiceController(IServiceRepository repository)
        {
            _repository = repository;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var services = await _repository.GetAllAsync();
            return Ok(services);
        }
		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var service = await _repository.GetByIdAsync(id);  
			if (service == null)
			{
				return NotFound(); 
			}
			return Ok(service); 
		}
		[HttpPost("Create")]
        public async Task<IActionResult> Create(AddServiceViewModel service)
        {
            await _repository.AddAsync(service);
            return CreatedAtAction(nameof(GetAll), new { id = service.ServiceId }, service);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateServiceViewModel service)
        {
            if (id <0 )

                return BadRequest();

            await _repository.UpdateAsync(id,service);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }

}

