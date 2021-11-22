package hu.bme.aut.user_service.validation

import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import kotlin.properties.Delegates

class MinAmountOfLowercaseLettersValidator : ConstraintValidator<MinAmountOfLowercaseLetters, String> {

    private var expectedAmount: Int by Delegates.notNull<Int>()

    override fun initialize(requiredIfChecked: MinAmountOfLowercaseLetters) {
        expectedAmount = requiredIfChecked.minAmount
    }

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return false
        var occurrences = 0
        for (char: Char in value) {
            if (char.isLetter() && char.isLowerCase()) {
                ++occurrences
            }
        }
        return expectedAmount <= occurrences
    }
}
