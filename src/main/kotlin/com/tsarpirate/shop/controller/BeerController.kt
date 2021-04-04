package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.service.BeerService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
class BeerController(val beerService: BeerService) {

    private val logger: Logger = LoggerFactory.getLogger(BeerController::class.java)

    @GetMapping("/beers")
    fun allBeers(): List<Beer> {
        logger.info("Retrieving all beers...")
        return beerService.getBeers()
    }

    @GetMapping("/beers/{license}")
    fun getBeersForLicense(@PathVariable(name = "license") licenseType: String): List<Beer> {
        logger.info("Retrieving all beers with $licenseType license...")
        return beerService.getBeersForLicense(licenseType)
    }

    @PostMapping("/beers")
    fun createBeer(@RequestBody beer: Beer) {
        logger.info("Creating a new beer named ${beer.name}...")
        beerService.addBeer(beer)
    }

    @PutMapping("/beers")
    fun updateBeer(@RequestBody beer: Beer) {
        logger.info("Updating ${beer.name}...")
        beerService.updateBeer(beer)
    }
}