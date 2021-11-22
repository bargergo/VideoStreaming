package hu.bme.aut.user_service.validation

import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@MustBeDocumented
@Constraint(validatedBy = [MinAmountOfDigitsValidator::class])
annotation class MinAmountOfDigits (
    val message: String = "The password must contain the specified amount of digits",
    val minAmount: Int = 1,
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
