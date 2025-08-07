package com.cdac.service;

import java.util.List;

import com.cdac.dto.ApiResponse;
import com.cdac.dto.SignInDto;
import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.dto.UserUpdateDto;
import com.cdac.dto.VendorDto;
import com.cdac.entities.User;
import com.cdac.entities.UserRole;

public interface UserService {
	UserDto registerUser(SignUpReqDto dto);
    UserDto login(String email, String password); 
   User updateProfile(Long userId, UserUpdateDto dto);
 User getUserById(Long userId);
 VendorDto addVendor(VendorDto dto);
 
    ApiResponse forgetPass(SignInDto dto);
    List<UserRoleDto> getUserByRole(String role);
    
}
