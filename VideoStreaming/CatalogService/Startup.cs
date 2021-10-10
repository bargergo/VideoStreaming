using CatalogService.Database;
using CatalogService.MessageQueue;
using CatalogService.Middlewares;
using CatalogService.Models;
using CatalogService.Services;
using MassTransit;
using MessageQueueDTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;

namespace CatalogService
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
            services.AddDbContext<CatalogDbContext>(o =>
                o.UseSqlServer(Configuration.GetConnectionString("CatalogDb"), options => options.EnableRetryOnFailure()));

            services.AddMassTransit(x =>
            {
                var config = Configuration.GetSection(nameof(MessageQueueSettings)).Get<MessageQueueSettings>();
                x.AddConsumer<VideoConvertedEventHandler>();
                x.AddBus(context =>
                    Bus.Factory.CreateUsingRabbitMq(cfg =>
                    {
                        cfg.Host(new Uri($"rabbitmq://{config.Hostname}:/"),
                            hostConfig =>
                            {
                                hostConfig.Username(config.Username);
                                hostConfig.Password(config.Password);
                            });
                        cfg.ReceiveEndpoint("VideoConverted", ep =>
                        {
                            ep.ConfigureConsumer<VideoConvertedEventHandler>(context);
                        });
                    })
                );
                EndpointConvention.Map<IVideoConvertedEvent>(new Uri($"rabbitmq://{config.Hostname}:/VideoConverted"));
            });

            services.AddTransient<IVideoCatalogService, VideoCatalogService>();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CatalogService", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CatalogService v1"));
            }

            app.UseRequestResponseLogging();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
