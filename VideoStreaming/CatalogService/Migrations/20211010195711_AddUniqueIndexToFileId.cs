using Microsoft.EntityFrameworkCore.Migrations;

namespace CatalogService.Migrations
{
    public partial class AddUniqueIndexToFileId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FileId",
                table: "Videos",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_FileId",
                table: "Videos",
                column: "FileId",
                unique: true,
                filter: "[FileId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Videos_FileId",
                table: "Videos");

            migrationBuilder.AlterColumn<string>(
                name: "FileId",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
