package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.BeerRequest
import com.tsarpirate.shop.model.OrderBeer
import com.tsarpirate.shop.repository.BeerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class BeerService(private val beerRepo: BeerRepository) {

    //Admin operation
    fun getBeers(): List<Beer> = beerRepo.findAll()

    fun getBeerById(id: UUID): Beer? = beerRepo.findByIdOrNull(id)

    // Returns a beer with a single price model based on the license
    // Note: it is important that two licenses named the same don't exist
    fun getBeersForLicense(licenseType: String): List<OrderBeer> {
        val beerModels = getBeers().toMutableList()

        val orderBeers = beerModels.mapNotNull {
            val license = it.priceModels.find { it.licenseType == licenseType }
            val template = OrderBeer(
                it.id,
                it.amountAvailable,
                it.name,
                it.description,
                it.label,
               0,
                it.size
            )
            when {
                license != null -> template.copy(price = license.price)
                it.isAvailableByDefault -> template.copy(price = it.defaultPrice)
                else -> null
            }
        }
        return orderBeers
    }

    //Admin operation
    fun addBeer(beerRequest: BeerRequest) = beerRepo.insert(
        Beer(id = UUID.randomUUID(),
        name = beerRequest.name,
        amountInStock = beerRequest.amountInStock,
        amountAvailable = beerRequest.amountAvailable,
        defaultPrice = beerRequest.defaultPrice,
        description = beerRequest.description,
        label = beerRequest.label,
        priceModels = beerRequest.priceModels,
        size = beerRequest.size,
        isAvailableByDefault = beerRequest.isAvailableByDefault))


    //Admin operation
    fun updateBeer(beer: Beer) = beerRepo.save(beer)

    //Admin operation
    fun removeBeer(uuid: UUID) = beerRepo.deleteById(uuid)
}

