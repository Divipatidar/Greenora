package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.AuthResponse;
import com.cdac.dto.SignInDto;
import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.entities.User;
import com.cdac.security.JwtUtils;
import com.cdac.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
@Validated
@CrossOrigin("http://localhost:5173")

public class UserContoller {
   private final UserService userservice;
   private final AuthenticationManager manager;
   private final JwtUtils utils;
   
   
   ///signup
   @PostMapping("/signup")
   public ResponseEntity<?> registerUser(@RequestBody  @Valid SignUpReqDto dto ){
	   UserDto user = userservice.registerUser(dto);
	   System.out.println("in sigup "+dto);
	   return ResponseEntity.status(HttpStatus.CREATED).body(user);
   }
   
   //login
   @PostMapping("/login")
   public ResponseEntity<?> userLogin(@RequestBody  @Valid SignInDto dto){
	   
	   
	   Authentication authtoken = new UsernamePasswordAuthenticationToken
			   (dto.getEmail(), dto.getPassword());
	   
	   System.out.println("before "+authtoken.isAuthenticated());//false;
	   
	   Authentication validauth=manager.authenticate(authtoken); 
	   
	   //success
	   System.out.println("after "+validauth .isAuthenticated());//true;
	   UserDto user = userservice.login(dto.getEmail(),dto.getPassword());

	   System.out.println(validauth);

	   
	   
//	    User user = userservice.login(dto.getEmail(), dto.getPassword());
//	    System.out.println("in login "+dto);
//		   return ResponseEntity.ok(user);
	   return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse("successful login!!",
			   utils.generateJwtToken(validauth),user));
   }
   
   
   //update profile
   @PutMapping("/{userId}")
   public ResponseEntity<?> updateUser(@PathVariable Long userId ,
		   @RequestBody UserDto dto ){
	   User user = userservice.updateProfile(userId, dto);
	   return ResponseEntity.ok(user);
   }
   
   @GetMapping("/{userId}")
   public ResponseEntity<?> getUserById(@PathVariable Long userId){
	   User user = userservice.getUserById(userId);
	   System.out.println("in get by id "+user);
	   return ResponseEntity.ok(user);

   }
   
}
