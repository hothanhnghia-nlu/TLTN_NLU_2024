using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        [MaxLength]
        public string? Url { get; set; } = string.Empty;
        public virtual Subject? Subject { get; set; }
        public virtual User? User { get; set; }
    }
}
