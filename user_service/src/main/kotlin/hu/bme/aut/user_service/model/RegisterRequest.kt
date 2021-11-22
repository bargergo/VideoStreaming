package hu.bme.aut.user_service.model

import hu.bme.aut.user_service.validation.PasswordRequirements
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

class RegisterRequest(
    username: String,

    @field:NotNull
    @field:Size(min = 8, message = "The length of the password must be at least 8 characters")
    @field:PasswordRequirements
    val password: String
) {
    @field:NotNull
    @field:Size(min = 4, message = "The length of the username must be at least 4 characters")
    val username: String = username.trim()
}
