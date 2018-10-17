using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Api.Models;
using InventoryService.Api.Services;
using Moq;
using Xunit;

namespace InventoryService.Tests
{
    public class InventoryManagerTests
    {
        [Fact]
        public async Task GetInventoryBySkus_ShouldReturnInventory()
        {
            var input = new [] { " sku1 ", "sku2" };
            var dataMock = new Mock<IInventoryData>();
            dataMock
                .Setup(m => m.GetInventoryBySkus(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new []
                    { 
                        new InventoryItem { Sku = "sku1" },
                        new InventoryItem { Sku = "sku2" }
                    });
            var sut = new InventoryManager(dataMock.Object);

            var actual = await sut.GetInventoryBySkus(input);

            Assert.Equal(new [] { "sku1", "sku2" }, actual.Select(i => i.Sku));
        }

        [Fact]
        public async Task GetInventoryBySkus_ShouldAddMissingSkus()
        {
            var input = new [] { "sku1", "sku2", "sku3" };
            var createdSkus = new List<string>();
            var dataMock = new Mock<IInventoryData>();
            dataMock
                .Setup(m => m.GetInventoryBySkus(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(new []
                    { 
                        new InventoryItem { Sku = "sku1" }
                    });
            dataMock
                .Setup(m => m.CreateInventory(It.IsAny<string>(), It.IsAny<int>()))
                .Callback((string sku, int _) => createdSkus.Add(sku))
                .ReturnsAsync((string sku, int _) => new InventoryItem { Sku = sku });
            var sut = new InventoryManager(dataMock.Object);

            var actual = await sut.GetInventoryBySkus(input);

            Assert.Equal(input, actual.Select(i => i.Sku));
            Assert.Equal(new [] { "sku2", "sku3" }, createdSkus);
        }

        [Fact]
        public async Task IncrementInventory_IncrementsQuantityByOne()
        {
            var dataMock = new Mock<IInventoryData>();
            dataMock
                .Setup(m => m.UpdateInventory(It.IsAny<string>(), It.IsAny<int>()))
                .ReturnsAsync(new InventoryItem());
            var sut = new InventoryManager(dataMock.Object);

            await sut.IncrementInventory("foo");

            dataMock.Verify(m => m.UpdateInventory("foo", 1), Times.Once);
            dataMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DecrementInventory_DecrementsQuantityByOne()
        {
            var dataMock = new Mock<IInventoryData>();
            dataMock
                .Setup(m => m.UpdateInventory(It.IsAny<string>(), It.IsAny<int>()))
                .ReturnsAsync(new InventoryItem());
            var sut = new InventoryManager(dataMock.Object);

            await sut.DecrementInventory("foo");

            dataMock.Verify(m => m.UpdateInventory("foo", -1), Times.Once);
            dataMock.VerifyNoOtherCalls();
        }
    }
}
