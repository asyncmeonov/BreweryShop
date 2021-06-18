package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.License
import com.tsarpirate.shop.model.UserDetailsLicense
import com.tsarpirate.shop.repository.LicenseRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.expression.AccessException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.nio.ByteBuffer
import java.time.LocalDate
import java.util.*


@Service
class LicenseService(private val licenseRepo: LicenseRepository) : UserDetailsService {

    private val logger = LoggerFactory.getLogger(LicenseService::class.java)

    override fun loadUserByUsername(licenseCode: String): UserDetails? {
        val license = getLicenseByValue(licenseCode)
        return license?.let { UserDetailsLicense(it) }
    }

    fun getLicenses(): List<License> = licenseRepo.findAll()

    fun getLicenseByValue(license: String): License? = licenseRepo.findByIdOrNull(license)

    fun addLicense(type: String, expiryDate: LocalDate? = null, retries: Int = 3): String {
        if (retries == 0) {
            throw IllegalStateException("Could not generate $type license. Exceeded max retries.")
        }
        val licenseId = shortUUID()
        return if (getLicenseByValue(licenseId) != null) {
            logger.warn("$licenseId already exists! Retrying...")
            addLicense(type, expiryDate, retries - 1)
        } else {
            val encoder = BCryptPasswordEncoder()
            val license = License(licenseId, encoder.encode(licenseId), type, expiryDate)
            licenseRepo.insert(license)
            logger.info("Successfully created $license with type ${license.type}")
            license.toString()
        }
    }

    fun removeLicense(license: String) = getLicenseByValue(license)?.let { licenseRepo.delete(it) }


    //Generates 13 Character ID
    //Not guaranteed to be unique, but more human readable than the full UUID
    private fun shortUUID(): String {
        val uuid = UUID.randomUUID()
        val l: Long = ByteBuffer.wrap(uuid.toString().toByteArray()).long
        return l.toString(Character.MAX_RADIX)
    }
}
