package hu.bme.aut.user_service.model

import hu.bme.aut.user_service.validation.MinAmountOfDigits
import hu.bme.aut.user_service.validation.MinAmountOfLowercaseLetters
import hu.bme.aut.user_service.validation.MinAmountOfUppercaseLetters
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

class RegisterRequest(
    username: String,

    @field:NotNull
    @field:Size(min = 8, message = "The length of the password must be at least 8 characters")
    @field:MinAmountOfDigits(minAmount = 1, message = "The password must contain at least 1 digit")
    @field:MinAmountOfLowercaseLetters(minAmount = 1, message = "The password must contain at least 1 lowercase letter")
    @field:MinAmountOfUppercaseLetters(minAmount = 1, message = "The password must contain at least 1 uppercase letter")
    val password: String
) {
    @field:NotNull
    @field:Size(min = 4, message = "The length of the username must be at least 4 characters")
    val username: String = username.trim()
}
