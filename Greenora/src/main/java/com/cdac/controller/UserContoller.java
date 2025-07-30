package com.cdac.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.SignInDto;
import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.entities.User;
import com.cdac.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserContoller {
   private final UserService userservice;
   
   
   ///signup
   @PostMapping("/signup")
   public ResponseEntity<?> registerUser(@RequestBody SignUpReqDto dto ){
	   UserDto user = userservice.registerUser(dto);
	   System.out.println("in sigup "+dto);
	   return ResponseEntity.status(HttpStatus.CREATED).body(user);
   }
   
   //login
   @PostMapping("/login")
   public ResponseEntity<?> userLogin(@RequestBody SignInDto dto){
	    User user = userservice.login(dto.getEmail(), dto.getPassword());
	    System.out.println("in login "+dto);
		   return ResponseEntity.ok(user);
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
