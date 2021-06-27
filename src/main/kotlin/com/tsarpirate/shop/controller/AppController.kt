package com.tsarpirate.shop.controller

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

//Controller used to redirect base URI for
@Controller
class AppController {

    private val logger = LoggerFactory.getLogger(this::class.java)

    @RequestMapping("/")
    fun loadUI(): String? {
        logger.info("Loading UI...")
        return "forward:/index.html"
    }
}