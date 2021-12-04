using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CatalogService.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Videos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(24)", nullable: false),
                    ImageFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserVideoLists",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    VideoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVideoLists", x => new { x.UserId, x.VideoId });
                    table.ForeignKey(
                        name: "FK_UserVideoLists_Videos_VideoId",
                        column: x => x.VideoId,
                        principalTable: "Videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserVideoProgresses",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    VideoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Progress = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVideoProgresses", x => new { x.UserId, x.VideoId });
                    table.ForeignKey(
                        name: "FK_UserVideoProgresses_Videos_VideoId",
                        column: x => x.VideoId,
                        principalTable: "Videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserVideoLists_UserId",
                table: "UserVideoLists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVideoLists_VideoId",
                table: "UserVideoLists",
                column: "VideoId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVideoProgresses_UserId",
                table: "UserVideoProgresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVideoProgresses_VideoId",
                table: "UserVideoProgresses",
                column: "VideoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserVideoLists");

            migrationBuilder.DropTable(
                name: "UserVideoProgresses");

            migrationBuilder.DropTable(
                name: "Videos");
        }
    }
}
