using ConvertService.MessageQueue;
using ConvertService.Models;
using ConvertService.Services;
using MassTransit;
using MessageQueueDTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;

namespace ConvertService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<FileStorageSettings>(
                Configuration.GetSection(nameof(FileStorageSettings)));
            services.AddSingleton<IFileStorageSettings>(sp =>
                sp.GetRequiredService<IOptions<FileStorageSettings>>().Value);

            services.AddMassTransit(x =>
            {
                var config = Configuration.GetSection(nameof(MessageQueueSettings)).Get<MessageQueueSettings>();
                x.AddConsumer<VideoUploadedEventHandler>();
                x.AddBus(context =>
                    Bus.Factory.CreateUsingRabbitMq(cfg =>
                    {
                        cfg.Host(new Uri($"rabbitmq://{config.Hostname}:/"),
                            hostConfig =>
                            {
                                hostConfig.Username(config.Username);
                                hostConfig.Password(config.Password);
                            });
                        cfg.ReceiveEndpoint("VideoUploaded", ep =>
                        {
                            ep.ConfigureConsumer<VideoUploadedEventHandler>(context);
                        });
                    })
                );
                EndpointConvention.Map<IVideoConvertedEvent>(new Uri($"rabbitmq://{config.Hostname}:/VideoConverted"));
                EndpointConvention.Map<IVideoUploadedEvent>(new Uri($"rabbitmq://{config.Hostname}:/VideoUploaded"));
            });

            services.AddTransient<IHlsConverterService, HlsConverterService>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ConvertService", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConvertService v1"));
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
