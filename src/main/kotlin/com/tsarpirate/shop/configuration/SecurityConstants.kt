package com.tsarpirate.shop.configuration

object SecurityConstants {
    const val SECRET = "SECRET_KEY" //TODO change
    const val EXPIRATION_TIME: Long = 900000 // 15 mins
    const val TOKEN_PREFIX = "Bearer "
    const val HEADER_STRING = "Authorization"
    const val SIGN_UP_URL = "/api/services/controller/user" //TODO change where we create licenses
}