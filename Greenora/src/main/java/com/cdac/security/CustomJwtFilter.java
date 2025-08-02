package com.cdac.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component // spring bean - can be injected as dependency
//in other spring beans
//OncePerRequestFilter -represents a filter which is 
//invoked once per every request
@Slf4j
@AllArgsConstructor
public class CustomJwtFilter extends OncePerRequestFilter {
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// 1. Check HTTP request header - "Authorization"
		String headerValue = request.getHeader("Authorization");
		if (headerValue != null && headerValue.startsWith("Bearer ")) {
			// => JWT exists
			// 2 . Extract JWT
			String jwt = headerValue.substring(7);
			log.info("JWT in request header {} ", jwt);
			/*
			 * 3 . Validate Token -> in case of success populate Authentication object . -
			 * call JwtUtils 's method
			 * 
			 */
			Authentication authentication = 
					jwtUtils.populateAuthenticationTokenFromJWT(jwt);
			// => no exc -> example invalid token ,invalid signature , jwt expired....
			log.info("auth object from JWT {} ", authentication);
			/*
			 * 4. Store authentication object - under Spring security 
			 * ctx holder - 
			 * scope :
			 * current request only (since Session creation policy - STATELESS)
			 */
			SecurityContextHolder
			.getContext() //rets current sec ctx
			.setAuthentication(authentication);

		}
		//allow the request to continue ....
		filterChain.doFilter(request, response);

	}

}
