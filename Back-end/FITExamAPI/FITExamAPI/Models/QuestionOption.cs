using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class QuestionOption
    {
        public int Id { get; set; }
        public int? QuestionId { get; set; }
        [MaxLength]
        public string? OptionContent { get; set; }
        public bool? IsCorrect { get; set; }
        public Question? Question { get; set; }
    }
}
