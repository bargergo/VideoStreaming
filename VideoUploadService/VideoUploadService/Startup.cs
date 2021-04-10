using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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
    }
}
