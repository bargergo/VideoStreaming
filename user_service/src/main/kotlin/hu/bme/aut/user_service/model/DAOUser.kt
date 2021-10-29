package hu.bme.aut.user_service.model

import com.fasterxml.jackson.annotation.JsonIgnore
import javax.persistence.*

@Entity
@Table(name="user")
class DAOUser(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @Column
    val username: String,
    @Column
    @JsonIgnore
    val password: String
)
