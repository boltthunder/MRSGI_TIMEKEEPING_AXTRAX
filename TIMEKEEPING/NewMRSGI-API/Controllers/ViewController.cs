using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MRSGI_API.Fld_Model;
using Microsoft.AspNetCore.SignalR;
using NewMRSGI_API.Hubs;

namespace NewMRSGI_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<AttendanceHub> _hubContext;

        // ✅ ONLY ONE constructor
        public ViewController(AppDbContext context, IHubContext<AttendanceHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("GetAttendance")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);

                var data = await _context.ViewRptToday
                    .Where(c => c.dtEventReal >= today && c.dtEventReal < tomorrow)
                    .AsNoTracking()
                    .OrderByDescending(x => x.dtEventReal)
                    .Take(100)
                    .ToListAsync();

                // 🔥 Send data via SignalR
                //await _hubContext.Clients.All.SendAsync("ReceiveAttendance", data);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

      
        // INITIAL LOAD (full list)
        [HttpGet]
        [Route("Get/TodayTaps")]
        public async Task<IActionResult> GetTodayTaps()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var taps = await _context.ViewRptToday
                .Where(c => c.dtEventReal >= today && c.dtEventReal < tomorrow)
                .OrderByDescending(c => c.dtEventReal)
                .AsNoTracking()
                .ToListAsync();

            return Ok(taps);
        }

        // REAL-TIME (latest only)
        [HttpGet]
        [Route("Get/LastTap")]
        public async Task<IActionResult> GetLastTap()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var lastTap = await _context.ViewRptToday
                .Where(c => c.dtEventReal >= today && c.dtEventReal < tomorrow)
                .OrderByDescending(c => c.dtEventReal)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (lastTap == null)
                return Ok(null);
            var emplast = await _context.ViewRptToday
                .Where(c=> c.dtEventReal >= today && c.dtEventReal < tomorrow && c.tLastName == lastTap.tLastName )
                .OrderByDescending(c => c.dtEventReal)
                .Select(c => new
                {
                    time = c.dtEventReal.HasValue ? c.dtEventReal.Value.ToString("HH:mm:ss") : null,
                    date = c.dtEventReal.HasValue ? c.dtEventReal.Value.ToString("yyyy-MM-dd") : null,
                    type = c.bReaderOut == true ? "OUT" : "IN",
                    status = c.iEventType
                })
                .Take(10) // limit if needed
                .ToListAsync();
            // ✅ Return combined result
            return Ok(new
            {
                lastTap = new
                {
                    firstName = lastTap.tFirstName,
                    lastName = lastTap.tLastName,
                    time = lastTap.dtEventReal?.ToString("HH:mm:ss"),
                    date = lastTap.dtEventReal?.ToString("yyyy-MM-dd"),
                    type = lastTap.bReaderOut == true ? "OUT" : "IN",
                },
                records = emplast
            });

        }


    }
}