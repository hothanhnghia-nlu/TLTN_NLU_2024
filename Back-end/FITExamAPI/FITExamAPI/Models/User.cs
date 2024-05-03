using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string? Name { get; set; } = string.Empty;
        [MaxLength(320)]
        public string? Email { get; set; } = string.Empty;
        [MaxLength(10)]
        public string? Phone { get; set; } = string.Empty;
        public DateTime? Dob { get; set; }
        [MaxLength(5)]
        public string? Gender { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public int? FacultyId { get; set; }
        [MaxLength(255)]
        public string? Password { get; set; } = string.Empty;
        public sbyte? Role { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public sbyte? Status { get; set; }
        public Image? Image { get; set; }
        public Faculty? Faculty { get; set; }
        public virtual ICollection<Exam>? Exams { get; set; } = new List<Exam>();
        public virtual ICollection<Result>? Results { get; set; } = new List<Result>();
        public virtual ICollection<Log>? Logs { get; set; } = new List<Log>();
    }
}
