package com.tsarpirate.shop.model

data class Beer(val name: String,
                val description: String,
                val amount: Int,
                val priceModels: List<PriceModel>)
