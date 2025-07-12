using System;
using API.DTOs;
using API.Entities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace API.Extention;

public static class BasketExtensioins
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                PictureUrl = item.Product.PictureUrl,
                Brand = item.Product.Brand,
                Type = item.Product.Type,
                Quantity = item.Quantity
            }).ToList()
        };
    }

    public static async Task<Basket> GetBasketWithItems(this IQueryable<Basket> query,
        string? basketId)
    {
        return await query
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == basketId)
                ?? throw new Exception("Cannot get basket");
    }


}
