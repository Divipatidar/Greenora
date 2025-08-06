package com.cdac.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.InvalidInputException;
import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.UserDao;
import com.cdac.dto.SignUpReqDto;
import com.cdac.dto.UserDto;
import com.cdac.dto.UserUpdateDto;
import com.cdac.dto.VendorDto;
import com.cdac.entities.User;
import com.cdac.entities.UserRole;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserDao userdao;
	private final ModelMapper modalmapper;
	private final PasswordEncoder encoder;
     
	@Override
	public UserDto registerUser(SignUpReqDto dto) {
		 if(userdao.existsByEmail(dto.getEmail())) {
			 throw new InvalidInputException("user already exist by email!!!!");
		 }
		 dto.setRole(dto.getRole().toUpperCase());
	     
		 
		 User user = modalmapper.map(dto, User.class);
		 user.setPassword(encoder.encode(user.getPassword()));
		 User userpersitent = userdao.save(user);
		return  modalmapper.map(userpersitent, UserDto.class);
	}

	@Override
	public UserDto login(String email, String password) {
		User user = userdao.findByEmail(email).orElseThrow(()-> 
		new ResourseNotFoundException("emaill not found!!!"));
		UserDto dto = modalmapper.map(user,UserDto.class);
		if (user.getMyAddress()!=null)
		dto.setAddresId(user.getMyAddress().getId());
		return dto;
	}

	@Override
	public User updateProfile(Long userId, UserUpdateDto dto) {
		User user = userdao.findById(userId).orElseThrow(()-> 
		new ResourseNotFoundException("id not found!!!"));
		modalmapper.map(dto, user);
		if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
	        user.setPassword(encoder.encode(dto.getPassword()));
	    }
		return user;
	}

	@Override
	public User getUserById(Long userId) {
		User user = userdao.findById(userId).orElseThrow(()-> 
		new ResourseNotFoundException("id not found!!!"));
		return user;
	}

	@Override
	public VendorDto addVendor(VendorDto dto) {
		if(userdao.existsByEmail(dto.getEmail())) {
			 throw new InvalidInputException("user already exist by email!!!!");
		 }
	
             dto.setRole(UserRole.ROLE_VENDOR);
 	      dto.setPassword(encoder.encode(dto.getPassword()));
 		User user = modalmapper.map(dto, User.class);
 		 
		return modalmapper.map(userdao.save(user),VendorDto.class);
	}


}
