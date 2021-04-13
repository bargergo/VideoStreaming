using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using tusdotnet;
using tusdotnet.Interfaces;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;

namespace VideoUploadService
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseTus(httpContext => new DefaultTusConfiguration
            {
                // c:\tusfiles is where to store files
                Store = new TusDiskStore(@"F:\tusfiles\"),
                // On what url should we listen for uploads?
                UrlPath = "/files",
                Events = new Events
                {
                    OnBeforeCreateAsync = async ctx =>
                    {
                        if (!ctx.Metadata.ContainsKey("filename"))
                        {
                            ctx.FailRequest("filename metadata must be specified. ");
                        }

                        if (!ctx.Metadata.ContainsKey("filetype"))
                        {
                            ctx.FailRequest("filetype metadata must be specified. ");
                        }
                        await Task.CompletedTask;
                    },

                    OnFileCompleteAsync = async eventContext =>
                    {
                        ITusFile file = await eventContext.GetFileAsync();
                        logger.LogInformation($"Fileupload completed: ${file.Id}");
                        var metadata = await file.GetMetadataAsync(eventContext.CancellationToken);
                        foreach (var item in metadata)
                        {
                            logger.LogInformation($"Fileupload completed: {item.Key} = {item.Value.GetString(Encoding.UTF8)}");
                        }
                        await DoSomeProcessing(file);
                        await Task.CompletedTask;
                    }
                }
            });

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments(new PathString("/files"), StringComparison.Ordinal,
                        out PathString remaining))
                {
                    // Try to get a file id e.g. /files/<fileId>
                    string fileId = remaining.Value.TrimStart('/');
                    if (!string.IsNullOrEmpty(fileId))
                    {
                        var store = new TusDiskStore(@"F:\tusfiles\");
                        var file = await store.GetFileAsync(fileId, context.RequestAborted);

                        if (file == null)
                        {
                            context.Response.StatusCode = 404;
                            await context.Response.WriteAsync($"File with id {fileId} was not found.", context.RequestAborted);
                            return;
                        }

                        var fileStream = await file.GetContentAsync(context.RequestAborted);
                        var metadata = await file.GetMetadataAsync(context.RequestAborted);

                        // The tus protocol does not specify any required metadata.
                        // "contentType" is metadata that is specific to this domain and is not required.
                        context.Response.ContentType = metadata.ContainsKey("contentType")
                                ? metadata["contentType"].GetString(Encoding.UTF8)
                                : "application/octet-stream";

                        if (metadata.ContainsKey("name"))
                        {
                            var name = metadata["name"].GetString(Encoding.UTF8);
                            context.Response.Headers.Add("Content-Disposition", new[] { $"attachment; filename=\"{name}\"" });
                        }

                        using (var fileStream1 = await file.GetContentAsync(context.RequestAborted))
                        {
                            await fileStream1.CopyToAsync(context.Response.Body, context.RequestAborted);
                        }
                    }
                    else
                    {
                        // Call next handler in pipeline if it's something else
                        await next();
                    }
                }
                else
                {
                    await next();
                }
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }

        private Task DoSomeProcessing(ITusFile file)
        {
            var filePath = Path.Combine(@"F:\tusfiles", file.Id);
            var directoryPath = Path.Combine(@"F:\tusfiles\hls", file.Id);
            Directory.CreateDirectory(directoryPath);
            var arguments = $@"-hide_banner -y -i {filePath}
                -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod  -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename {directoryPath}/360p_%03d.ts {directoryPath}/360p.m3u8
                -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename {directoryPath}/480p_%03d.ts {directoryPath}/480p.m3u8
                -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename {directoryPath}/720p_%03d.ts {directoryPath}/720p.m3u8
                -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename {directoryPath}/1080p_%03d.ts {directoryPath}/1080p.m3u8".Replace("\n", "").Replace("\r", "");
            var process = Process.Start("ffmpeg.exe", arguments);
            process.WaitForExit();
            var masterPlaylistPath = Path.Combine(directoryPath, "playlist.m3u8");
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
            return Task.CompletedTask;
        }
    }
}
