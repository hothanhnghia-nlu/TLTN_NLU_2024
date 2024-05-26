using Microsoft.AspNetCore.Mvc;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;

namespace FITExamAPI.Controllers
{
    [Route("api/results")]
    [ApiController]
    public class ResultsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly ResultRepository _resultRepository;

        public ResultsController(FitExamContext context, ResultRepository resultRepository)
        {
            _context = context;
            _resultRepository = resultRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Result>> CreateResult([FromForm] Result result)
        {
            if (_context.Results == null)
            {
                return NotFound();
            }
            await _resultRepository.CreateAsync(result);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Result>>> GetAllResults()
        {
            if (_context.Results == null)
            {
                return NotFound();
            }
            return await _resultRepository.GetAllAsync();
        }
        
        [HttpGet("student")]
        public async Task<ActionResult<IEnumerable<Result>>> GetAllResultsByUserId([FromQuery] int id)
        {
            if (_context.Results == null)
            {
                return NotFound();
            }
            return await _resultRepository.GetAllByUserIdAsync(id);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Result>> GetResultById(int id)
        {
            var result = await _resultRepository.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        
        [HttpGet("user")]
        public async Task<ActionResult<Result>> GetResultByUserId([FromQuery] int id)
        {
            var result = await _resultRepository.GetByUserIdAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            return result;
        }

    }
}
