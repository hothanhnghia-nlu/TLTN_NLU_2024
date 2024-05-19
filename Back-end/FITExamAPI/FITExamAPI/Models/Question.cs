using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FITExamAPI.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string? Content { get; set; } = string.Empty;
        [MaxLength(255)]
        public string? QuestionType { get; set; } = string.Empty;
        public string? SubjectId { get; set; }
        [MaxLength(255)]
        public string? DifficultyLevel { get; set; } = string.Empty;
        public virtual Subject? Subject { get; set; }
        public virtual ICollection<Image>? Images { get; set; } = new List<Image>();
        public virtual ICollection<Answer>? Answers { get; set; } = new List<Answer>();

        [NotMapped]
        public IFormFile ImageFile { get; set; }
    }
}
