package com.cdac.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.AllArgsConstructor;

import java.util.Arrays;

@Configuration // to declare config class - to declare spring beans - @Bean)
@EnableWebSecurity // to customize spring security
@EnableMethodSecurity // to enable method level annotations
//(@PreAuthorize , @PostAuthorize..) to specify  authorization rules
@AllArgsConstructor
public class SecurityConfiguration {
	//depcy - password encoder
	private final PasswordEncoder encoder;
	private final CustomJwtFilter customJwtFilter;
	private final  JwtAuthEntryPoint jwtAuthEntryPoint;

	// CORS Configuration Bean
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		
		// Allow your React frontend origin
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
		
		// Allow all HTTP methods
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
		
		// Allow all headers
		configuration.setAllowedHeaders(Arrays.asList("*"));
		
		// Allow credentials (important for JWT tokens)
		configuration.setAllowCredentials(true);
		
		// Expose Authorization header to frontend
		configuration.setExposedHeaders(Arrays.asList("Authorization"));
		
		// Apply CORS configuration to all paths
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		
		return source;
	}

/* configure spring bean to customize spring security filter chain
 * disable CSRF protection
 - session creation policy - stateless
 - disable form login based authentication
 - enable basic authentication scheme , for REST clients
 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		//1. Disable CSRF protection
		http.csrf(csrf -> csrf.disable());
		
		//2. Enable CORS with the configuration source
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		
		//3. Authenticate any request 
		http.authorizeHttpRequests(request -> 
		//5.permit all - swagger ,  user signin , sign up....
		request.requestMatchers("/swagger-ui/**","/v**/api-docs/**",
				"/users/login","/users/signup","/users/password").permitAll()
		// User endpoints
        .requestMatchers(HttpMethod.POST, "/users/signup").permitAll()
        .requestMatchers(HttpMethod.POST, "/users/login").permitAll()
        .requestMatchers(HttpMethod.GET, "/users/{userId}").hasAnyRole("USER", "ADMIN", "VENDOR") // Users can view their own profile
        .requestMatchers(HttpMethod.PUT, "/users/{userId}").hasAnyRole("USER", "ADMIN", "VENDOR") // Users can update their own profile
        
        // Address endpoints - Users can manage their own addresses
        .requestMatchers(HttpMethod.POST, "/address/{userId}").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.PUT, "/address/{addressId}").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/address/{addressId}").hasAnyRole("USER", "ADMIN")
        
        // Cart endpoints - Only USERs can manage cart
        .requestMatchers(HttpMethod.GET, "/cart/{userId}").hasAnyRole("USER", "ADMIN")
        .requestMatchers(HttpMethod.POST, "/cart/{userId}").hasRole("USER")
        .requestMatchers(HttpMethod.PUT, "/cart/{userId}").hasRole("USER")
        .requestMatchers(HttpMethod.DELETE, "/cart/{userId}/product/{productId}").hasRole("USER")
        .requestMatchers(HttpMethod.DELETE, "/cart/{userId}").hasRole("USER")
        
        // Order endpoints
        .requestMatchers(HttpMethod.POST, "/orders/user/{userId}/address/{addressId}/coupon/{couponId}").hasRole("USER")
        .requestMatchers(HttpMethod.GET, "/orders/user/{userId}").hasAnyRole("USER", "ADMIN") // Users can view their own orders
        .requestMatchers(HttpMethod.GET, "/orders/{orderId}").hasAnyRole("USER", "ADMIN", "VENDOR") // All roles can view order details
        
        // Category endpoints
        .requestMatchers(HttpMethod.GET, "/categories").permitAll() // Public - anyone can view categories
        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN") // Only admin can add categories
        .requestMatchers(HttpMethod.PUT, "/categories/{categoryId}").hasRole("ADMIN") // Only admin can update categories
        .requestMatchers(HttpMethod.DELETE, "/categories/{categoryId}").hasRole("ADMIN") // Only admin can delete categories
        
        // Coupon endpoints
        .requestMatchers(HttpMethod.POST, "/coupons").hasRole("ADMIN") // Only admin can create coupons
        .requestMatchers(HttpMethod.PUT, "/coupons/{id}").hasRole("ADMIN") // Only admin can update coupons
        .requestMatchers(HttpMethod.DELETE, "/coupons/{id}").hasRole("ADMIN") // Only admin can delete coupons
        .requestMatchers(HttpMethod.GET, "/coupons/validate").hasAnyRole("USER", "ADMIN") // USERs can validate coupons
        .requestMatchers(HttpMethod.GET, "/coupons/active").hasAnyRole("USER", "ADMIN") // USERs can view active coupons
        
        // Payment endpoints
        .requestMatchers(HttpMethod.POST, "/payment").hasRole("USER") // Only USERs can make payments
        .requestMatchers(HttpMethod.GET, "/payment/order/{orderId}").hasAnyRole("USER", "ADMIN", "VENDOR") // All can view payment details
        
        // Product endpoints
        .requestMatchers(HttpMethod.GET, "/products").permitAll() // Public - anyone can view all products
        .requestMatchers(HttpMethod.GET, "/products/{productId}").permitAll() // Public - anyone can view product details
        .requestMatchers(HttpMethod.GET, "/products/category/{categoryId}").permitAll() // Public - anyone can view products by category
        .requestMatchers(HttpMethod.GET, "/products/name/{productName}").permitAll() // Public - anyone can search products
        .requestMatchers(HttpMethod.POST, "/products/{categoryId}").hasAnyRole("ADMIN", "VENDOR") // Admin and vendors can add products
        .requestMatchers(HttpMethod.PUT, "/products/{productId}").hasAnyRole("ADMIN", "VENDOR") // Admin and vendors can update products
        .requestMatchers(HttpMethod.DELETE, "/products/{productId}").hasAnyRole("ADMIN", "VENDOR") // Admin and vendors can delete products
        
        // Any other request requires authentication
        .anyRequest().authenticated());
		
		
		
		//3. enable HTTP basic auth
	//	http.httpBasic(Customizer.withDefaults());
		//4. set session creation policy - stateless
		http.sessionManagement(session -> 
		session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		//5. add custom JWT filter before -UserNamePasswordAuthFilter 
		http.addFilterBefore(customJwtFilter
				, UsernamePasswordAuthenticationFilter.class);
		//6. Customize error code of SC 401 , in case of authentication failure
		http.exceptionHandling
		(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint));
		return http.build();
	}
	//configure a spring to return Spring security authentication manager
	@Bean
	AuthenticationManager authenticationManager
	(AuthenticationConfiguration mgr) throws Exception {
		return mgr.getAuthenticationManager();
	}
	
	
}