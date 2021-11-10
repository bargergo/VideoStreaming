package hu.bme.aut.user_service

import hu.bme.aut.user_service.dao.RoleRepository
import hu.bme.aut.user_service.model.Role
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.stereotype.Component
import javax.transaction.Transactional


@Component
class SetupDataLoader(
    private val roleRepository: RoleRepository
) : ApplicationListener<ContextRefreshedEvent> {

    var alreadySetup = false

    @Transactional
    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        if (alreadySetup)
            return

        createRoleIfNotFound("ROLE_ADMIN")
        createRoleIfNotFound("ROLE_USER")

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
}
