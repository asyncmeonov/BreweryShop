package com.tsarpirate.shop.repository

import com.tsarpirate.shop.model.Beer
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.UUID

interface BeerRepository : MongoRepository<Beer, UUID>