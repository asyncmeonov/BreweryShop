package com.tsarpirate.shop.service

import com.tsarpirate.shop.model.*
import com.tsarpirate.shop.repository.OrderRepository
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PrintWriter
import java.time.LocalDate
import java.util.UUID

@Service
class OrderService(private val orderRepo: OrderRepository) {

    fun getOrders(): List<Order> = orderRepo.findAll()

    fun getOrder(id: UUID): Order? = orderRepo.findByIdOrNull(id)

    fun addOrder(orderRequest: OrderRequest, beersAndAmount: List<Pair<Int, Beer>>, license: License): Order {

        val total = beersAndAmount.map { (amount, beer) ->
            amount to (beer.priceModels.find { it.licenseType == license.type }?.price ?: beer.defaultPrice)
        }.sumBy { (amount, price) -> amount * price }

        val order = Order(
            id = UUID.randomUUID(),
            orderBeers = orderRequest.orderBeers,
            pirateName = orderRequest.pirateName,
            pirateContact = orderRequest.pirateContact,
            total = total,
            dateCreated = LocalDate.now(),
            dateCompleted = null,
            license = license.license,
            licenseType = license.type,
            notes = null
        )
        orderRepo.insert(order)
        return order
    }

    fun removeOrder(id: UUID) = orderRepo.deleteById(id)

    fun updateOrder(order: Order) = orderRepo.save(order)

    fun getAsCsv(orderIds: List<UUID>): ByteArrayInputStream {
        //TODO test this especially the price conversion
        val orders = orderIds.map { getOrder(it) }

        if (orders.any { it == null }) throw IllegalArgumentException("One or more orders requested do not exist")

        orders as List<Order>

        val csvHeader = arrayOf(
            "order №", "name", "contact", "total", "notes", "beers ordered"
        )

        // replace this with your data retrieving logic
        val csvBody = ArrayList<List<String>>()

        orders.forEach { csvBody.add(listOf(
            it.id.toString(),
            it.pirateName,
            it.pirateContact,
            "%.2f".format(it.total.toFloat()/100),
            it.notes ?: "",
            it.orderBeers.joinToString("\n") { "${it.amount}x ${it.name} ${it.size}ml" }
        )) }

        return ByteArrayOutputStream()
            .use { out ->
                // defining the CSV printer
                CSVPrinter(
                    PrintWriter(out),
                    // withHeader is optional
                    CSVFormat.DEFAULT.withHeader(*csvHeader)
                )
                    .use { csvPrinter ->
                        // populating the CSV content
                        csvBody.forEach { record ->
                            csvPrinter.printRecord(record)
                        }

                        // writing the underlying stream
                        csvPrinter.flush()

                        ByteArrayInputStream(out.toByteArray())
                    }
            }

    }
}