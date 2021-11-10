package hu.bme.aut.user_service.configurations

import hu.bme.aut.user_service.services.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.password.PasswordEncoder
import javax.sql.DataSource


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class WebSecurityConfig(
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint,
    private val passwordEncoder: PasswordEncoder,
    private val userService: UserService
) : WebSecurityConfigurerAdapter() {

    /*@Autowired
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        // configure AuthenticationManager so that it knows from where to load
        // user for matching credentials
        // Use BCryptPasswordEncoder
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder)
    }*/

    override fun configure(auth: AuthenticationManagerBuilder?) {
        requireNotNull(auth)
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder);
    }

    /*@Bean
    fun authenticationProvider(): DaoAuthenticationProvider {
        val auth = DaoAuthenticationProvider()
        auth.setUserDetailsService(userService)
        auth.setPasswordEncoder(passwordEncoder)
        return auth
    }*/

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager? {
        return super.authenticationManagerBean()
    }

    override fun configure(httpSecurity: HttpSecurity?) {
        requireNotNull(httpSecurity)
        // We don't need CSRF for this example
        httpSecurity.csrf().disable()
            // dont authenticate this particular request
            .authorizeRequests().antMatchers("/api/user-service/login", "/api/user-service/register").permitAll().
            // all other requests need to be authenticated
            anyRequest().authenticated().and().
            // make sure we use stateless session; session won't be used to
            // store user's state.
            exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        // Add a filter to validate the tokens with every request
        // httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
    }
}
