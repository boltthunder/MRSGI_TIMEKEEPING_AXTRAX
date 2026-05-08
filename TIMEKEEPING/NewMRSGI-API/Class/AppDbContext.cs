using Microsoft.EntityFrameworkCore;
using NewMRSGI_API.Class_Model;

namespace MRSGI_API.Fld_Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }
        public DbSet<TblEvents> TblEvents { get; set; }
        public DbSet<ViewRptToday> ViewRptToday { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TblEvents>().ToTable("tblEvents");

            // Map the view (no primary key enforcement)
            modelBuilder.Entity<ViewRptToday>()
                .HasNoKey()
                .ToView("ViewRptToday");
        }
    }
}
