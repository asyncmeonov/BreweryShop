package com.tsarpirate.shop.model

import java.time.LocalDate
import java.util.UUID

/**
 * An object modelling Delivery of Orders
 * @param deliveryDate of when the delivery will be carried out
 * @param distributor, name of person carrying out the delivery
 * @param maxCapacity the tool amount of orders that can be fulfilled in this delivery
 * @param bookedOrders a list of UUIDs of the booked orders
 */
data class Delivery(
    val id: UUID,
    val deliveryDate: LocalDate,
    val distributor: String?,
    val maxCapacity: Int,
    val bookedOrders: List<UUID>
)

data class DeliveryRequest(
    val deliveryDate: LocalDate,
    val maxCapacity: Int
)