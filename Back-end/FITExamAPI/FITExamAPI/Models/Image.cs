using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Image
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string? Name { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public string? SubjectId { get; set; }
        public int? QuestionId { get; set; }
        public virtual User? User { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual Question? Question { get; set; }
    }
}
