package hu.bme.aut.user_service.services

import hu.bme.aut.user_service.dao.UserDao
import hu.bme.aut.user_service.model.DAOUser
import hu.bme.aut.user_service.model.UserDTO
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

    override fun loadUserByUsername(username: String?): UserDetails {
        requireNotNull(username)

        val user = userDao.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
        return User(
            user.username, user.password,
            ArrayList()
        )
    }

    fun save(user: UserDTO): DAOUser {
        val newUser = DAOUser(null, user.username, bcryptEncoder.encode(user.password))
        return userDao.save(newUser)
    }
}
