namespace FITExamAPI.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public int? ImageId { get; set; }
        public virtual Image? Image { get; set; }
        public virtual ICollection<Exam>? Exams { get; set; } = new List<Exam>();
    }
}
