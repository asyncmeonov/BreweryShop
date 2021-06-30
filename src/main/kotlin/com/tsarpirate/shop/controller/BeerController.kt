package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.BeerRequest
import com.tsarpirate.shop.model.OrderBeer
import com.tsarpirate.shop.service.BeerService
import com.tsarpirate.shop.service.LicenseService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.util.*

@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
class BeerController(val beerService: BeerService, val licenseService: LicenseService) {

    private val logger: Logger = LoggerFactory.getLogger(BeerController::class.java)

    @GetMapping("/beers")
    fun getBeersForLicense(auth:Authentication): List<OrderBeer> {
        val licenseVal = auth.name
        val license = licenseService.getLicenseByValue(licenseVal)
        return if (license != null) {
            logger.info("Retrieving all beers with $license license...")
            beerService.getBeersForLicense(license.type)
        } else {
            logger.info("$license is not a valid license. Please make sure it exists.")
            listOf()
        }
    }

    @GetMapping("/admin/beers")
    @PreAuthorize("hasRole('admin')")
    fun allBeers(auth: Authentication): List<Beer> {
        logger.info("Retrieving all beers...")
        return beerService.getBeers()
    }

    @PostMapping("/admin/beers")
    fun createBeer(@RequestBody beer: BeerRequest): ResponseEntity<Any> {
        val totalValid = beer.priceModels.count { it != null }
        if (beer.priceModels.mapNotNull { it?.licenseType }.distinct().size != totalValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                "Failed creating ${beer.name}. " +
                        "Duplicate license types are not allowed. Create a new beer if you want to reuse a license type."
            )
        }
        logger.info("Creating a new beer named ${beer.name}...")
        beerService.addBeer(beer)
        return ResponseEntity.ok("Successfully created ${beer.name}")
    }

    @PutMapping("/admin/beers")
    @PreAuthorize("hasRole('admin')")
    fun updateBeer(@RequestBody beer: Beer): ResponseEntity<String> {
        if(beerService.getBeerById(beer.id) == null) return ResponseEntity.badRequest()
            .body("Could not find ${beer.id} to be updated. Make sure you have included the id field of the beer you want updated. ")
        logger.info("Updating ${beer.name}...")
        beerService.updateBeer(beer)
        return ResponseEntity.ok("Successfully updated ${beer.name}")
    }

    @DeleteMapping("/admin/beers/{id}")
    @PreAuthorize("hasRole('admin')")
    fun deleteBeer(@PathVariable("id") id: String): ResponseEntity<String> {
        val beer = beerService.getBeerById(UUID.fromString(id))
        if(beer == null) return ResponseEntity.badRequest()
            .body("Could not find ${id} to be Removed. Make sure you have included the id field of the beer you want deleted. ")
        logger.info("Removing ${beer.name}...")
        beerService.removeBeer(beer.id)
        return ResponseEntity.ok("Successfully removed ${beer.name}")
    }
}