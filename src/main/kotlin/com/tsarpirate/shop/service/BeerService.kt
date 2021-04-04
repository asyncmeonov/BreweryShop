package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.repository.BeerRepository
import org.springframework.stereotype.Service

@Service
class BeerService(private val beerRepo: BeerRepository) {

    fun getBeers(): List<Beer>{
        return beerRepo.findAll()
    }

    fun getBeersForLicense(licenseType:String): List<Beer>{
        return getBeers().takeWhile { it.priceModels.any { pModel -> pModel.licenseType == licenseType} }
    }

    fun addBeer(beer:Beer) {
        beerRepo.insert(beer)
    }

    fun updateBeer(beer:Beer) {
         throw NotImplementedError("TBD")
    }
}