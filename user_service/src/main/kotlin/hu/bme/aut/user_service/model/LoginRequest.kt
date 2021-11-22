package hu.bme.aut.user_service.model

import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

class LoginRequest (

    @field:NotNull
    val username: String,

    @field:NotNull
    val password: String
) {
}
