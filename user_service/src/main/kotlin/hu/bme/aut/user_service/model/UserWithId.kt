package hu.bme.aut.user_service.model

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User

class UserWithId(
    val id: Long,
    username: String,
    password: String,
    authorities: Collection<GrantedAuthority>
) : User(username, password, authorities)
