package com.tsarpirate.shop.configuration

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import java.lang.IllegalArgumentException

object SecurityConstants {

    private val activeProfile = System.getProperty("spring.profiles.active", "dev")

    val config = loadConfig()

    val DB_NAME: String = config.getString("db.name")
    val CONNECTION_STR: String = config.getString("db.connection-string")
    val SECRET: String = config.getString("web.secret")
    val EXPIRATION_TIME: Long = config.getLong("web.expiration-time")
    const val TOKEN_PREFIX = "Bearer "
    const val HEADER_STRING = "Authorization"


    //The secure configurations are not committed to source control.
    private fun loadConfig(): Config {
        val backup = when (activeProfile) {
            "dev" -> "secure_dev.conf"
            "prod" -> "secure_prod.conf"
            else -> throw IllegalArgumentException("Spring active profile set to $activeProfile which is not supported.")
        }
        return ConfigFactory.defaultApplication().withFallback(ConfigFactory.load(backup))
    }
}