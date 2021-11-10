using CatalogService.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace CatalogService.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int UserId(this ClaimsPrincipal user)
        {
            try
            {
                var userIdStr = user?.Claims.Where(c => c.Type == "userId").FirstOrDefault()?.Value;
                return Convert.ToInt32(userIdStr);
            }
            catch
            {
                throw new AuthorizationException();
            }

        }

        public static List<string> GetRoles(this ClaimsPrincipal user)
        {
            return user?.Claims
                ?.Where(c => c.Type == ClaimTypes.Role)
                ?.Select(c => c.Value)
                ?.ToList() ?? new List<string>();
        }

        public static bool IsAdmin(this ClaimsPrincipal user)
        {
            return user.GetRoles().Contains("ROLE_ADMIN");
        }
    }
}
