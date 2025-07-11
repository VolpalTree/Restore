using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole {Id = "c658ba95-fed9-4be2-a175-f70fc3b71411", Name = "Member", NormalizedName = "MEMBER" },
                new IdentityRole {Id = "c1c15a03-fe46-4efd-bb20-662ce6c57c08", Name = "Admin", NormalizedName = "ADMIN" }
            );
    }
}