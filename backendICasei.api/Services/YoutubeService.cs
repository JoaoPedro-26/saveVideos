using ICaseiBackend.Models;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace ICaseiBackend.Services
{
    public class YouTubeService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public YouTubeService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = "AIzaSyBUVvKGM2CaChVLip6gXnhjXpW8PbLTbn8";
        }

        public async Task<List<Video>> SearchVideosAsync(string query)
        {
            var url = $"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&maxResults=20&type=video&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            string stringJson = "";
            if(response.IsSuccessStatusCode)
            {
                stringJson = await response.Content.ReadAsStringAsync();
            }
            var jsonDocument = JsonDocument.Parse(stringJson);
            var items = jsonDocument.RootElement.GetProperty("items").EnumerateArray();

            var videos = new List<Video>();
            foreach (var item in items)
            {
                var video = new Video
                {
                    VideoId = item.GetProperty("id").GetProperty("videoId").GetString(),
                    Title = item.GetProperty("snippet").GetProperty("title").GetString(),
                    ThumbnailUrl = item.GetProperty("snippet").GetProperty("thumbnails").GetProperty("default").GetProperty("url").GetString()
                };
                videos.Add(video);
            }

            return videos;
            return new List<Video>();
        }

        public async Task<Video> GetVideoDetailsAsync(string videoId)
        {
            var url = $"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={videoId}&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var stringJson = await response.Content.ReadAsStringAsync();
                var jsonDocument = JsonDocument.Parse(stringJson);
                var item = jsonDocument.RootElement.GetProperty("items")[0];
                var video = new Video
                {
                    VideoId = item.GetProperty("id").GetString(),
                    Title = item.GetProperty("snippet").GetProperty("title").GetString(),
                    ThumbnailUrl = item.GetProperty("snippet").GetProperty("thumbnails").GetProperty("default").GetProperty("url").GetString()
                };
                return video;
            }
            return null;
        }
    }
}