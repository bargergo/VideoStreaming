package hu.bme.aut.user_service.dao

import hu.bme.aut.user_service.model.DAOUser
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserDao : CrudRepository<DAOUser, Long> {
    fun findByUsername(username: String): DAOUser?
}
