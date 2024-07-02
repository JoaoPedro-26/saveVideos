using ICaseiBackend.Models;
using ICaseiBackend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICaseiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly YouTubeService _youTubeService;
        //private static List<string> favoriteVideos = new List<string>();

        public VideosController(YouTubeService youTubeService)
        {
            _youTubeService = youTubeService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Video>>> Search(string query)
        {
            var videos = await _youTubeService.SearchVideosAsync(query);
            return Ok(videos);
        }

        //[HttpGet("favorites")]
        //public IActionResult GetFavorites()
        //{
        //    return Ok(favoriteVideos);
        //}

        //[HttpPost("favorites/{videoId}")]
        //public IActionResult AddFavorite(string videoId)
        //{
        //    if (!favoriteVideos.Contains(videoId))
        //    {
        //        favoriteVideos.Add(videoId);
        //    }
        //    return Ok();
        //}

        //[HttpDelete("favorites/{videoId}")]
        //public IActionResult RemoveFavorite(string videoId)
        //{
        //    if (favoriteVideos.Contains(videoId))
        //    {
        //        favoriteVideos.Remove(videoId);
        //    }
        //    return Ok();
        //}

        //[HttpGet("{videoId}")]
        //public async Task<ActionResult<Video>> GetVideoDetails(string videoId)
        //{
        //    var video = await _youTubeService.GetVideoDetailsAsync(videoId);
        //    if (video == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(video);
        //}
    }
}
