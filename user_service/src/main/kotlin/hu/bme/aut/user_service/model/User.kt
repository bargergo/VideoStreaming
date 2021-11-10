package hu.bme.aut.user_service.model

import javax.persistence.*

@Entity
@Table(name = "user")
class User (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Long?,
    @Column(name = "username")
    var username: String,
    @Column(name = "password")
    var password: String,
    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
    @JoinTable(name = "users_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")])
    var roles: Collection<Role>
)
