package com.tsarpirate.shop.controller

import com.tsarpirate.shop.service.LicenseService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class LoginController(val licenseService: LicenseService) {

    private val logger = LoggerFactory.getLogger(javaClass)

    @PostMapping("/login")
    fun login(license: String): Boolean {
        logger.info("Got request for login by $license")
        return licenseService.getLicenseByValue(license) != null
    }
}