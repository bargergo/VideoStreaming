package hu.bme.aut.user_service.model

import javax.validation.constraints.NotNull

class LoginRequest (

    @field:NotNull
    val username: String,

    @field:NotNull
    val password: String
) {
}
