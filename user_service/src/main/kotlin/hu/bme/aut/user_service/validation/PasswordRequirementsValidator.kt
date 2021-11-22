package hu.bme.aut.user_service.validation

import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

class PasswordRequirementsValidator : ConstraintValidator<PasswordRequirements, String> {
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return false
        return value.contains(Regex("[0-9]")) && value.contains(Regex("[a-z]")) && value.contains(Regex("[A-Z]"))
    }
}
