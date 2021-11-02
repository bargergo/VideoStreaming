using MassTransit;
using MessageQueueDTOs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;
using tusdotnet;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;
using UploadService.Authentication;
using UploadService.Middlewares;
using UploadService.Models;
using UploadService.Services;

namespace UploadService
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
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue; // if not set default value is: 30 MB
            });

            services.AddMassTransit(x =>
            {
                var config = Configuration.GetSection(nameof(MessageQueueSettings)).Get<MessageQueueSettings>();
                x.AddBus(context =>
                    Bus.Factory.CreateUsingRabbitMq(cfg =>
                    {
                        cfg.Host(new Uri($"rabbitmq://{config.Hostname}:/"),
                            hostConfig =>
                            {
                                hostConfig.Username(config.Username);
                                hostConfig.Password(config.Password);
                            });
                    })
                );
                EndpointConvention.Map<IVideoUploadedEvent>(new Uri($"rabbitmq://{config.Hostname}:/VideoUploaded"));
                EndpointConvention.Map<IVideoUploadedForCatalogEvent>(new Uri($"rabbitmq://{config.Hostname}:/VideoUploadedForCatalog"));
            });

            services.AddTransient<ITusService, TusService>();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "UploadService", Version = "v1" });
            });
            services.AddAuthentication("CustomJwtAuthentication")
                    .AddScheme<AuthenticationSchemeOptions, CustomJwtAuthenticationHandler>("CustomJwtAuthentication", null);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UploadService v1"));
            }

            app.UseAuthentication();

            app.UseRequestResponseLogging();
            app.UseRouting();

            var tusService = app.ApplicationServices.GetRequiredService<ITusService>();
            var fileStorageSettings = app.ApplicationServices.GetRequiredService<IFileStorageSettings>();
            app.UseTus(httpContext => new DefaultTusConfiguration
            {
                // c:\tusfiles is where to store files
                Store = new TusDiskStore(fileStorageSettings.DiskStorePath),
                // On what url should we listen for uploads?
                UrlPath = fileStorageSettings.UploadUrlPath,
                Events = new Events
                {
                    OnBeforeCreateAsync = async ctx => await tusService.OnBeforeCreateAsync(ctx),
                    OnFileCompleteAsync = async eventContext => await tusService.OnFileCompleteAsync(eventContext),
                    OnAuthorizeAsync = async ctx => await tusService.OnAuthorizeAsync(ctx)
                }
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
