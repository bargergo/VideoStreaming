using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using UploadService.Exceptions;

namespace UploadService.Middlewares
{
    public class ClaimsPrincipalMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();
        private readonly ILogger<ClaimsPrincipalMiddleware> _ilogger;

        public ClaimsPrincipalMiddleware(RequestDelegate next, ILogger<ClaimsPrincipalMiddleware> ilogger)
        {
            _next = next;
            _ilogger = ilogger;
        }

        public async Task Invoke(HttpContext context)
        {
            _ilogger.LogInformation($"ClaimsPrincipalMiddleware");
            if (!context.Request.Headers.ContainsKey("Authorization"))
            {
                _ilogger.LogInformation($"Authorization header is missing");
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].ToString();
            _ilogger.LogInformation($"Authorization header: {authHeader}");


            if (authHeader == null && authHeader.Length == 0)
            {
                await _next(context);
                return;
            }
            int? userId = null;
            var token = _tokenHandler.ReadJwtToken(authHeader.Substring("Bearer ".Length));
            try
            {
                var userIdClaim = token.Claims.FirstOrDefault(c => c.Type == "userId");
                var ui = int.Parse(userIdClaim.Value);
                userId = ui;
            }
            catch
            {
                await _next(context);
                return;
            }
            if (userId == null)
            {
                await _next(context);
                return;
            }
            var roles = token.Claims.Where(c => c.Type == "roles");
            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, "Username"),
                new Claim(ClaimTypes.Name, "Username"),
                new Claim("userId", $"{userId}")
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, $"{role.Value}"));
            }
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims));
            await _next(context);
        }
    }

    public static class ClaimsPrincipalMiddlewareExtensions
    {
        public static IApplicationBuilder UseClaimsPrincipalMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ClaimsPrincipalMiddleware>();
        }
    }
}
