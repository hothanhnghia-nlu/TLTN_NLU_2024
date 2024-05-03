using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface SubjectRepository
    {
        Task<Subject> CreateAsync(Subject subject);
        Task<List<Subject>> GetAllAsync();
        Task<Subject?> GetByIdAsync(string id);
        Task<Subject?> UpdateAsync(string id, Subject subject);
        Task<Subject?> DeleteAsync(string id);

    }
}
