using MassTransit;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using tusdotnet.Interfaces;
using tusdotnet.Models.Configuration;
using VideoUploadService.MessageQueue;
using VideoUploadService.Models;

namespace VideoUploadService.Services
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

        public async Task OnBeforeCreateAsync(BeforeCreateContext context)
        {
            if (!context.Metadata.ContainsKey("filename"))
            {
                context.FailRequest("filename metadata must be specified. ");
            }

            if (!context.Metadata.ContainsKey("filetype"))
            {
                context.FailRequest("filetype metadata must be specified. ");
            }
            await Task.CompletedTask;
        }

        public async Task OnFileCompleteAsync(FileCompleteContext context)
        {
            ITusFile file = await context.GetFileAsync();
            _logger.LogInformation($"Fileupload completed: ${file.Id}");
            var metadata = await file.GetMetadataAsync(context.CancellationToken);
            foreach (var item in metadata)
            {
                _logger.LogInformation($"Fileupload completed: {item.Key} = {item.Value.GetString(Encoding.UTF8)}");
            }
            await DoSomeProcessing(file, metadata);
            await Task.CompletedTask;
        }

        private async Task DoSomeProcessing(ITusFile file, Dictionary<string, tusdotnet.Models.Metadata> metadata)
        {
            await _messageQueue.Publish<IVideoUploadedEvent>(new VideoUploadedEvent
            {
                FileId = file.Id,
                Name = metadata.GetValueOrDefault("name", null)?.GetString(Encoding.UTF8) ?? "null",
                Type = metadata.GetValueOrDefault("type", null)?.GetString(Encoding.UTF8) ?? "null"
            });
        }
    }
}
