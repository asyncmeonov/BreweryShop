package com.tsarpirate.shop.repository

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.tsarpirate.shop.configuration.SecurityConstants.CONNECTION_STR
import com.tsarpirate.shop.configuration.SecurityConstants.DB_NAME
import org.bson.UuidRepresentation
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration
import java.util.*

@Configuration
class MongoConfig : AbstractMongoClientConfiguration() {

    override fun getDatabaseName(): String = DB_NAME

    override fun mongoClient(): MongoClient {
        val connectionString = ConnectionString(CONNECTION_STR)
        val mongoClientSettings: MongoClientSettings = MongoClientSettings.builder()
            .uuidRepresentation(UuidRepresentation.STANDARD)
            .applyConnectionString(connectionString)
            .build()

        return MongoClients.create(mongoClientSettings)
    }

    override fun getMappingBasePackages(): MutableSet<String> = Collections.singleton("com.tsarpirate")
}