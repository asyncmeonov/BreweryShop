package com.tsarpirate.shop.model

import java.util.UUID

/**
 * Beer that is displayed to a customer (and added to his order)
 * @param id unique identifier (same as the Beer stored for admin purposes)
 * @param amountAvailable how many beers are available for ordering (note: this is displayed to the user but is not guaranteed
 * to be an accurate representation of what is stored in the DB)
 * @param name of beer
 * @param description of beer
 * @param price of beer in stotinki (i.e. price = 250 is 2.5 lev)
 * @param size of beer in ml
 * @param amount ordered of this particular beer. Must be less than amountAvailable
 */
data class OrderBeer(val id: UUID,
                     val amountAvailable: Int,
                     val name: String,
                     val description: String,
                     val price: Int,
                     val size: Int,
                     val amount: Int = 0)
