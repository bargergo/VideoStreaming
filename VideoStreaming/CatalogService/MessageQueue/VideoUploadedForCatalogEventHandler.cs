using MassTransit;
using MessageQueueDTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Threading.Tasks;
using CatalogService.Database.Entities;
using CatalogService.Services;

namespace CatalogService.MessageQueue
{
    public class VideoUploadedForCatalogEventHandler : IConsumer<IVideoUploadedForCatalogEvent>
    {
        private readonly ILogger<VideoUploadedForCatalogEventHandler> _logger;
        private readonly IVideoCatalogService _videoCatalogService;

        public VideoUploadedForCatalogEventHandler(ILogger<VideoUploadedForCatalogEventHandler> logger, IVideoCatalogService videoCatalogService)
        {
            _logger = logger;
            _videoCatalogService = videoCatalogService;
        }

        public async Task Consume(ConsumeContext<IVideoUploadedForCatalogEvent> context)
        {
            _logger.LogInformation($"Consumed IVideoUploadedForCatalogEvent: {JsonSerializer.Serialize(context)}");
            var video = new Video
            {
                FileId = context.Message.FileId,
                Name = context.Message.Name,
                Status = Status.Uploaded
            };
            await _videoCatalogService.CreateVideo(video);
        }
    }
}
