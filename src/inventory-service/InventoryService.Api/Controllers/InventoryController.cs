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
        private readonly InventoryData data;

        public InventoryController(InventoryData data)
        {
            this.data = data;
        }

        [HttpGet("{sku}")]
        public Task<IEnumerable<InventoryItem>> GetAsync(string sku)
        {
            return data.GetInventoryBySkusAsync(new string[] { sku });
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
        }
    }
}
