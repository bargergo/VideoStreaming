package hu.bme.aut.user_service.validation

import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [NotEqualFieldsValidator::class])
annotation class NotEqualFields(
    val baseField: String,
    val matchField: String,
    val message: String = "The two fields must not be equal",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)
