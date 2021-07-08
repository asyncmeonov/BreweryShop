package com.tsarpirate.shop.repository

import com.tsarpirate.shop.model.Delivery
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.UUID

interface DeliveryRepository : MongoRepository<Delivery, UUID>