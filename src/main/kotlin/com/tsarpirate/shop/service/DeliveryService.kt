package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Delivery
import com.tsarpirate.shop.model.DeliveryRequest
import com.tsarpirate.shop.repository.DeliveryRepository
import org.apache.coyote.Response
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class DeliveryService(private val deliveryRepo: DeliveryRepository) {

    fun getDeliveries(): List<Delivery> = deliveryRepo.findAll()

    fun getDeliveryById(id: UUID): Delivery? = deliveryRepo.findByIdOrNull(id)

    fun addDelivery(deliveryRequest: DeliveryRequest) = deliveryRepo.insert(
        Delivery(
            id = UUID.randomUUID(),
            distributor = null,
            deliveryDate = deliveryRequest.deliveryDate,
            maxCapacity = deliveryRequest.maxCapacity,
            bookedOrders = listOf()
        )
    )

    fun addOrderToDelivery(deliveryId: UUID, orderId: UUID): ResponseEntity<String> {
        val delivery = getDeliveryById(deliveryId) ?: return ResponseEntity.badRequest().body("$deliveryId does not exist.")
        if (delivery.bookedOrders.size >= delivery.maxCapacity){
            return ResponseEntity.unprocessableEntity().body("Delivery $deliveryId is already fully booked. Cannot add more orders.")
        }
        val updatedDelivery = delivery.copy(bookedOrders = delivery.bookedOrders + orderId)
        updateDelivery(updatedDelivery)
            return ResponseEntity.ok("Added order $orderId to delivery $deliveryId")
    }

    fun updateDelivery(delivery: Delivery) = deliveryRepo.save(delivery)

    fun removeDelivery(id: UUID) = deliveryRepo.deleteById(id)

    fun getAsCsv(deliveryIds: List<UUID>) {
        TODO()
    }
}

