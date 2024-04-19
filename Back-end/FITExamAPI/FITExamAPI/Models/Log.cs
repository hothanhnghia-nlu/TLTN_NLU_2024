using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Log
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [MaxLength(255)]
        public string? Level { get; set; } = string.Empty;
        public string? Source { get; set; } = string.Empty;
        [MaxLength(255)]
        public string? Ip { get; set; } = string.Empty;
        public string? Content { get; set; } = string.Empty;
        public sbyte? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public virtual User? User { get; set; }

    }
}
