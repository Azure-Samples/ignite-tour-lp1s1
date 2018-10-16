using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Api.Database;
using InventoryService.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Api.Services
{
    public class SqlInventoryData : IInventoryData
    {
        private readonly InventoryContext context;

        public SqlInventoryData(InventoryContext context)
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

        public async Task<InventoryItem> CreateInventory(string sku, int quantity)
        {
            var item = new InventoryItem
            {
                Sku = sku,
                Quantity = quantity
            };
            context.Inventory.Add(item);
            await context.SaveChangesAsync();
            return item;
        }
    }
}