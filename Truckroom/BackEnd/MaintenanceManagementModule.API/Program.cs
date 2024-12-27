using System.Text;
using MaintenanceManagementModule.API.Models;
using MaintenanceManagementModule.API.Repositories.Implementation;
using MaintenanceManagementModule.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure SQL Server with EF Core
builder.Services.AddDbContext<MaintenanceDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
	.AddEntityFrameworkStores<MaintenanceDbContext>()
	.AddDefaultTokenProviders();

// Configure repository
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();

// Configure controllers with JSON options
builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
		// Remove the ReferenceHandler.Preserve to avoid $id serialization
		options.JsonSerializerOptions.ReferenceHandler = null;
	});

// Configure authentication with JWT
builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
// Adding Jwt Bearer
.AddJwtBearer(o =>
{
	o.RequireHttpsMetadata = false;
	o.SaveToken = true;
	o.TokenValidationParameters = new TokenValidationParameters
	{
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtToken:Secret"])),
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = false,
		ValidateIssuerSigningKey = true
	};
});

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
	{
		Name = "Authorization",
		Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = Microsoft.OpenApi.Models.ParameterLocation.Header,
		Description = "Please enter your JWT Bearer token"
	});

	c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
	{
		{
			new Microsoft.OpenApi.Models.OpenApiSecurityScheme
			{
				Reference = new Microsoft.OpenApi.Models.OpenApiReference
				{
					Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			new string[] {}
		}
	});
});

var app = builder.Build();
using (var serviceScope = app.Services.CreateScope())
{
	var services = serviceScope.ServiceProvider;
	var dbContext = services.GetRequiredService<MaintenanceDbContext>();
	var conn = dbContext.Database.GetConnectionString();

	Console.WriteLine("Checking if database exists...");

	// Check if the database exists
	var databaseExists = dbContext.Database.CanConnect(); 
	// Check if the connection to the DB can be established

	if (!databaseExists)
	{
		Console.WriteLine("Database does not exist. Migrating DB...");
		// Apply migration if the database does not exist
		dbContext.Database.Migrate();
		Console.WriteLine("Migration completed.");
	}
	else
	{
		Console.WriteLine("Database already exists. Skipping migration.");
	}
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseCors(policy =>
	policy.WithOrigins("http://localhost:4200")
		.AllowAnyHeader()
		.AllowAnyMethod());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
