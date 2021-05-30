package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.OrderBeer
import com.tsarpirate.shop.service.BeerService
import com.tsarpirate.shop.service.LicenseService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
class BeerController(val beerService: BeerService, val licenseService: LicenseService) {

    private val logger: Logger = LoggerFactory.getLogger(BeerController::class.java)

    @GetMapping("/beers")
    fun allBeers(): List<Beer> {
        logger.info("Retrieving all beers...")
        return beerService.getBeers()
    }

    @GetMapping("/beers/{license}")
    fun getBeersForLicense(@PathVariable(name = "license") licenseVal: String): List<OrderBeer> {
        val license = licenseService.getLicenseByValue(licenseVal)
        return if (license != null) {
            logger.info("Retrieving all beers with $license license...")
            beerService.getBeersForLicense(license.type)
        } else {
            logger.info("$license is not a valid license. Please make sure it exists.")
            listOf()
        }
    }

    @PostMapping("/beers")
    fun createBeer(@RequestBody beer: Beer): ResponseEntity<Any> {
        if (beer.priceModels.map { it.licenseType }.distinct().size != beer.priceModels.size) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                "Failed creating ${beer.name}. " +
                        "Duplicate license types are not allowed. Create a new beer if you want to reuse a license type."
            )
        }
        logger.info("Creating a new beer named ${beer.name}...")
        val corrPriceModels = beer.priceModels.map { it.copy(licenseType = it.licenseType.toUpperCase()) }
        beerService.addBeer(beer.copy(priceModels = corrPriceModels))
        return ResponseEntity.ok("Successfully created ${beer.name}")
    }

    @PutMapping("/beers")
    fun updateBeer(@RequestBody beer: Beer): ResponseEntity<String> {
        if(beerService.getBeerById(beer.id) == null) return ResponseEntity.badRequest()
            .body("Could not find ${beer.id} to be updated. Make sure you have included the id field of the beer you want updated. ")
        logger.info("Updating ${beer.name}...")
        beerService.updateBeer(beer)
        return ResponseEntity.ok("Successfully updated ${beer.name}")
    }
}