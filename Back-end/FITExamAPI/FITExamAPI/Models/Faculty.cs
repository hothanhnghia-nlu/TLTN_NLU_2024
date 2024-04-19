using System.ComponentModel.DataAnnotations;

namespace FITExamAPI.Models
{
    public class Faculty
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string? Name { get; set; } = string.Empty;
        public virtual ICollection<User>? Users { get; set; } = new List<User>();
    }
}
