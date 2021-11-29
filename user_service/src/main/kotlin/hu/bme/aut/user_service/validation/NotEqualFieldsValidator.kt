package hu.bme.aut.user_service.validation

import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import kotlin.reflect.full.memberProperties

class NotEqualFieldsValidator : ConstraintValidator<NotEqualFields, Any> {

    lateinit var baseField: String
    lateinit var matchField: String

    override fun initialize(constraint: NotEqualFields) {
        baseField = constraint.baseField
        matchField = constraint.matchField
    }

    override fun isValid(obj: Any, context: ConstraintValidatorContext?): Boolean {
        val baseFieldValue = getFieldValue(obj, baseField)
        val matchFieldValue = getFieldValue(obj, matchField)
        return baseFieldValue != matchFieldValue
    }

    private fun getFieldValue(obj: Any, fieldName: String): Any? {
        val passwordField = obj::class.memberProperties.find { it.name == fieldName }
        return passwordField?.call(obj)
    }
}
