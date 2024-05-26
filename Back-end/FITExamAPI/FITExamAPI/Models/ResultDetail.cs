namespace FITExamAPI.Models
{
    public class ResultDetail
    {
        public int Id { get; set; }
        public int? ResultId { get; set; }
        public int? QuestionId { get; set; }
        public int? AnswerId { get; set; }
        public bool? IsCorrect { get; set; }
        public virtual Result? Result { get; set; }
        public virtual Question? Question { get; set; }
        public virtual Answer? Answer { get; set; }
    }
}
