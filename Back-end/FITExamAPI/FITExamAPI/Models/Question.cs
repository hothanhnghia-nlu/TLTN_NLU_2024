using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string? Content { get; set; } = string.Empty;
        [MaxLength(255)]
        public string? QuestionType { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public int? SubjectId { get; set; }
        [MaxLength(255)]
        public string? DifficultyLevel { get; set; } = string.Empty;
        public virtual Image? Image { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual ICollection<Answer>? Answers { get; set; } = new List<Answer>();
    }
}
