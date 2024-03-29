﻿namespace FITExamAPI.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public int? SubjectId { get; set; }
        public int? CreatorId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? NumberOfQuestions { get; set; }
        public int? MinimumDifficulty { get; set; }
        public int? MaximumDifficulty { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual User? User { get; set; }
        public virtual ICollection<Result>? Results { get; set; } = new List<Result>();
        public virtual ICollection<ExamQuestion>? ExamQuestions { get; set; } = new List<ExamQuestion>();

    }
}
