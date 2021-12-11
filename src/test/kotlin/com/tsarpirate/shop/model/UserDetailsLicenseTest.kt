package com.tsarpirate.shop.model

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import java.time.LocalDate

internal class UserDetailsLicenseTest {

    @Test
    fun `get Non-emtpy autorities`() {
    }

    @Test
    fun `license expiry date is in the future`() {
        val license = License("non-expired","somepass","some_type", LocalDate.now().plusDays(1))
        val user = UserDetailsLicense(license)
        assertTrue(user.isAccountNonExpired)
    }

    @Test
    fun `license expiry date is today`() {
        val license = License("today","somepass","some_type", LocalDate.now())
        val user = UserDetailsLicense(license)
        assertTrue(user.isAccountNonExpired)
    }

    @Test
    fun `license expiry date is in the past`() {
        val license = License("expired","somepass","some_type", LocalDate.now().minusDays(1))
        val user = UserDetailsLicense(license)
        assertFalse(user.isAccountNonExpired)
    }

    @Test
    fun `license should never expire`() {
        val license = License("non-expired","somepass","some_type", null)
        val user = UserDetailsLicense(license)
        assertTrue(user.isAccountNonExpired)
    }
}