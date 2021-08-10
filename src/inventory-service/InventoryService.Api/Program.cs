using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using InventoryService.Api.Database;
using InventoryService.Api.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace InventoryService.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddUserSecrets<Startup>()
                .AddEnvironmentVariables()
                .Build();

            var host = CreateWebHostBuilder(args)
                .ConfigureAppConfiguration((ctx, builder) =>
                {
                    var keyVaultUrl = config["KeyVaultUrl"];
                    if (!string.IsNullOrEmpty(keyVaultUrl))
                    {
                        var secretClient = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());

                        builder.AddAzureKeyVault(new Uri(keyVaultUrl), new DefaultAzureCredential());
                    }
                }).Build();

            using (var scope = host.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<InventoryContext>();
                context.Database.Migrate();
                // make sure there is a user inserted (for SQL injection demo)
                if (context.SecretUsers.Count() == 0)
                {
                    context.SecretUsers.Add(new SecretUser
                    {
                        Username = "administrator",
                        Password = "MySuperSecr3tPassword!"
                    });
                    context.SaveChanges();
                }
                if (context.Payroll.Count() == 0)
                {
                    context.Payroll.AddRange(
                        new Payroll
                        {
                            EmployeeName = "Nancy Daviolo",
                            Title = "Executive Vice President of Operations",
                            Salary = 150000
                        },
                        new Payroll
                        {
                            EmployeeName = "Margaret Peacock",
                            Title = "President",
                            Salary = 135000
                        });
                    context.SaveChanges();
                }
            }
            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
