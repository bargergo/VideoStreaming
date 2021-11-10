package hu.bme.aut.user_service.extensions

import hu.bme.aut.user_service.model.User
import hu.bme.aut.user_service.model.UserDTO

fun User.toUserDTO(): UserDTO {
    return UserDTO(
        this.id!!,
        this.username
    )
}
