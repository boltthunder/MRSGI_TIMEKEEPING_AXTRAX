using Microsoft.EntityFrameworkCore;
using MRSGI_API.Fld_Model;
using NewMRSGI_API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// ✅ DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Controllers
builder.Services.AddControllers();

// ✅ SignalR
builder.Services.AddSignalR();

// ✅ Background Service (for real-time push)
builder.Services.AddHostedService<AttendanceService>();

// ✅ CORS (important for React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
          policy => policy
              .WithOrigins("http://localhost:8282","http://localhost:3000","http://10.216.3.77:8282") // React app URL
              .AllowAnyHeader()
              .AllowAnyMethod()
               .AllowCredentials()
      );
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
// ✅ CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();

// ✅ Map Controllers
app.MapControllers();

// ✅ SignalR Endpoint
app.MapHub<AttendanceHub>("/attendanceHub");

app.Run();