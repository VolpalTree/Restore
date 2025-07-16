using System;
using System.Security.Claims;

namespace API.Extention;

public static class ClaimPrincipalExtension
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        return user.Identity?.Name ?? throw new UnauthorizedAccessException(); 
    }
}
