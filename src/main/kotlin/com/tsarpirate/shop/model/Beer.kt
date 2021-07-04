package com.tsarpirate.shop.model

import java.net.URL
import java.util.UUID

/**
 * @param name of beer
 * @param description of beer
 * @param label of beer. Hyperlink pointing to image
 * @param amountInStock how many left we have in stock (includes ordered but not delivered beers as well)
 * @param amountAvailable how many non-ordered (reserved) beers are left
 * @param size in ml
 * @param defaultPrice the default price if retrieving with a license that has not been specified in the priceModels
 * @param priceModels different (price, license) pairs for the
 * @param availableByDefault flag for premium/secret beers that require a particular license.
 * If true, it will be displayed by default, if false, you would need a license in priceModels to obtain this beer
 */
data class Beer(
    val id: UUID,
    val name: String,
    val description: String,
    val label: URL,
    val amountInStock: Int,
    val amountAvailable: Int = amountInStock,
    val size: Int,
    val defaultPrice: Int,
    val priceModels: List<PriceModel>,
    val availableByDefault: Boolean
) {
    fun hasPriceModelForLicense(licenseType: String): Boolean = priceModels.any { it.licenseType == licenseType }
}

data class BeerRequest(
    val name: String,
    val description: String,
    val label: URL,
    val amountInStock: Int,
    val amountAvailable: Int = amountInStock,
    val size: Int,
    val defaultPrice: Int,
    val priceModels: List<PriceModel?>,
    val availableByDefault: Boolean
)