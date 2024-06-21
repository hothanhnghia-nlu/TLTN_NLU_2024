using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FITExamAPI.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string? Content { get; set; } = string.Empty;
        public int? ExamId { get; set; }
        [MaxLength(255)]
        public string? DifficultyLevel { get; set; } = string.Empty;
        public bool? IsMultipleChoice { get; set; }
        public virtual Exam? Exam { get; set; }
        public virtual ICollection<Image>? Images { get; set; } = new List<Image>();
        public virtual ICollection<Answer>? Options { get; set; } = new List<Answer>();
        public virtual ICollection<ResultDetail>? ResultDetails { get; set; } = new List<ResultDetail>();

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
        [NotMapped]
        public string? ExamName { get; set; }
        [NotMapped]
        public string? SubjectId { get; set; }
    }
}
