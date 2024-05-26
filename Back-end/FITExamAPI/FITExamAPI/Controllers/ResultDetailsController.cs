using Microsoft.AspNetCore.Mvc;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;

namespace FITExamAPI.Controllers
{
    [Route("api/resultDetails")]
    [ApiController]
    public class ResultDetailsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly ResultDetailRepository _resultRepository;

        public ResultDetailsController(FitExamContext context, ResultDetailRepository resultRepository)
        {
            _context = context;
            _resultRepository = resultRepository;
        }

        [HttpPost]
        public async Task<ActionResult<ResultDetail>> CreateResultDetail([FromForm] ResultDetail result)
        {
            if (_context.ResultDetails == null)
            {
                return NotFound();
            }
            await _resultRepository.CreateAsync(result);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResultDetail>>> GetAllResultDetails()
        {
            if (_context.ResultDetails == null)
            {
                return NotFound();
            }
            return await _resultRepository.GetAllAsync();
        }

        [HttpGet("result")]
        public async Task<ActionResult<IEnumerable<ResultDetail>>> GetAllResultDetailsByResultId([FromQuery] int id)
        {
            var results = await _resultRepository.GetAllByResultIdAsync(id);

            if (results == null)
            {
                return NotFound();
            }
            return results;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResultDetail>> GetResultDetailById(int id)
        {
            var result = await _resultRepository.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        
    }
}
