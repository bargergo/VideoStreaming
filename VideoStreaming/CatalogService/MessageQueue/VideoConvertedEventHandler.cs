using MassTransit;
using MessageQueueDTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Threading.Tasks;
using CatalogService.Database.Entities;
using CatalogService.Services;

namespace CatalogService.MessageQueue
{
    public class VideoConvertedEventHandler : IConsumer<IVideoConvertedEvent>
    {
        private readonly ILogger<VideoConvertedEventHandler> _logger;
        private readonly IVideoCatalogService _videoCatalogService;

        public VideoConvertedEventHandler(ILogger<VideoConvertedEventHandler> logger, IVideoCatalogService videoCatalogService)
        {
            _logger = logger;
            _videoCatalogService = videoCatalogService;
        }

        public async Task Consume(ConsumeContext<IVideoConvertedEvent> context)
        {
            _logger.LogInformation($"Consumed IVideoConvertedEvent: {JsonSerializer.Serialize(context)}");
            await _videoCatalogService.UpdateVideoStatus(context.Message.FileId, Status.Converted);
        }
    }
}
