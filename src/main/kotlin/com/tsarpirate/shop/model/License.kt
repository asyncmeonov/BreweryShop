package com.tsarpirate.shop.model

import org.springframework.data.annotation.Id
import java.time.LocalDate

data class License(@Id val license: String, val type: String, val expiryDate: LocalDate? = null)