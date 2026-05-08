using Microsoft.AspNetCore.SignalR;

namespace NewMRSGI_API.Hubs
{
    public class AttendanceHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("Client connected: " + Context.ConnectionId);
            await base.OnConnectedAsync();
        }
    }
}