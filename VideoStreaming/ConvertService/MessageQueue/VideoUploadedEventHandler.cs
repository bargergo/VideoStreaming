using ConvertService.Services;
using MassTransit;
using MessageQueueDTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Threading.Tasks;

namespace ConvertService.MessageQueue
{
    public class VideoUploadedEventHandler : IConsumer<IVideoUploadedEvent>
    {
        private readonly ILogger<VideoUploadedEventHandler> _logger;
        private readonly IHlsConverterService _converterService;
        private readonly IBusControl _messageQueue;

        public VideoUploadedEventHandler(ILogger<VideoUploadedEventHandler> logger, IHlsConverterService converterService, IBusControl messageQueue)
        {
            _logger = logger;
            _converterService = converterService;
            _messageQueue = messageQueue;
        }

        public async Task Consume(ConsumeContext<IVideoUploadedEvent> context)
        {
            _logger.LogInformation($"Consumed IVideoUploadedEvent: {JsonSerializer.Serialize(context)}");
            await _converterService.ConvertToHls(context.Message.FileId);
            await _messageQueue.Publish<IVideoConvertedEvent>(new VideoConvertedEvent
            {
                FileId = context.Message.FileId,
                Name = context.Message.Name,
                Type = context.Message.Type
            });
            _logger.LogInformation("Produced IVideoConvertedEvent");
        }
    }
}
