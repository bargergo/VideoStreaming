using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IO;
using System;
using System.IO;
using System.Threading.Tasks;

namespace UploadService.Middlewares
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
            _logger.LogInformation($"Http Request Information:{Environment.NewLine}" +
                                   $"Method: {context.Request.Method}{Environment.NewLine}" +
                                   $"Schema: {context.Request.Scheme}{Environment.NewLine}" +
                                   $"Host: {context.Request.Host}{Environment.NewLine}" +
                                   $"Path: {context.Request.Path}{Environment.NewLine}" +
                                   $"Body: {context.Request.Body}{Environment.NewLine}" +
                                   $"QueryString: {context.Request.QueryString}");
            var originalBodyStream = context.Response.Body;
            await using var responseBody = _recyclableMemoryStreamManager.GetStream();
            context.Response.Body = responseBody;
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                _logger.LogInformation($"Error: {e.Message}");
                throw;
            }
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            _logger.LogInformation($"Http Response Information:{Environment.NewLine}" +
                                   $"StatusCode: {context.Response.StatusCode}{Environment.NewLine}" +
                                   $"Method: {context.Request.Method}{Environment.NewLine}" +
                                   $"Schema: {context.Request.Scheme}{Environment.NewLine}" +
                                   $"Host: {context.Request.Host}{Environment.NewLine}" +
                                   $"Path: {context.Request.Path}{Environment.NewLine}" +
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
