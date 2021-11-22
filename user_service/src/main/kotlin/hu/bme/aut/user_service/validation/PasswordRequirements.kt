package hu.bme.aut.user_service.validation

import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@MustBeDocumented
@Constraint(validatedBy = [PasswordRequirementsValidator::class])
annotation class PasswordRequirements (
    val message: String = "The password must contain at least 1 digit, 1 uppercase letter and 1 lowercase letter",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
