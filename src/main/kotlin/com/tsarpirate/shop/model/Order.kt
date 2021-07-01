package com.tsarpirate.shop.model

import java.time.LocalDate
import java.util.UUID

data class Order(val id: UUID,
                 val orderBeers: List<OrderBeer>,
                 val total: Int,
                 val pirateName: String,    // alias of pirate ordering the beer
                 val pirateContact: String, // how the pirate wants to be contacted
                 val license: String,
                 val licenseType: String, // the license type this order was made with
                 val dateCreated: LocalDate,
                 val dateCompleted: LocalDate?, // date of when the order been delivered and closed + payment
                 val notes: String?)

data class OrderRequest(val orderBeers: List<OrderBeer>,
                        val pirateName: String,
                        val pirateContact: String)