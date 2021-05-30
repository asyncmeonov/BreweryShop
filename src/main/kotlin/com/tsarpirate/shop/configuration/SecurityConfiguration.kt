package com.tsarpirate.shop.configuration

import com.tsarpirate.shop.configuration.SecurityConstants.SIGN_UP_URL
import com.tsarpirate.shop.filter.JwtAuthenticationFilter
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.context.annotation.Bean
import org.springframework.security.core.userdetails.UserDetailsService

import org.springframework.web.cors.CorsConfiguration
import com.tsarpirate.shop.filter.JwtAuthorizationFilter

import org.springframework.http.HttpMethod
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val licenseDetailsService: UserDetailsService,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder?
) : WebSecurityConfigurerAdapter() {


    override fun configure(http: HttpSecurity) {
        http.cors().and().authorizeRequests()
            .antMatchers(HttpMethod.POST, SIGN_UP_URL).permitAll()
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
        source.registerCorsConfiguration("/**", corsConfiguration)
        return source
    }
}