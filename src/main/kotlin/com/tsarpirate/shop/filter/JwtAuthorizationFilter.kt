package com.tsarpirate.shop.filter

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.tsarpirate.shop.configuration.SecurityConstants.HEADER_STRING
import com.tsarpirate.shop.configuration.SecurityConstants.SECRET
import com.tsarpirate.shop.configuration.SecurityConstants.TOKEN_PREFIX
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthorizationFilter(authManager: AuthenticationManager): BasicAuthenticationFilter(authManager) {

    override fun doFilterInternal(
        req: HttpServletRequest,
        res: HttpServletResponse,
        chain: FilterChain
    ) {
        val header = req.getHeader(HEADER_STRING)

        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res)
            return
        }

        val authentication = getAuthentication(req)

        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(req, res)
    }

    // Reads the JWT from the Authorization header, and then uses JWT to validate the token
    private fun getAuthentication(request: HttpServletRequest): UsernamePasswordAuthenticationToken? {
        val token = request.getHeader(HEADER_STRING)

        if (token != null) {
            // parse the token.
            val user = JWT.require(Algorithm.HMAC512(SECRET.toByteArray()))
                .build()
                .verify(token.replace(TOKEN_PREFIX, ""))

            if (user.subject != null) {
                val authority = SimpleGrantedAuthority(user.claims["type"].toString())
                return UsernamePasswordAuthenticationToken(user.subject, null, listOf(authority))
            }
            return null
        }
        return null
    }
}