package com.cdac.service;

import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.dto.UserUpdateDto;
import com.cdac.dto.VendorDto;
import com.cdac.entities.User;

public interface UserService {
	UserDto registerUser(SignUpReqDto dto);
    UserDto login(String email, String password); 
   User updateProfile(Long userId, UserUpdateDto dto);
 User getUserById(Long userId);
 VendorDto addVendor(VendorDto dto); 
    
}
