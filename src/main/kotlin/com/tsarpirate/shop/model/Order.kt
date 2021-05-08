package com.tsarpirate.shop.model

import java.time.LocalDate
import java.util.UUID

data class Order(val id: UUID = UUID.randomUUID(),
                 val orderBeers: List<OrderBeer>,
                 val pirateName: String,    // alias of pirate ordering the beer
                 val pirateContact: String, // how the pirate wants to be contacted
                 //Admin fields
                 val dateCreated: LocalDate = LocalDate.now(),
                 val dateCompleted: LocalDate?, // date of when the order been delivered and closed + payment
                 val notes: String?)