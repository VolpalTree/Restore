using System;
using API.Data;
using API.DTOs;
using API.Extention;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;

public class PaymentsController(PaymentServices paymentService, StoreContext context) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateorUpdatePaymentIntent()
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("Problem with basket");

        var intent = await paymentService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) return BadRequest("Problem creating a payment intent");

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;


        if (context.ChangeTracker.HasChanges())
        {
            var result = await context.SaveChangesAsync() > 0;
            if (!result) return BadRequest("Problem updating basket with intent");
        }

        

        return basket.ToDto();
    }
}
