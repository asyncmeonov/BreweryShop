package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Beer
import com.tsarpirate.shop.model.Order
import com.tsarpirate.shop.service.BeerService
import com.tsarpirate.shop.service.OrderService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
class OrderController(val orderService: OrderService, val beerService: BeerService) {

    private val logger: Logger = LoggerFactory.getLogger(OrderController::class.java)

    @GetMapping("/order")
    fun allOrders(): List<Order> {
        logger.info("Retrieving all orders...")
        return orderService.getOrders()
    }

    @PostMapping("/order")
    fun addOrder(@RequestBody order: Order): ResponseEntity<String> {
        val beersAndAmount = order.orderBeers.map { Pair(it.amount, beerService.getBeerById(it.id)) }
        if (beersAndAmount.any { it.second == null }) return ResponseEntity
            .badRequest()
            .body("Invalid order. One or more beers you've selected are not served currently.")
        val outOfStock = beersAndAmount.filter { it.first > it.second!!.amountAvailable }
        if (outOfStock.isNotEmpty()) return buildOutOfStockResponse(outOfStock)
        logger.info("Creating order ${order.id} for ${order.pirateName}...")
        orderService.addOrder(order)
        val updated = beersAndAmount.map { it.second!!.copy(amountAvailable = it.second!!.amountAvailable - it.first) }
        updated.forEach { beerService.updateBeer(it) }
        return ResponseEntity.ok("Successfully created ${order.id}")
    }

    @DeleteMapping("/order")
    fun removeOrders(@RequestBody orderIds: List<UUID>): ResponseEntity<String> {
        logger.info("Removing ${orderIds.size} orders...")
        orderIds.forEach { orderService.removeOrder(it) }
        return ResponseEntity.ok("Closed ${orderIds.size} orders")
    }

    @PutMapping("/order")
    fun updateOrder(@RequestBody order: Order) {
        logger.info("Updating ${order.id} ...")
        orderService.updateOrder(order)
    }

    private fun buildOutOfStockResponse(outOfStock: List<Pair<Int, Beer?>>): ResponseEntity<String> =
        ResponseEntity
            .badRequest()
            .body("Order Unsuccessful! Some beers are out of stock. " +
                    outOfStock.joinToString {
                        "${it.second!!.name}: ${it.second!!.amountAvailable} left/${it.first} requested"
                    } +
                    ". Please go back and amend your order if you want to continue.")
}