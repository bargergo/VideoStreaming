package hu.bme.aut.user_service.controllers

import hu.bme.aut.user_service.model.LoginRequest
import hu.bme.aut.user_service.model.LoginResponse
import hu.bme.aut.user_service.model.RegisterRequest
import hu.bme.aut.user_service.services.UserService
import hu.bme.aut.user_service.utils.JwtTokenUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.*
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user-service")
class AppController(
    private val auth: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil,
    private val userDetailsService: UserService
) {
    var logger: Logger = LoggerFactory.getLogger(AppController::class.java)

    @GetMapping("/check")
    fun helloWorld(): ResponseEntity<String> {
        return ResponseEntity.ok("Ok")
    }

    @PostMapping("/login")
    fun createAuthenticationToken(@RequestBody authenticationRequest: LoginRequest): ResponseEntity<Any> {
        logger.info("createAuthenticationToken")
        authenticate(authenticationRequest.username, authenticationRequest.password)
        logger.info("authenticated")
        val userDetails = userDetailsService
            .findByUsername(authenticationRequest.username)
        val token = jwtTokenUtil.generateToken(userDetails)
        return ResponseEntity.ok(LoginResponse(token, userDetails.username))
    }

    private fun authenticate(username: String, password: String) {
        try {
            logger.info("before authenticate")
            auth.authenticate(UsernamePasswordAuthenticationToken(username, password))
            logger.info("after authenticate")
        } catch (e: DisabledException) {
            logger.info("USER_DISABLED")
            throw Exception("USER_DISABLED", e)
        } catch (e: LockedException) {
            logger.info("LOCKED")
            throw Exception("LOCKED", e)
        } catch (e: BadCredentialsException) {
            logger.info("INVALID_CREDENTIALS")
            throw Exception("INVALID_CREDENTIALS", e)
        }
    }

    @PostMapping("/register")
    fun saveUser(@RequestBody user: RegisterRequest): ResponseEntity<Any> {
        return ResponseEntity.ok(userDetailsService.save(user))
    }
}
