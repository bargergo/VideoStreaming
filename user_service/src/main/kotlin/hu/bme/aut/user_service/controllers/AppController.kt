package hu.bme.aut.user_service.controllers

import hu.bme.aut.user_service.model.ChangePasswordRequest
import hu.bme.aut.user_service.model.LoginRequest
import hu.bme.aut.user_service.model.LoginResponse
import hu.bme.aut.user_service.model.RegisterRequest
import hu.bme.aut.user_service.services.UserService
import hu.bme.aut.user_service.utils.JwtTokenUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.*
import org.springframework.validation.FieldError
import org.springframework.validation.ObjectError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.*
import java.security.Principal
import javax.validation.Valid


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
    fun createAuthenticationToken(@Valid @RequestBody authenticationRequest: LoginRequest): ResponseEntity<Any> {
        logger.info("createAuthenticationToken")
        authenticate(authenticationRequest.username, authenticationRequest.password)
        logger.info("authenticated")
        val userDetails = userDetailsService
            .findByUsername(authenticationRequest.username)
        val token = jwtTokenUtil.generateToken(userDetails)
        return ResponseEntity.ok(LoginResponse(token, userDetails.username, userDetails.roles.map { it.name }))
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
    fun saveUser(@Valid @RequestBody user: RegisterRequest): ResponseEntity<Any> {
        return ResponseEntity.ok(userDetailsService.save(user))
    }

    @PostMapping("/changePassword")
    fun changePassword(@Valid @RequestBody changePasswordRequest: ChangePasswordRequest, principal: Principal): ResponseEntity<Any> {
        logger.info("change password for user '${principal.name}")
        try {
            auth.authenticate(UsernamePasswordAuthenticationToken(principal.name, changePasswordRequest.currentPassword))
        } catch (e: BadCredentialsException) {
            logger.info("INVALID_CREDENTIALS")
            val errors = mapOf("currentPassword" to listOf("Wrong password"))
            return ResponseEntity.badRequest().body(mapOf("errors" to errors))
        }
        userDetailsService.changePassword(principal.name, changePasswordRequest.newPassword)
        logger.info("successfully changed password for user '${principal.name}")
        return ResponseEntity.ok().body(Unit)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(
        ex: MethodArgumentNotValidException
    ): Map<String, Map<String, List<String>>> {
        val errors: MutableMap<String, MutableList<String>> = HashMap()
        for (error: ObjectError in ex.bindingResult.allErrors) {
            if (error is FieldError) {
                val fieldName = error.field
                val errorMessage = error.getDefaultMessage()
                if (errors[fieldName] == null) {
                    errors[fieldName] = mutableListOf()
                }
                if (errorMessage != null) {
                    errors[fieldName]?.add(errorMessage)
                }
            } else {
                if (errors["classLevel"] == null) {
                    errors["classLevel"] = mutableListOf()
                }
                val errorMessage = error.defaultMessage
                if (errorMessage != null) {
                    errors["classLevel"]?.add(errorMessage)
                }
            }

        }
        return mapOf("errors" to errors)
    }
}
