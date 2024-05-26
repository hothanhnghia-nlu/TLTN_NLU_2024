using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int? QuestionId { get; set; }
        public string? Content { get; set; } = string.Empty;
        public bool? IsCorrect { get; set; }
        public virtual Question? Question { get; set; }
        public virtual ICollection<ResultDetail>? ResultDetails { get; set; } = new List<ResultDetail>();
    }
}
