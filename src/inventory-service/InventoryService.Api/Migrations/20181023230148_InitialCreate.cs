using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace InventoryService.Api.Migrations
{
  public partial class InitialCreate : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Inventory",
          columns: table => new
          {
            Sku = table.Column<string>(nullable: false),
            Quantity = table.Column<int>(nullable: false),
            Modified = table.Column<DateTime>(nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Inventory", x => x.Sku);
          });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "Inventory");
    }
  }
}
