package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.OrderBeer
import com.tsarpirate.shop.repository.BeerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.UUID
@Service
class BeerService(private val beerRepo: BeerRepository) {

    //Admin operation
    fun getBeers(): List<Beer> = beerRepo.findAll()

    fun getBeerById(id: UUID) : Beer? = beerRepo.findByIdOrNull(id)

    // Returns a beer with a single price model based on the license
    // Note: it is important that two licenses named the same don't exist
    fun getBeersForLicense(licenseType: String): List<OrderBeer> {
        val beerModels =
            getBeers().toMutableList()
        val licensedBeers = beerModels.takeWhile { it.priceModels.any { pModel -> pModel.licenseType.equals(licenseType, ignoreCase = true)  } }
        beerModels.removeAll(licensedBeers)
        val defaultBeers = beerModels.filter { it.isAvailableByDefault }
        val beers = licensedBeers + defaultBeers

        return beers.map {
            OrderBeer(
                it.id,
                it.amountAvailable,
                it.name,
                it.description,
                it.label,
                if (it.priceModels.isEmpty()) it.defaultPrice else it.priceModels.first { beer -> beer.licenseType == licenseType }.price,
                it.size
            )
        }
    }

    //Admin operation
    fun addBeer(beer: Beer) = beerRepo.insert(beer)


    //Admin operation
    fun updateBeer(beer: Beer) = beerRepo.save(beer)

    //Admin operation
    fun removeBeer(uuid: UUID) {
        throw NotImplementedError("TBD")
    }
}

