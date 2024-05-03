using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Subject
    {
        [Key]
        [Required]
        public string Id { get; set; }
        [MaxLength(255)]
        public string? Name { get; set; } = string.Empty;
        public int? Credit { get; set; }
        public int? ImageId { get; set; }
        public virtual Image? Image { get; set; }
        public virtual ICollection<Exam>? Exams { get; set; } = new List<Exam>();
        public virtual ICollection<Question>? Questions { get; set; } = new List<Question>();
    }
}
