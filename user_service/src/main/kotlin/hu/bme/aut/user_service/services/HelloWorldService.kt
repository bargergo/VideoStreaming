package hu.bme.aut.user_service.services

import org.springframework.core.env.Environment
import org.springframework.stereotype.Service

@Service
class HelloWorldService(
    private val env: Environment
) {

    fun helloWorld(): String {
        return "Hello World: ${env.getRequiredProperty("jwt.secret")}"
    }
}
