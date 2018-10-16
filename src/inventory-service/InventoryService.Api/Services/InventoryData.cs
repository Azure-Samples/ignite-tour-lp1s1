using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Api.Database;
using InventoryService.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Api.Services
{
    public class InventoryData
    {
        private readonly InventoryContext context;

        public InventoryData(InventoryContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<InventoryItem>> GetInventoryBySkusAsync(IEnumerable<string> skus)
        {
            return await context
                .Inventory
                .Where(i => skus.Contains(i.Sku))
                .ToListAsync()
                .ConfigureAwait(false);
        }
    }
}