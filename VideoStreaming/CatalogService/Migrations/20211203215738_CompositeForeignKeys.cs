using Microsoft.EntityFrameworkCore.Migrations;

namespace CatalogService.Migrations
{
    public partial class CompositeForeignKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserVideoLists_Videos_VideoId",
                table: "UserVideoLists");

            migrationBuilder.DropForeignKey(
                name: "FK_UserVideoProgresses_Videos_VideoId",
                table: "UserVideoProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserVideoProgresses",
                table: "UserVideoProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserVideoLists",
                table: "UserVideoLists");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserVideoProgresses");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserVideoLists");

            migrationBuilder.AlterColumn<int>(
                name: "VideoId",
                table: "UserVideoProgresses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "VideoId",
                table: "UserVideoLists",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserVideoProgresses",
                table: "UserVideoProgresses",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserVideoLists",
                table: "UserVideoLists",
                columns: new[] { "UserId", "VideoId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserVideoLists_Videos_VideoId",
                table: "UserVideoLists",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserVideoProgresses_Videos_VideoId",
                table: "UserVideoProgresses",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserVideoLists_Videos_VideoId",
                table: "UserVideoLists");

            migrationBuilder.DropForeignKey(
                name: "FK_UserVideoProgresses_Videos_VideoId",
                table: "UserVideoProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserVideoProgresses",
                table: "UserVideoProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserVideoLists",
                table: "UserVideoLists");

            migrationBuilder.AlterColumn<int>(
                name: "VideoId",
                table: "UserVideoProgresses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "UserVideoProgresses",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "VideoId",
                table: "UserVideoLists",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "UserVideoLists",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserVideoProgresses",
                table: "UserVideoProgresses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserVideoLists",
                table: "UserVideoLists",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserVideoLists_Videos_VideoId",
                table: "UserVideoLists",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserVideoProgresses_Videos_VideoId",
                table: "UserVideoProgresses",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
