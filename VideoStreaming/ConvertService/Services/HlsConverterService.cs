using ConvertService.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace ConvertService.Services
{
    public class HlsConverterService : IHlsConverterService
    {
        private readonly IFileStorageSettings _fileStorageSettings;
        private readonly ILogger<HlsConverterService> _logger;

        public HlsConverterService(IFileStorageSettings fileStorageSettings, ILogger<HlsConverterService> logger)
        {
            _fileStorageSettings = fileStorageSettings;
            _logger = logger;
        }

        public async Task ConvertToHls(Guid fileId)
        {
            var fileIdString = fileId.ToString("N");
            var filePath = Path.Combine($"{_fileStorageSettings.Path}", fileIdString);
            _logger.LogInformation($"Trying to find file: {filePath}");
            if (File.Exists(filePath))
            {
                _logger.LogInformation($"File found: {filePath}");
            }
            else
            {
                _logger.LogWarning($"File not found: {filePath}");
            }
            var directoryPath = Path.Combine(_fileStorageSettings.Path, "hls", fileIdString);
            Directory.CreateDirectory(directoryPath);
            var arguments = $@"-hide_banner -y -i {filePath}
                -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename {directoryPath}/360p_%03d.ts {directoryPath}/360p.m3u8
                -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename {directoryPath}/480p_%03d.ts {directoryPath}/480p.m3u8
                -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename {directoryPath}/720p_%03d.ts {directoryPath}/720p.m3u8
                -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename {directoryPath}/1080p_%03d.ts {directoryPath}/1080p.m3u8".Replace("\n", "").Replace("\r", "");
            _logger.LogInformation($"Starting ffmpeg with arguments: '{arguments}'");
            var process = Process.Start("ffmpeg", arguments);
            await process.WaitForExitAsync();
            _logger.LogInformation($"Ffmpeg finished");
            var masterPlaylistPath = Path.Combine(directoryPath, "playlist.m3u8");
            _logger.LogInformation($"Creating master playlist: {masterPlaylistPath}");
            using (StreamWriter sw = File.CreateText(masterPlaylistPath))
            {
                sw.Write(@"#EXTM3U
                            #EXT-X-VERSION:3
                            #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
                            360p.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
                            480p.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
                            720p.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
                            1080p.m3u8".Replace(" ", ""));
            }
            _logger.LogInformation("Master playlist created");
        }
    }
}
