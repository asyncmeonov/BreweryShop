package com.tsarpirate.shop.controller

import com.tsarpirate.shop.service.LicenseService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class LoginController(val licenseService: LicenseService) {

    @PostMapping("/login/{license}")
    fun login(@PathVariable(name = "license") license: String): Boolean {
        //TODO actual login
        return licenseService.getLicenseByValue(license) != null
    }
}