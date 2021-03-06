using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IO;
using System;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;

namespace CatalogService.Middlewares
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly RecyclableMemoryStreamManager _recyclableMemoryStreamManager;

        public RequestResponseLoggingMiddleware(RequestDelegate next,
                                                ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory
                      .CreateLogger<RequestResponseLoggingMiddleware>();
            _recyclableMemoryStreamManager = new RecyclableMemoryStreamManager();
        }

        public async Task Invoke(HttpContext context)
        {
            await LogRequestResponse(context);
        }

        private async Task LogRequestResponse(HttpContext context)
        {
            var requestBodytext = "Not JSON";
            if (context.Request.ContentType != null && context.Request.ContentType.StartsWith(MediaTypeNames.Application.Json))
            {
                context.Request.EnableBuffering();
                requestBodytext = await new StreamReader(context.Request.Body).ReadToEndAsync();
                context.Request.Body.Position = 0;
            }
            _logger.LogInformation($"Http Request Information:{Environment.NewLine}" +
                                   $"Method: {context.Request.Method}{Environment.NewLine}" +
                                   $"Schema: {context.Request.Scheme}{Environment.NewLine}" +
                                   $"Host: {context.Request.Host}{Environment.NewLine}" +
                                   $"Path: {context.Request.Path}{Environment.NewLine}" +
                                   $"Body: {requestBodytext}{Environment.NewLine}" +
                                   $"QueryString: {context.Request.QueryString}");
            var originalBodyStream = context.Response.Body;
            await using var responseBody = _recyclableMemoryStreamManager.GetStream();
            context.Response.Body = responseBody;
            try
            {
                await _next(context);
            } catch(Exception e)
            {
                _logger.LogInformation($"Error: {e.Message}");
                throw;
            }
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var text = "Not JSON";
            if (context.Response.ContentType != null && context.Response.ContentType.StartsWith(MediaTypeNames.Application.Json))
            {
                text = await new StreamReader(context.Response.Body).ReadToEndAsync();
                context.Response.Body.Seek(0, SeekOrigin.Begin);
            }
            _logger.LogInformation($"Http Response Information:{Environment.NewLine}" +
                                   $"StatusCode: {context.Response.StatusCode}{Environment.NewLine}" +
                                   $"Method: {context.Request.Method}{Environment.NewLine}" +
                                   $"Schema: {context.Request.Scheme}{Environment.NewLine}" +
                                   $"Host: {context.Request.Host}{Environment.NewLine}" +
                                   $"Path: {context.Request.Path}{Environment.NewLine}" +
                                   $"Body: {text}{Environment.NewLine}" +
                                   $"QueryString: {context.Request.QueryString}");
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }

    public static class RequestResponseLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestResponseLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestResponseLoggingMiddleware>();
        }
    }
}
