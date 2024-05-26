using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ResultDetailRepository
    {
        Task<ResultDetail> CreateAsync(ResultDetail resultDetail);
        Task<List<ResultDetail>> GetAllAsync();
        Task<List<ResultDetail>> GetAllByResultIdAsync(int resultId);
        Task<ResultDetail?> GetByIdAsync(int id);
    }
}
