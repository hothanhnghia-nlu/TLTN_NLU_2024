using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FITExamAPI.Models
{
    public class Subject
    {
        [Key]
        [Required]
        public string Id { get; set; } = string.Empty;
        [MaxLength(255)]
        public string? Name { get; set; } = string.Empty;
        public int? Credit { get; set; }
        public virtual Image? Image { get; set; }
        public virtual ICollection<Exam>? Exams { get; set; } = new List<Exam>();

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
