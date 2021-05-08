package com.tsarpirate.shop.controller

import com.tsarpirate.shop.model.License
import com.tsarpirate.shop.service.LicenseService
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import javax.websocket.server.PathParam

@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
class LicenseController(val licenseService: LicenseService) {

    @GetMapping("/license")
    fun allLicenses(): List<License> {
        return licenseService.getLicenses()
    }

    @PostMapping("/license/{licenseType}")
    fun createLicense(
        @PathVariable("licenseType") licenseType: String,
        @PathParam("expires") expires: String? = null
    ): String {
        return try {
            val type = licenseType.toUpperCase()
            val dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy")
            val expiryDate = if (expires != null )LocalDate.parse(expires, dtf) else null
            licenseService.addLicense(type, expiryDate)
        } catch (ex: DateTimeParseException) {
            "Bad request, expiry date $expires does not follow \"dd-MM-yyyy\" format."
        }
    }

    @DeleteMapping("/license/{license}")
    fun deleteLicense(@PathVariable("license") license: String) {
        licenseService.removeLicense(license)
    }
}