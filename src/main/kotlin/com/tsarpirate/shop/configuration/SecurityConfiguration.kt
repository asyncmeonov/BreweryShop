package com.tsarpirate.shop.configuration

import com.tsarpirate.shop.filter.JwtAuthenticationFilter
import com.tsarpirate.shop.filter.JwtAuthorizationFilter
import com.tsarpirate.shop.service.LicenseService
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.context.annotation.Bean

import org.springframework.web.cors.CorsConfiguration

import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val licenseDetailsService: LicenseService,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder?
) : WebSecurityConfigurerAdapter() {


    override fun configure(http: HttpSecurity) {
        http.cors().and().csrf().disable().authorizeRequests()
            .anyRequest().authenticated()
            .and()
            .addFilter(JwtAuthenticationFilter(authenticationManager()))
            .addFilter(JwtAuthorizationFilter(authenticationManager())) // this disables session creation on Spring Security
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    }

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(licenseDetailsService).passwordEncoder(bCryptPasswordEncoder)
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource? {
        val source = UrlBasedCorsConfigurationSource()
        val corsConfiguration = CorsConfiguration().applyPermitDefaultValues()
        corsConfiguration.addAllowedMethod("DELETE")
        corsConfiguration.addAllowedMethod("PUT")
        source.registerCorsConfiguration("/**", corsConfiguration)
        return source
    }
}