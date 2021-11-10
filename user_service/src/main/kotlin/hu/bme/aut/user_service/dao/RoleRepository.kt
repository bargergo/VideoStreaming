package hu.bme.aut.user_service.dao

import hu.bme.aut.user_service.model.Role
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository : CrudRepository<Role, Long> {
    fun findByName(name: String): Role?
}
