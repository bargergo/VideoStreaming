using Hellang.Middleware.ProblemDetails;
using MassTransit;
using MessageQueueDTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;
using tusdotnet;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;
using UploadService.Exceptions;
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
            services.AddProblemDetails(options =>
            {
                options.IncludeExceptionDetails = (ctx, ex) => false;
                options.Map<AuthorizationException>(
                    (ctx, ex) =>
                    {
                        var pd = StatusCodeProblemDetails.Create(StatusCodes.Status401Unauthorized);
                        pd.Title = ex.Message;
                        return pd;
                    }
                );
            });
            services.Configure<FileStorageSettings>(
                Configuration.GetSection(nameof(FileStorageSettings)));
            services.AddSingleton<IFileStorageSettings>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<Startup>>();
                var fileStorageSettings = sp.GetRequiredService<IOptions<FileStorageSettings>>().Value;
                logger.LogInformation($"FileStorageSettings.DiskStorePath: {fileStorageSettings.DiskStorePath}");
                return fileStorageSettings;
            });
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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRequestResponseLogging();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UploadService v1"));
            }
            else
            {
                app.UseProblemDetails();
            }

            app.UseClaimsPrincipalMiddleware();

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
