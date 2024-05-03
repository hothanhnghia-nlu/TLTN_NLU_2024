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

        [HttpPost]
        public async Task<ActionResult<Image>> CreateImage(Image image)
        {
            await _imageRepository.CreateAsync(image);
            return Ok(image);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateImage(int id, Image image)
        {
            var imageModel = await _imageRepository.UpdateAsync(id, image);
            if (imageModel == null)
            {
                return NotFound();
            }
            return Ok("Image " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _imageRepository.DeleteAsync(id);
            if (image == null)
            {
                return NotFound();
            }
            return Ok("Image " + id + " is deleted successfully");
        }

    }
}
