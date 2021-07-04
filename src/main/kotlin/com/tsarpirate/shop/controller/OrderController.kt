package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.Order
import com.tsarpirate.shop.model.OrderRequest
import com.tsarpirate.shop.service.BeerService
import com.tsarpirate.shop.service.LicenseService
import com.tsarpirate.shop.service.OrderService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
class OrderController(val orderService: OrderService, val beerService: BeerService, val licenseService: LicenseService) {

    private val logger: Logger = LoggerFactory.getLogger(OrderController::class.java)

    @GetMapping("/admin/order")
    @PreAuthorize("hasRole('admin')")
    fun allOrders(): List<Order> {
        logger.info("Retrieving all orders...")
        return orderService.getOrders()
    }

    /**
     * 1. Get the beers requested from the beerService
     * 2. Validate that there are enough left (throw error if requesting non-existent or too much beers)
     * 3. Save order with the orderService
     * 4. Subtract the booked beers from the beers left
     */
    @Suppress("UNCHECKED_CAST")
    @PostMapping("/order")
    fun addOrder(@RequestBody orderRequest: OrderRequest, auth: Authentication): ResponseEntity<String> {
        return try {
            val license = licenseService.getLicenseByValue(auth.principal as String)
                ?: return ResponseEntity.badRequest().body("Invalid license.")

            val beersAndAmount = orderRequest.orderBeers.map { it.amount to beerService.getBeerById(it.id) }

            val errorResult = validateOrderRequest(beersAndAmount, license.type)
            if (errorResult != null) return errorResult
            beersAndAmount as List<Pair<Int, Beer>>

            logger.info("Creating order for ${orderRequest.pirateName}...")
            val order = orderService.addOrder(orderRequest, beersAndAmount, license)
            val updated =
                beersAndAmount.map { (amount, beer) -> beer.copy(amountAvailable = beer.amountAvailable - amount) }
            updated.forEach { beerService.updateBeer(it) }
            ResponseEntity.ok(
                "Your order was successfully received! Order number: ${order.id}. " +
                        "Follow our Discord server for delivery or pickup information."
            )
        } catch (ex: Exception) {
            logger.error("There was a problem with creating, $ex")
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }

    }

    @DeleteMapping("/admin/order")
    @PreAuthorize("hasRole('admin')")
    fun removeOrders(@RequestBody orderIds: List<UUID>): ResponseEntity<String> {
        logger.info("Removing ${orderIds.size} orders...")
        orderIds.forEach { orderService.removeOrder(it) }
        return ResponseEntity.ok("Closed ${orderIds.size} orders")
    }

    @PutMapping("/admin/order")
    fun updateOrder(@RequestBody order: Order) {
        logger.info("Updating ${order.id} ...")
        orderService.updateOrder(order)
    }

    /**
     * Order request is invalid if
     * 1. id for nonexistent beer is requested
     * 2. too many beers are requested
     * 3. a beer (that isn't available by default) is requested by a license that doesn't have a corresponding price model
     */
    private fun validateOrderRequest(
        beersAndAmount: List<Pair<Int, Beer?>>,
        licenseType: String
    ): ResponseEntity<String>? {
        if (beersAndAmount.any { (_, beer) -> beer == null }) return ResponseEntity
            .badRequest()
            .body("Invalid order. One or more beers you've selected are not served currently.")
        val outOfStock = beersAndAmount.filter { (amount, beer) -> amount > beer!!.amountAvailable }
        if (outOfStock.isNotEmpty()) return buildOutOfStockResponse(outOfStock)
        if (beersAndAmount.any { (_, beer) -> !beer!!.availableByDefault && !beer.hasPriceModelForLicense(licenseType) })
            return ResponseEntity //TODO test
                .badRequest()
                .body(
                    "Invalid order. Your license does not have access to this beer. " +
                            "This violation has been logged and we are coming to get you."
                )
        return null
    }

    private fun buildOutOfStockResponse(outOfStock: List<Pair<Int, Beer?>>): ResponseEntity<String> =
        ResponseEntity
            .badRequest()
            .body("Order Unsuccessful! Some beers are out of stock. " +
                    outOfStock.joinToString { (amount, beer) ->
                        "${beer!!.name} ${beer.size}ml: ${beer.amountAvailable} left / $amount requested."
                    } +
                    " Please go back and amend your order if you want to continue.")
}