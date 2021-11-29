package hu.bme.aut.user_service

import hu.bme.aut.user_service.dao.RoleRepository
import hu.bme.aut.user_service.dao.UserRepository
import hu.bme.aut.user_service.model.Role
import hu.bme.aut.user_service.model.User
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import javax.transaction.Transactional


@Component
class SetupDataLoader(
    private val roleRepository: RoleRepository,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : ApplicationListener<ContextRefreshedEvent> {

    var alreadySetup = false

    @Transactional
    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        if (alreadySetup)
            return

        val adminRole = createRoleIfNotFound("ROLE_ADMIN")
        val userRole = createRoleIfNotFound("ROLE_USER")
        createAdminUserIfNotFound(adminRole, userRole)

        alreadySetup = true
    }

    @Transactional
    fun createRoleIfNotFound(name: String): Role {
        var role: Role? = roleRepository.findByName(name)
        if (role == null) {
            role = Role(null, name)
            roleRepository.save(role)
        }
        return role
    }

    @Transactional
    fun createAdminUserIfNotFound(vararg roles: Role): User {
        var user: User? = userRepository.findByUsername("admin")
        if (user == null) {
            user = User(null, "admin", passwordEncoder.encode("admin"), mutableListOf(
                *roles
            ))
            userRepository.save(user)
        }
        return user
    }
}
