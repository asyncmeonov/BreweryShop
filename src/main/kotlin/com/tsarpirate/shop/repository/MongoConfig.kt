package com.tsarpirate.shop.repository

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.bson.UuidRepresentation
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration
import java.util.*

@Configuration
class MongoConfig : AbstractMongoClientConfiguration() {

    //TODO offload these hardcoded params into config
    override fun getDatabaseName(): String = "tsarPirateBrewery"

    override fun mongoClient(): MongoClient {
        val connectionString = ConnectionString("mongodb://localhost:27017/tsarPirateBrewery")
        val mongoClientSettings: MongoClientSettings = MongoClientSettings.builder()
            .uuidRepresentation(UuidRepresentation.STANDARD)
            .applyConnectionString(connectionString)
            .build()

        return MongoClients.create(mongoClientSettings)
    }

    override fun getMappingBasePackages(): MutableSet<String> = Collections.singleton("com.tsarpirate")
}