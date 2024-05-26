namespace FITExamAPI.Models
{
    public class Result
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? ExamId { get; set; }
        public int? TotalCorrectAnswer { get; set; }
        public double? Score { get; set; }
        public DateTime? ExamDate { get; set; }
        public int? OverallTime { get; set; }
        public virtual User? User { get; set; }
        public virtual Exam? Exam { get; set; }
        public virtual ICollection<ResultDetail>? ResultDetails { get; set; } = new List<ResultDetail>();
    }
}
