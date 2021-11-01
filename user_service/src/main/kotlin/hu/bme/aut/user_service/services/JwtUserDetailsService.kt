package hu.bme.aut.user_service.services

import hu.bme.aut.user_service.dao.UserDao
import hu.bme.aut.user_service.exceptions.UserAlreadyExistAuthenticationException
import hu.bme.aut.user_service.model.DAOUser
import hu.bme.aut.user_service.model.RegisterRequest
import hu.bme.aut.user_service.model.UserWithId
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service


@Service
class JwtUserDetailsService(
    private val userDao: UserDao,
    private val bcryptEncoder: PasswordEncoder
): UserDetailsService {

    override fun loadUserByUsername(username: String?): UserWithId {
        requireNotNull(username)

        val user = userDao.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
        return UserWithId(
            user.id!!,
            user.username,
            user.password,
            ArrayList()
        )
    }

    fun save(param: RegisterRequest): DAOUser {
        val user = userDao.findByUsername(param.username)
        if (user != null) {
            throw UserAlreadyExistAuthenticationException("User with username: ${param.username} already exists")
        }
        val newUser = DAOUser(null, param.username, bcryptEncoder.encode(param.password))
        return userDao.save(newUser)
    }
}
