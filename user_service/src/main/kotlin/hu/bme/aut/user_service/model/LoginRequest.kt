package hu.bme.aut.user_service.model

import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class LoginRequest (
    @field:NotNull
    @field:Size(min = 4, message = "The length of the username must be at least 4 characters")
    val username: String,
    @field:NotNull
    val password: String
)
