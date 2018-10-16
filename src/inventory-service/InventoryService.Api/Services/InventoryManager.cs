using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using InventoryService.Api.Models;

namespace InventoryService.Api.Services
{
    public class InventoryManager
    {
        private readonly IInventoryData data;

        public InventoryManager(IInventoryData data)
        {
            this.data = data;
        }

        public async Task<IEnumerable<InventoryItem>> GetInventoryBySkusAsync(IEnumerable<string> skus)
        {
            var sanitizedSkus = SanitizedSkus(skus);
            List<InventoryItem> results;
            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                results = (await data.GetInventoryBySkusAsync(sanitizedSkus)).ToList();
                if (results.Count != sanitizedSkus.Count())
                {
                    var missingSkus = sanitizedSkus.Except(results.Select(i => i.Sku));
                    foreach (var sku in missingSkus)
                    {
                        var random = new Random();
                        results.Add(await data.CreateInventory(sku, random.Next(1, 100)));
                    }
                }
                scope.Complete();
            }
            return results;
        }

        private List<string> SanitizedSkus(IEnumerable<string> skus)
        {
            return skus.Select(sku => sku.Trim()).ToList();
        }
    }
}