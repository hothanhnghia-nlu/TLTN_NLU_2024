using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using NuGet.Protocol.Plugins;

namespace FITExamAPI.Controllers
{
    [Route("api/logs")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly LogRepository _logRepository;

        public LogsController(FitExamContext context, LogRepository logRepository)
        {
            _context = context;
            _logRepository = logRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Log>> CreateLog(Log log)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            await _logRepository.CreateAsync(log);
            return Ok(log);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Log>>> GetAllLogs()
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            return await _logRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Log>> GetLogById(int id)
        {
            var log = await _logRepository.GetByIdAsync(id);

            if (log == null)
            {
                return NotFound();
            }
            return log;
        }

    }
}
