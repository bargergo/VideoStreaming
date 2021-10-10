using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;

namespace UploadService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var webHost = CreateHostBuilder(args).Build();
            using (var scope = webHost.Services.CreateScope())
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                var bus = scope.ServiceProvider.GetRequiredService<IBusControl>();
                var lifetime = scope.ServiceProvider.GetRequiredService<IHostApplicationLifetime>();
                try
                {
                    bus.Start();
                }
                catch (Exception e)
                {
                    logger.LogInformation($"Waiting for messagequeue... cause:{e.Message}");
                    System.Threading.Thread.Sleep(1000);
                }
                lifetime.ApplicationStopping.Register(() => bus.Stop());
            }
            webHost.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
