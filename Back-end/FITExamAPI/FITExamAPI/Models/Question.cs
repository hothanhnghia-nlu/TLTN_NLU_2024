using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Question
    {
        public int Id { get; set; }
        [MaxLength]
        public string? Content { get; set; } = string.Empty;
        [MaxLength]
        public string? CorrectAnswer { get; set; } = string.Empty;
        public string? QuestionType { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public int? SubjectId { get; set; }
        public string? DifficultyLevel { get; set; } = string.Empty;
        public virtual Image? Image { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual ICollection<Answer>? Answers { get; set; } = new List<Answer>();
        public virtual ICollection<QuestionOption>? QuestionOptions { get; set; } = new List<QuestionOption>();
    }
}
