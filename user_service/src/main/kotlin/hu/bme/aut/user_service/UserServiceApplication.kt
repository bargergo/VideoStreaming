package hu.bme.aut.user_service

import org.springframework.beans.factory.config.BeanFactoryPostProcessor
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.jdbc.support.DatabaseStartupValidator
import javax.persistence.EntityManagerFactory
import javax.sql.DataSource


@SpringBootApplication
class UserServiceApplication {

	@Bean
	fun databaseStartupValidator(dataSource: DataSource): DatabaseStartupValidator? {
		val dsv = DatabaseStartupValidator()
		dsv.setDataSource(dataSource)
		dsv.setInterval(5)
		dsv.setTimeout(120)
		return dsv
	}

	@Bean
	fun dependsOnPostProcessor(): BeanFactoryPostProcessor? {
		return BeanFactoryPostProcessor { bf: ConfigurableListableBeanFactory ->
			// Let beans that need the database depend on the DatabaseStartupValidator
			val jpa = bf.getBeanNamesForType(EntityManagerFactory::class.java)
			jpa.map { bf.getBeanDefinition(it) }
				.forEach { it.setDependsOn("databaseStartupValidator") }

		}
	}

}

fun main(args: Array<String>) {
	runApplication<UserServiceApplication>(*args)
}


