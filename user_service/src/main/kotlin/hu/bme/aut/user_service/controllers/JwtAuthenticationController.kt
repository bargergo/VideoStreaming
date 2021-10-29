package hu.bme.aut.user_service.controllers

import hu.bme.aut.user_service.model.JwtRequest
import hu.bme.aut.user_service.model.JwtResponse
import hu.bme.aut.user_service.model.UserDTO
import hu.bme.aut.user_service.services.JwtUserDetailsService
import hu.bme.aut.user_service.utils.JwtTokenUtil
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.*


@RestController
class JwtAuthenticationController(
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil,
    private val userDetailsService: JwtUserDetailsService
) {

    @PostMapping("/authenticate")
    fun createAuthenticationToken(@RequestBody authenticationRequest: JwtRequest): ResponseEntity<Any> {
        authenticate(authenticationRequest.username, authenticationRequest.password)
        val userDetails = userDetailsService
            .loadUserByUsername(authenticationRequest.username)
        val token = jwtTokenUtil.generateToken(userDetails)
        return ResponseEntity.ok(JwtResponse(token))
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
    fun saveUser(@RequestBody user: UserDTO): ResponseEntity<Any> {
        return ResponseEntity.ok(userDetailsService.save(user))
    }
}
