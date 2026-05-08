//using Microsoft.AspNetCore.SignalR;
//using Microsoft.EntityFrameworkCore;
//using MRSGI_API.Fld_Model;
//using NewMRSGI_API.Hubs;

//public class AttendanceService : BackgroundService
//{
//    private readonly IServiceScopeFactory _scopeFactory;
//    private readonly IHubContext<AttendanceHub> _hubContext;

//    private DateTime _lastCheck = DateTime.Now.AddSeconds(-10);

//    public AttendanceService(IServiceScopeFactory scopeFactory,
//                             IHubContext<AttendanceHub> hubContext)
//    {
//        _scopeFactory = scopeFactory;
//        _hubContext = hubContext;
//    }

//    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//    {
//        while (!stoppingToken.IsCancellationRequested)
//        {
//            using (var scope = _scopeFactory.CreateScope())
//            {
//                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//                // ✅ Only get NEW records
//                var newData = await context.ViewRptToday
//                    .Where(x => x.dtEventReal > _lastCheck)
//                    .OrderBy(x => x.dtEventReal)
//                    .ToListAsync();

//                if (newData.Any())
//                {
//                    _lastCheck = (DateTime)newData.Max(x => x.dtEventReal);

//                    // 🔥 Send to React
//                    await _hubContext.Clients.All.SendAsync("ReceiveAttendance", newData);
//                }
//            }

//            await Task.Delay(100, stoppingToken); // every 2000(2sec)
//        }
//    }
//}
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MRSGI_API.Fld_Model;
using NewMRSGI_API.Hubs;

public class AttendanceService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<AttendanceHub> _hubContext;

    //private DateTime _lastCheck = DateTime.Now.AddSeconds(-10);

    public AttendanceService(IServiceScopeFactory scopeFactory,
                             IHubContext<AttendanceHub> hubContext)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    private DateTime _lastCheck = DateTime.MinValue;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var newData = await context.ViewRptToday
                    .Where(x => x.dtEventReal >= _lastCheck)
                    .OrderBy(x => x.dtEventReal)
                    .AsNoTracking()
                    .ToListAsync();

                if (newData.Any())
                {
                    foreach (var tap in newData)
                    {
                        await _hubContext.Clients.All.SendAsync("ReceiveLastTap", tap);
                    }

                    _lastCheck = newData.Max(x => x.dtEventReal)??DateTime.MinValue.AddSeconds(1);
                }
            }

            await Task.Delay(800, stoppingToken);
        }
    }
}