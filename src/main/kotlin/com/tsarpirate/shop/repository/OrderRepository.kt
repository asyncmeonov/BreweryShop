package com.tsarpirate.shop.repository


import com.tsarpirate.shop.model.Order
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.UUID

interface OrderRepository: MongoRepository<Order, UUID>