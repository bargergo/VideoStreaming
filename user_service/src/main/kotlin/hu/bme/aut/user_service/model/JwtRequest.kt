package hu.bme.aut.user_service.model

data class JwtRequest(
    val username: String,
    val password: String
    )
