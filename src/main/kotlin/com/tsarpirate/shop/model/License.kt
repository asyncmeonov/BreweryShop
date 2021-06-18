package com.tsarpirate.shop.model

import org.springframework.data.annotation.Id
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDate

data class License(@Id val license: String, val pass:String, val type: String, val expiryDate: LocalDate? = null)

class UserDetailsLicense(private val license: License) : UserDetails {

    private val user = User(license.license, license.pass, mapAuthorities(license))

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = user.authorities

    override fun getPassword(): String = user.password

    override fun getUsername(): String = user.username

    override fun isAccountNonExpired(): Boolean {
       return if (license.expiryDate == null) true else LocalDate.now().isBefore(license.expiryDate) //TODO test
    }

    override fun isAccountNonLocked(): Boolean = user.isAccountNonLocked

    override fun isCredentialsNonExpired(): Boolean = user.isCredentialsNonExpired

    override fun isEnabled(): Boolean = user.isEnabled

    private fun mapAuthorities(license: License): MutableSet<GrantedAuthority> {
        val authorityMapper = SimpleAuthorityMapper()
        return authorityMapper.mapAuthorities(listOf(SimpleGrantedAuthority(license.type)))
    }
}