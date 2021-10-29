package hu.bme.aut.user_service.controllers

import hu.bme.aut.user_service.services.HelloWorldService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController("api/user-service")
class AppController(
    val helloWorldService: HelloWorldService
) {

    @GetMapping("/hello")
    fun helloWorld(): String {
        return helloWorldService.helloWorld()
    }


    @PostMapping("/helloworldpost")
    fun helloWorldPost(): String {
        return "Hello World"
    }
}
