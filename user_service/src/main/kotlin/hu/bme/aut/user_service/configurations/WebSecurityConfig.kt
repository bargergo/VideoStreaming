package hu.bme.aut.user_service.configurations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class WebSecurityConfig(
    private val jwtUserDetailsService: UserDetailsService,
    private val jwtRequestFilter: JwtRequestFilter,
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint,
    private val passwordEncoder: PasswordEncoder
) : WebSecurityConfigurerAdapter() {

    @Autowired
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        // configure AuthenticationManager so that it knows from where to load
        // user for matching credentials
        // Use BCryptPasswordEncoder
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder)
    }

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager? {
        return super.authenticationManagerBean()
    }

    override fun configure(httpSecurity: HttpSecurity?) {
        requireNotNull(httpSecurity)
        // We don't need CSRF for this example
        httpSecurity.csrf().disable()
            // dont authenticate this particular request
            .authorizeRequests().antMatchers("/authenticate", "/register").permitAll().
            // all other requests need to be authenticated
            anyRequest().authenticated().and().
            // make sure we use stateless session; session won't be used to
            // store user's state.
            exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        // Add a filter to validate the tokens with every request
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
    }
}
