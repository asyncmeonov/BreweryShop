package com.tsarpirate.shop.repository

import com.typesafe.config.ConfigFactory

object DatabaseConstants {


    private val config = ConfigFactory.defaultApplication().withFallback(ConfigFactory.load("secure.conf"))

    val DB_NAME: String = config.getString("db.name")
    val CONNECTION_STR: String = config.getString("db.connection-string")
}