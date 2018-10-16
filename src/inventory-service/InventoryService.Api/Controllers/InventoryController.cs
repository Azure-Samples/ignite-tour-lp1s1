using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Api.Models;
using InventoryService.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryService.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryManager inventoryManager;

        public InventoryController(InventoryManager inventoryManager)
        {
            this.inventoryManager = inventoryManager ?? throw new ArgumentNullException(nameof(inventoryManager));
        }

        [HttpGet]
        public async Task<IEnumerable<InventoryItem>> GetAsync()
        {
            var skusParam = Request.Query["skus"].FirstOrDefault();
            if (!string.IsNullOrEmpty(skusParam))
            {
                var skus = skusParam.Split(',', StringSplitOptions.RemoveEmptyEntries);
                return await inventoryManager.GetInventoryBySkusAsync(skus);
            }
            else
            {
                return new List<InventoryItem>();
            }
        }

        [HttpGet("{sku}")]
        public Task<IEnumerable<InventoryItem>> GetAsync(string sku)
        {
            return inventoryManager.GetInventoryBySkusAsync(new string[] { sku });
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
        }
    }
}
