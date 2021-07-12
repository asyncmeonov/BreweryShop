package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.Order
import com.tsarpirate.shop.model.OrderRequest
import com.tsarpirate.shop.service.BeerService
import com.tsarpirate.shop.service.DeliveryService
import com.tsarpirate.shop.service.LicenseService
import com.tsarpirate.shop.service.OrderService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import javax.servlet.http.HttpServletResponse
import javax.websocket.server.PathParam

@RestController
class OrderController(
    val orderService: OrderService,
    val beerService: BeerService,
    val licenseService: LicenseService,
    val deliveryService: DeliveryService
) {

    private val logger: Logger = LoggerFactory.getLogger(OrderController::class.java)

    @GetMapping("/admin/order")
    @PreAuthorize("hasRole('admin')")
    fun allOrders(): List<Order> {
        logger.info("Retrieving all orders...")
        return orderService.getOrders()
    }

    @GetMapping("/admin/order/{deliveryId}")
    @PreAuthorize("hasRole('admin')")
    fun getOrdersForDelivery(@PathVariable("deliveryId") deliveryId: String): List<Order> {
        val delivery = deliveryService.getDeliveryById(UUID.fromString(deliveryId))
            ?: throw IllegalArgumentException("Delivery $deliveryId doesn't exist.")
        return delivery.bookedOrders.mapNotNull { orderService.getOrder(it) }
    }

    /**
     * 1. Get the beers requested from the beerService
     * 2. Validate that there are enough left (throw error if requesting non-existent or too much beers)
     * 3. Validate that the delivery will have room for this order
     * 4. Save order with the orderService
     * 5. Save the order ID to the delivery
     * 4. Subtract the booked beers from the beers left
     *
     * TODO: test this pls
     */
    @Suppress("UNCHECKED_CAST")
    @PostMapping("/order")
    fun addOrder(
        @RequestBody orderRequest: OrderRequest,
        @PathParam("delivery") delivery: String? = null,
        auth: Authentication
    ): ResponseEntity<String> {
        return try {
            val dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy")
            val deliveryDate = if (delivery != null) LocalDate.parse(delivery, dtf) else null
            val license = licenseService.getLicenseByValue(auth.principal as String)
                ?: return ResponseEntity.badRequest().body("Invalid license.")

            val beersAndAmount = orderRequest.orderBeers.map { it.amount to beerService.getBeerById(it.id) }

            val errorResult = validateOrderRequest(beersAndAmount, license.type)
            if (errorResult != null) return errorResult
            beersAndAmount as List<Pair<Int, Beer>>

            logger.info("Creating order for ${orderRequest.pirateName}...")
            val order = orderService.addOrder(orderRequest, beersAndAmount, license)

            deliveryService.distributeOrderForDelivery(deliveryDate, order)

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

    @DeleteMapping("/admin/order/{id}")
    @PreAuthorize("hasRole('admin')")
    fun removeOrders(@PathVariable("id") id: String): ResponseEntity<String> {
        logger.info("Removing ${id}...")
        orderService.removeOrder(UUID.fromString(id))
        return ResponseEntity.ok("Deleted $id")
    }

    @PutMapping("/admin/order/complete/{id}")
    @PreAuthorize("hasRole('admin')")
    fun completeOrder(@PathVariable("id") id: String): ResponseEntity<String> {
        val order = orderService.getOrder(UUID.fromString(id)) ?: return ResponseEntity.badRequest()
            .body("Order $id doesn't exist")
        return updateOrder(order.copy(dateCompleted = LocalDate.now()))
    }

    @PutMapping("/admin/order")
    fun updateOrder(@RequestBody order: Order): ResponseEntity<String> {
        logger.info("Updating ${order.id} ...")
        orderService.updateOrder(order)
        return ResponseEntity.ok("Successfully updated ${order.id}")
    }

    @GetMapping("/admin/order/delivery/export-csv/{deliveryId}", produces = ["text/csv"])
    @PreAuthorize("hasRole('admin')")
    fun exportOrdersForDeliveryToCSV(
        @PathVariable("deliveryId") deliveryId: String,
        response: HttpServletResponse
    ): ResponseEntity<Resource> {
        logger.info("Exporting $deliveryId ...")
        val delivery = deliveryService.getDeliveryById(UUID.fromString(deliveryId))
            ?: throw IllegalArgumentException("Delivery with id $deliveryId doesn't exist.")

        val fileInputStream = InputStreamResource(orderService.getAsCsv(delivery.bookedOrders))

        // setting HTTP headers
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test.csv")
        // defining the custom Content-Type
        headers.set(HttpHeaders.CONTENT_TYPE, "text/csv")

        return ResponseEntity(
            fileInputStream,
            headers,
            HttpStatus.OK
        )
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