using MassTransit;
using MassTransit.Util;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace UploadService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var webHost = CreateHostBuilder(args).Build();
            using (var scope = webHost.Services.CreateScope())
            {
                var bus = scope.ServiceProvider.GetRequiredService<IBusControl>();
                var lifetime = scope.ServiceProvider.GetRequiredService<IHostApplicationLifetime>();
                var busHandle = TaskUtil.Await(() => bus.StartAsync());
                lifetime.ApplicationStopping.Register(() => busHandle.Stop());
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
