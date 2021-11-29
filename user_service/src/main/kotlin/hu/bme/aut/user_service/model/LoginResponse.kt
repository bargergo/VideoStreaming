package hu.bme.aut.user_service.model

data class LoginResponse(
    val token: String,
    val username: String,
    val roles: List<String>
)
