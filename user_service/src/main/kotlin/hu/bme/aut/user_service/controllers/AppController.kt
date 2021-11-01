package hu.bme.aut.user_service.controllers

import hu.bme.aut.user_service.model.LoginRequest
import hu.bme.aut.user_service.model.LoginResponse
import hu.bme.aut.user_service.model.RegisterRequest
import hu.bme.aut.user_service.services.JwtUserDetailsService
import hu.bme.aut.user_service.utils.JwtTokenUtil
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user-service")
class AppController(
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil,
    private val userDetailsService: JwtUserDetailsService
) {

    @GetMapping("/check")
    fun helloWorld(): ResponseEntity<String> {
        return ResponseEntity.ok("Ok")
    }

    @PostMapping("/login")
    fun createAuthenticationToken(@RequestBody authenticationRequest: LoginRequest): ResponseEntity<Any> {
        authenticate(authenticationRequest.username, authenticationRequest.password)
        val userDetails = userDetailsService
            .loadUserByUsername(authenticationRequest.username)
        val token = jwtTokenUtil.generateToken(userDetails)
        return ResponseEntity.ok(LoginResponse(token))
    }

    private fun authenticate(username: String, password: String) {
        try {
            authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
        } catch (e: DisabledException) {
            throw Exception("USER_DISABLED", e)
        } catch (e: BadCredentialsException) {
            throw Exception("INVALID_CREDENTIALS", e)
        }
    }

    @PostMapping("/register")
    fun saveUser(@RequestBody user: RegisterRequest): ResponseEntity<Any> {
        return ResponseEntity.ok(userDetailsService.save(user))
    }
}
