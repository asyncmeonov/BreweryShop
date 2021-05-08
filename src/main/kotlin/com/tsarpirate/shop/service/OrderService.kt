package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.Order
import com.tsarpirate.shop.repository.OrderRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class OrderService(private val orderRepo: OrderRepository) {

    fun getOrders(): List<Order> = orderRepo.findAll()

    fun getOrder(id:UUID): Order? = orderRepo.findById(id).orElseGet(null)

    fun addOrder(order: Order) = orderRepo.insert(order)

    fun removeOrder(id: UUID) = orderRepo.deleteById(id)

    fun updateOrder(order: Order) = orderRepo.save(order)
}