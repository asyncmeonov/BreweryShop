package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.Delivery
import com.tsarpirate.shop.model.DeliveryRequest
import com.tsarpirate.shop.service.DeliveryService
import com.tsarpirate.shop.service.OrderService
import jdk.jfr.ContentType
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
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.time.LocalDate
import java.util.*
import javax.servlet.http.HttpServletResponse

@RestController
class DeliveryController(val deliveryService: DeliveryService) {

    private val logger: Logger = LoggerFactory.getLogger(DeliveryController::class.java)

    @GetMapping("/delivery")
    fun getDeliveryDates(auth: Authentication): List<LocalDate> {
        logger.info("Retrieving all delivery dates...")
        return deliveryService.getDeliveries().map { it.deliveryDate }
    }

    @GetMapping("/admin/delivery")
    @PreAuthorize("hasRole('admin')")
    fun allDeliveries(auth: Authentication): List<Delivery> {
        logger.info("Retrieving all delivery...")
        return deliveryService.getDeliveries()
    }

    @PostMapping("/admin/delivery")
    @PreAuthorize("hasRole('admin')")
    fun createDelivery(@RequestBody delivery: DeliveryRequest): ResponseEntity<Any> {
        logger.info("Creating a new delivery for ${delivery.deliveryDate}...")
        deliveryService.addDelivery(delivery)
        return ResponseEntity.ok("Successfully created delivery on ${delivery.deliveryDate}")
    }

    @PutMapping("/admin/delivery")
    @PreAuthorize("hasRole('admin')")
    fun updateDelivery(@RequestBody delivery: Delivery): ResponseEntity<String> {
        if (deliveryService.getDeliveryById(delivery.id) == null) return ResponseEntity.badRequest()
            .body("Could not find ${delivery.id} to be updated. Make sure that the delivery exists.")
        deliveryService.updateDelivery(delivery)
        return ResponseEntity.ok("Successfully updated delivery on ${delivery.deliveryDate}")
    }

    @DeleteMapping("/admin/delivery/{id}")
    @PreAuthorize("hasRole('admin')")
    fun deleteDelivery(@PathVariable("id") id: String): ResponseEntity<String> {
        val delivery = deliveryService.getDeliveryById(UUID.fromString(id))
            ?: return ResponseEntity.badRequest()
                .body("Could not find $id to be Removed. Make sure you have included the id field of the delivery you want deleted. ")
        logger.info("Removing delivery $id on ${delivery.deliveryDate}...")
        deliveryService.removeDelivery(delivery.id)
        return ResponseEntity.ok("Successfully removed $id")
    }
}