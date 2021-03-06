package hu.bme.aut.user_service.utils

import hu.bme.aut.user_service.model.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.springframework.core.env.Environment
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*


@Component
class JwtTokenUtil(
    private val env: Environment
) {
    private val secret = env.getRequiredProperty("jwt.secret")
    private val JWT_TOKEN_VALIDITY = 5 * 60 * 60
    private var logger: Log = LogFactory.getLog(javaClass)

    //retrieve username from jwt token
    fun getUsernameFromToken(token: String): String? {
        return getClaimFromToken(token) { obj: Claims -> obj.subject }
    }
    fun getRolesFromToken(token: String): List<String>? {
        val rolesClaim = getClaimFromToken(token) { obj: Claims -> obj["roles"] } as List<*>
        return rolesClaim.filterIsInstance<String>()
            .apply { if (size != rolesClaim.size) return null }
    }

    //retrieve expiration date from jwt token
    fun getExpirationDateFromToken(token: String): Date? {
        return getClaimFromToken(token) { obj: Claims -> obj.expiration }
    }

    fun <T> getClaimFromToken(token: String, claimsResolver: (Claims) -> T): T {
        val claims: Claims = getAllClaimsFromToken(token)
        return claimsResolver.invoke(claims)
    }

    //for retrieveing any information from token we will need the secret key
    private fun getAllClaimsFromToken(token: String): Claims {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).body
    }

    //check if the token has expired
    private fun isTokenExpired(token: String): Boolean {
        val expiration = getExpirationDateFromToken(token)
        return expiration?.before(Date()) ?: true
    }

    //generate token for user
    fun generateToken(userDetails: User): String {
        val claims: Map<String, Any> = mutableMapOf("userId" to userDetails.id!!, "roles" to userDetails.roles.map { it.name })
        return doGenerateToken(claims, userDetails.username)
    }

    //while creating the token -
    //1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    //2. Sign the JWT using the HS512 algorithm and secret key.
    //3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string
    private fun doGenerateToken(claims: Map<String, Any>, subject: String): String {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
            .signWith(SignatureAlgorithm.HS512, secret).compact()
    }

    private fun rolesMatch(roles: List<String>, authorities: List<String>): Boolean {
        for (role in roles) {
            if (!authorities.contains(role)) {
                return false
            }
        }
        return true
    }

    //validate token
    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        logger.info("Validate token")
        val username = getUsernameFromToken(token)
        val roles = getRolesFromToken(token)
        logger.info("Roles: $roles")
        requireNotNull(roles)
        val authorities = userDetails.authorities.map { it.authority }
        logger.info("Authorities: $roles")
        val result = username == userDetails.username && rolesMatch(roles, authorities) && !isTokenExpired(token)
        logger.info("The token is ${if (result) "valid" else "invalid"}")
        return result
    }
}
