using Microsoft.AspNetCore.Mvc;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;

namespace FITExamAPI.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly ImageRepository _imageRepository;

        public ImagesController(FitExamContext context, ImageRepository imageRepository)
        {
            _context = context;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Image>>> GetAllImages()
        {
            if (_context.Images == null)
            {
                return NotFound();
            }
            return await _imageRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Image>> GetImageById(int id)
        {
            var image = await _imageRepository.GetByIdAsync(id);

            if (image == null)
            {
                return NotFound();
            }
            return image;
        }

    }
}
