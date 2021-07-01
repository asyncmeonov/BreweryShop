package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.*
import com.tsarpirate.shop.repository.OrderRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.UUID

@Service
class OrderService(private val orderRepo: OrderRepository) {

    fun getOrders(): List<Order> = orderRepo.findAll()

    fun getOrder(id:UUID): Order? = orderRepo.findByIdOrNull(id)

    fun addOrder(orderRequest: OrderRequest, beersAndAmount: List<Pair<Int, Beer>>, license: License): Order {

        val total = beersAndAmount.map { (amount, beer) ->
            amount to (beer.priceModels.find { it.licenseType == license.type }?.price ?: beer.defaultPrice)
        }.sumBy { (amount, price) -> amount * price }

        val order = Order(id = UUID.randomUUID(),
        orderBeers = orderRequest.orderBeers,
        pirateName = orderRequest.pirateName,
        pirateContact = orderRequest.pirateContact,
        total = total,
        dateCreated = LocalDate.now(),
        dateCompleted = null,
        license = license.license,
        licenseType = license.type,
        notes = null)
        orderRepo.insert(order)
        return order
    }

    fun removeOrder(id: UUID) = orderRepo.deleteById(id)

    fun updateOrder(order: Order) = orderRepo.save(order)
}