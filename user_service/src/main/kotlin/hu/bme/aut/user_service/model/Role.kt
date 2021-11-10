package hu.bme.aut.user_service.model

import javax.persistence.*

@Entity
@Table(name = "role")
class Role (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Long?,
    @Column(name = "name")
    var name: String
)
