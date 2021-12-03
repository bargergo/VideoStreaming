using Microsoft.EntityFrameworkCore.Migrations;

namespace CatalogService.Migrations
{
    public partial class VideoNotNullableColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Videos_FileId",
                table: "Videos");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileId",
                table: "Videos",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_FileId",
                table: "Videos",
                column: "FileId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Videos_FileId",
                table: "Videos");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FileId",
                table: "Videos",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_FileId",
                table: "Videos",
                column: "FileId",
                unique: true,
                filter: "[FileId] IS NOT NULL");
        }
    }
}
