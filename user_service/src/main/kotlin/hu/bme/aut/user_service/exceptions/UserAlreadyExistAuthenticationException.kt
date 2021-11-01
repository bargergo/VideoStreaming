package hu.bme.aut.user_service.exceptions

import org.springframework.security.core.AuthenticationException

class UserAlreadyExistAuthenticationException(msg: String) : AuthenticationException(msg)
