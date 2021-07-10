package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Delivery
import com.tsarpirate.shop.model.DeliveryRequest
import com.tsarpirate.shop.model.Order
import com.tsarpirate.shop.repository.DeliveryRepository
import org.apache.coyote.Response
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import java.time.LocalDate
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

    /**
     * Algorithm used for associating orders to deliveries given a requested delivery date by the user
     * First-come-first-serve logic
     * 1. pool all deliveries (if any) for the given date
     * 2. add the order to the first non-full delivery (non-full deliveries are ones that have not exceeded their maxCapacity)
     * @param deliveryDate when the user wants the order to be delivered
     * @param order the order that would be allocated to a delivery
     * TODO test this method extensively
     */
    fun distributeOrderForDelivery(deliveryDate: LocalDate?, order: Order) {
        if (deliveryDate == null) return //this order has not been requested for delivery
        val deliveries = getDeliveries().filter { it.deliveryDate.isEqual(deliveryDate) }
//TODO for some reason the deliveryDate sent from the FE is one day earlier. Date conversions perhaps ?
        validateDeliveriesForDate(deliveryDate, deliveries)

        val selected = deliveries.first { !it.isFull() }.id
        addOrderToDelivery(selected, order.id)
    }

    fun addOrderToDelivery(deliveryId: UUID, orderId: UUID): Delivery {
        val delivery = getDeliveryById(deliveryId) ?: throw IllegalArgumentException("$deliveryId does not exist.")
        if (delivery.bookedOrders.size >= delivery.maxCapacity)
            throw IllegalArgumentException("Delivery $deliveryId is already fully booked. Cannot add more orders.")

        val updatedDelivery = delivery.copy(bookedOrders = delivery.bookedOrders + orderId)
        return updateDelivery(updatedDelivery)
    }

    fun updateDelivery(delivery: Delivery) = deliveryRepo.save(delivery)

    fun removeDelivery(id: UUID) = deliveryRepo.deleteById(id)

    fun getAsCsv(deliveryIds: List<UUID>) {
        TODO()
    }

    private fun validateDeliveriesForDate(deliveryDate: LocalDate, deliveries: List<Delivery>) {
        when {
            deliveries.isNullOrEmpty() -> throw IllegalArgumentException("There are no deliveries on $deliveryDate")
            deliveries.all { it.isFull() } -> throw IllegalArgumentException("There are no deliveries on $deliveryDate")
        }
    }
}

