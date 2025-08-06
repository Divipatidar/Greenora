package com.cdac.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.AddressDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.AddressDto;
import com.cdac.dto.ApiResponse;
import com.cdac.entities.Address;
import com.cdac.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {
	private final ModelMapper modalmapper;
	private final AddressDao addressdao;
	private final UserDao userdao;

	

	@Override
	public Address addAddress(Long userId,AddressDto dto) {
		User user = userdao.findById(userId).orElseThrow(()
				->  new ResourseNotFoundException("user id not found!!!"));
		Address address = modalmapper.map(dto, Address.class);
		
		  user.setMyAddress(address);
		return addressdao.save(address);
		
	}

	@Override
	public Address updateAddress(Long addressId, AddressDto dto) {
		Address address = addressdao.findById(addressId).orElseThrow(()->
		new ResourseNotFoundException("invalid address id!"));
		
		modalmapper.map(dto, address);
		return address;
	}

	@Override
	public ApiResponse deleteAddress(Long addressId) {
		Address address = addressdao.findById(addressId).orElseThrow(()->
		new ResourseNotFoundException("invalid address id!"));
		
		addressdao.delete(address);
		return  new ApiResponse("address deleted!");
	}

	@Override
	public AddressDto getById(Long Id) {
		Address address = addressdao.findById(Id).orElseThrow(
				()-> new ResourseNotFoundException("id not found!!"));
		return modalmapper.map(address, AddressDto.class);
	}

	

}
