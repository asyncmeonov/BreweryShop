package com.tsarpirate.shop.repository

import com.tsarpirate.shop.model.License
import org.springframework.data.mongodb.repository.MongoRepository

interface LicenseRepository : MongoRepository<License, String>