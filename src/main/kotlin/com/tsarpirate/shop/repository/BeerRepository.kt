package com.tsarpirate.shop.repository

import com.tsarpirate.shop.model.Beer
import org.springframework.data.mongodb.repository.MongoRepository

interface BeerRepository : MongoRepository<Beer, String>