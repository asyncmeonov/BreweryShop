package com.tsarpirate.shop.filter

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import com.fasterxml.jackson.databind.ObjectMapper
import com.tsarpirate.shop.configuration.SecurityConstants.EXPIRATION_TIME
import com.tsarpirate.shop.configuration.SecurityConstants.SECRET
import com.tsarpirate.shop.model.UserDetailsLicense
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.util.*


class JwtAuthenticationFilter(private val authManager: AuthenticationManager) : UsernamePasswordAuthenticationFilter() {

    override fun attemptAuthentication(req: HttpServletRequest, res: HttpServletResponse): Authentication {
        return try {
            val creds = ObjectMapper().readValue(req.inputStream, String::class.java)
            val authToken = UsernamePasswordAuthenticationToken(creds, creds)
            authManager.authenticate(authToken)
        } catch (e: IOException) {
            throw RuntimeException(e)
        }
    }

    @Throws(IOException::class)
    override fun successfulAuthentication(
        req: HttpServletRequest?,
        res: HttpServletResponse,
        chain: FilterChain?,
        auth: Authentication
    ) {
        val user = auth.principal as UserDetailsLicense
        val token = JWT.create()
            .withSubject(user.username)
            .withClaim("type", user.authorities.first().authority)
            .withExpiresAt(Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .sign(Algorithm.HMAC512(SECRET.toByteArray()))
        val body: String = user.username + " " + token
        res.writer.write(body)
        res.writer.flush()
    }

    init {
        setFilterProcessesUrl("/login")
    }
}