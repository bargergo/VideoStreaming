using MassTransit;
using MessageQueueDTOs;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using tusdotnet.Interfaces;
using tusdotnet.Models.Configuration;
using UploadService.Extensions;
using UploadService.Models;

namespace UploadService.Services
{
    public class TusService : ITusService
    {
        private readonly ILogger<TusService> _logger;
        private readonly IFileStorageSettings _fileStorageSettings;
        private readonly IBusControl _messageQueue;

        public TusService(ILogger<TusService> logger, IFileStorageSettings fileStorageSettings, IBusControl messageQueue)
        {
            _logger = logger;
            _fileStorageSettings = fileStorageSettings;
            _messageQueue = messageQueue;
        }

        public Task OnAuthorizeAsync(AuthorizeContext context)
        { 
            try
            {
                var user = context.HttpContext.User;
                var userId = user.UserId();
                _logger.LogInformation("user is authenticated, id: " + userId);
                if (!user.IsAdmin())
                {
                    _logger.LogInformation("user is not admin, admin right required for uploading");
                    context.FailRequest(HttpStatusCode.Forbidden);
                }
                return Task.CompletedTask;
            }
            catch
            {
                _logger.LogInformation("user is not authenticated");
                context.FailRequest(HttpStatusCode.Unauthorized);
                return Task.CompletedTask;
            }
        }

        public async Task OnBeforeCreateAsync(BeforeCreateContext context)
        {
            if (!context.Metadata.ContainsKey("filename"))
            {
                context.FailRequest("filename metadata must be specified. ");
                _logger.LogInformation($"Fileupload failed: filename metadata must be specified");
            }

            if (!context.Metadata.ContainsKey("filetype"))
            {
                context.FailRequest("filetype metadata must be specified. ");
                _logger.LogInformation($"Fileupload failed: filetype metadata must be specified");
            }
            var metadataInString = "";
            foreach (var item in context.Metadata)
            {
                if (metadataInString.Length != 0)
                {
                    metadataInString += ", ";
                }
                metadataInString += $"\"{item.Key}:{item.Value.GetString(Encoding.UTF8)}\"";
            }
            _logger.LogInformation($"Fileupload started: {metadataInString}");
            await Task.CompletedTask;
        }

        public async Task OnFileCompleteAsync(FileCompleteContext context)
        {
            ITusFile file = await context.GetFileAsync();
            _logger.LogInformation($"Fileupload completed: ${file.Id}");
            var metadata = await file.GetMetadataAsync(context.CancellationToken);
            var metadataInString = "";
            foreach (var item in metadata)
            {
                if (metadataInString.Length != 0)
                {
                    metadataInString += ", ";
                }
                metadataInString += $"\"{item.Key}:{item.Value.GetString(Encoding.UTF8)}\"";
            }
            _logger.LogInformation($"Fileupload completed: {metadataInString}");
            await DoSomeProcessing(file, metadata);
            await Task.CompletedTask;
        }

        private async Task DoSomeProcessing(ITusFile file, Dictionary<string, tusdotnet.Models.Metadata> metadata)
        {
            var guid = Guid.ParseExact(file.Id, "N");
            _logger.LogInformation($"Publish message with: FileId = {file.Id}, Name = {metadata.GetValueOrDefault("filename", null)?.GetString(Encoding.UTF8)}, Type = {metadata.GetValueOrDefault("filetype", null)?.GetString(Encoding.UTF8)}");
            await _messageQueue.Publish<IVideoUploadedEvent>(new VideoUploadedEvent
            {
                FileId = guid,
                Name = metadata.GetValueOrDefault("filename", null)?.GetString(Encoding.UTF8),
                Type = metadata.GetValueOrDefault("filetype", null)?.GetString(Encoding.UTF8)
            });
            await _messageQueue.Publish<IVideoUploadedForCatalogEvent>(new VideoUploadedForCatalogEvent
            {
                FileId = guid,
                Name = metadata.GetValueOrDefault("filename", null)?.GetString(Encoding.UTF8),
                Type = metadata.GetValueOrDefault("filetype", null)?.GetString(Encoding.UTF8)
            });
        }
    }
}
