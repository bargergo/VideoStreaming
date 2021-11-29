package hu.bme.aut.user_service.model

import hu.bme.aut.user_service.validation.*
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

@NotEqualFields("currentPassword", "newPassword", "The fields 'currentPassword' and 'newPassword' must not be equal.")
@EqualFields("newPasswordAgain", "newPassword", "The fields 'newPasswordAgain' and 'newPassword' must be equal.")
class ChangePasswordRequest (

    @field:NotNull
    val currentPassword: String,

    @field:NotNull
    @field:Size(min = 8, message = "The length of the password must be at least 8 characters")
    @field:MinAmountOfDigits(minAmount = 1, message = "The password must contain at least 1 digit")
    @field:MinAmountOfLowercaseLetters(minAmount = 1, message = "The password must contain at least 1 lowercase letter")
    @field:MinAmountOfUppercaseLetters(minAmount = 1, message = "The password must contain at least 1 uppercase letter")
    val newPassword: String,

    @field:NotNull
    val newPasswordAgain: String
)
