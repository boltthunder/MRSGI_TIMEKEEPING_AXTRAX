using System.ComponentModel.DataAnnotations;

namespace NewMRSGI_API.Class_Model
{
    public class TblEvents
    {
        [Key]
        public long IdAutoEvents { get; set; }
        public int? IdEmpSlot { get; set; }
        public string? tDesc { get; set; }
        public DateTime? dtEventReal { get; set; }
        public int? IdReader { get; set; }
        public int? IdDoor { get; set; }
        public int IdPanel { get; set; }
        public byte iEventType { get; set; }
        public byte iEventSubType { get; set; }
        public byte iEventSource { get; set; }
        public int? IdCardSlot { get; set; }
        public byte? eAlarmHandler { get; set; }
        public bool? bCameraPopup { get; set; }
        public DateTime? dtEventUpload { get; set; }
        public int? IdEmpNum { get; set; }
        public int iEventNum { get; set; }
        public int? IdInput { get; set; }
        public int? IdOutput { get; set; }
        public short? iSiteCode { get; set; }
        public string? iCardCode { get; set; }
        public string? tFullName { get; set; }
        public int? CameraId { get; set; }
        public byte? wCarParkingSubGroup { get; set; }
        public int? iSiteCodeInt { get; set; }
        public int? TerminalId { get; set; }
    }

    public class TblEmployees
    {
        [Key]
        public int iEmployeeNum { get; set; }
        public string tLastName { get; set; }
        public string tFirstName { get; set; }
        public int IdDepartment { get; set; }
    }

    public class TblReader
    {
        [Key]
        public int IdReader { get; set; }
        public bool bReaderOut { get; set; }
    }

    public class TblDepartment
    {
        [Key]
        public int IdDepartment { get; set; }
        public string tDescDepartment { get; set; }
        public string? tDescReader { get; set; }
    }


    public class TimeEntryDto
    {
        [Key]
        public int EmployeeNum { get; set; }
        public int ReaderId { get; set; }
        public int EventType { get; set; }
        public DateTime EventDate { get; set; }

        public string LastName { get; set; }
        public string FirstName { get; set; }

        public int DoorId { get; set; }
        public bool ReaderOut { get; set; }

        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }

    public class ViewRptToday
    {
        public int iEmployeeNum { get; set; }
        public int IdReader { get; set; }
        public byte? iEventType { get; set; }
        public DateTime? dtEventReal { get; set; }
        public string? tLastName { get; set; }
        public string? tFirstName { get; set; }
        public int? IdDoor { get; set; }
        //public string? tDescReader { get; set; }

        public bool? bReaderOut { get; set; }
        public int? IdDepartment { get; set; }
        public string? tDescDepartment { get; set; }
    }
}
