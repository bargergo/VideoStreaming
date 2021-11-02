using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace UploadService.Authentication
{
    public class CustomJwtAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();
        private readonly ILogger<CustomJwtAuthenticationHandler> _ilogger;

        public CustomJwtAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            ILogger<CustomJwtAuthenticationHandler> ilogger)
            : base(options, logger, encoder, clock)
        {
            _ilogger = ilogger;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            _ilogger.LogInformation($"HandleAuthenticateAsync");
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                _ilogger.LogInformation($"Authorization header is missing");
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
            }
                
            var authHeader = Request.Headers["Authorization"].ToString();
            _ilogger.LogInformation($"Authorization header: {authHeader}");

            int? userId = null;
            if (authHeader != null && authHeader.Length > 0)
            {
                try
                {
                    var token = _tokenHandler.ReadJwtToken(authHeader.Substring("Bearer ".Length));
                    var userIdClaim = token.Claims.FirstOrDefault(c => c.Type == "userId");
                    var ui = int.Parse(userIdClaim.Value);
                    userId = ui;
                }
                catch
                {
                    return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
                }
            }
            if (userId == null)
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
            }

            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, "Username"),
                new Claim(ClaimTypes.Name, "Username"),
                new Claim("userId", $"{userId}")
            };

            return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme.Name)), Scheme.Name)));

        }
    }
}
