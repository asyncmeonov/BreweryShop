package com.tsarpirate.shop.configuration

import com.typesafe.config.ConfigFactory

object SecurityConstants {

    private val config = ConfigFactory.defaultApplication().withFallback(ConfigFactory.load("secure.conf"))

    val SECRET: String = config.getString("web.secret")
    val EXPIRATION_TIME: Long = config.getLong("web.expiration-time")
    const val TOKEN_PREFIX = "Bearer "
    const val HEADER_STRING = "Authorization"
}