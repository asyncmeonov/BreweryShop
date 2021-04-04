package com.tsarpirate.shop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@SpringBootApplication
class ShopApplication

fun main(args: Array<String>) {
	runApplication<ShopApplication>(*args)
}
