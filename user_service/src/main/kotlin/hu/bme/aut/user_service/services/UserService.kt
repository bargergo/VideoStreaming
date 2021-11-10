package hu.bme.aut.user_service.services

import hu.bme.aut.user_service.dao.RoleRepository
import hu.bme.aut.user_service.dao.UserRepository
import hu.bme.aut.user_service.exceptions.UserAlreadyExistAuthenticationException
import hu.bme.aut.user_service.extensions.toUserDTO
import hu.bme.aut.user_service.model.RegisterRequest
import hu.bme.aut.user_service.model.User
import hu.bme.aut.user_service.model.UserDTO
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service


@Service
class UserService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder
) : UserDetailsService {

    fun findByUsername(username: String): User {
        return userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
    }

    override fun loadUserByUsername(username: String): UserDetails {

        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
        return org.springframework.security.core.userdetails.User(user.username, user.password, user.roles.map { SimpleGrantedAuthority(it.name) })
    }

    fun save(param: RegisterRequest): UserDTO {
        val user = userRepository.findByUsername(param.username)
        if (user != null) {
            throw UserAlreadyExistAuthenticationException("User with username: ${param.username} already exists")
        }
        val role = roleRepository.findByName("ROLE_USER")
        val newUser = User(null, param.username, passwordEncoder.encode(param.password), mutableListOf(
            role!!
        ))
        return userRepository.save(newUser).toUserDTO()
    }
}
