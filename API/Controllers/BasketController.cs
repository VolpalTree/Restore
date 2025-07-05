using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extention;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetriveBasket();

        if (basket == null) return NoContent();

        return basket.ToDto();

    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        var basket = await RetriveBasket();
        basket ??= CreateBasket();

        var product = await context.Products.FindAsync(productId);

        if (product == null) return BadRequest("Problem adding item to basket");

        basket.AddItem(product, quantity);
        
        var result = await context.SaveChangesAsync() > 0;

        if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());
        
        return BadRequest("Cannot add item to basket");
    }



    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        //get Basket
        var basket = await RetriveBasket();
        // remove item from basket
        if (basket == null) return BadRequest("Unable to retrive item from basket");

        basket.RemoveItem(productId, quantity);

        var result = await context.SaveChangesAsync() > 0;


        if (result) return Ok();
        
        return BadRequest("Problem removing item from basket");
    }

    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();
        var cookiesOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("basketId", basketId, cookiesOptions);
        var basket = new Basket { BasketId = basketId };
        context.Baskets.Add(basket);
        return basket;
    }

    private async Task<Basket?> RetriveBasket()
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
    }
}
