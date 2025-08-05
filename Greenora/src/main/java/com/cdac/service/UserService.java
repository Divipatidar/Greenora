package com.cdac.service;

import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.entities.User;

public interface UserService {
	UserDto registerUser(SignUpReqDto dto);
    UserDto login(String email, String password); 
   User updateProfile(Long userId, UserDto dto);
 User getUserById(Long userId);
  
    
}
