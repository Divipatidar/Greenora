package com.cdac.service;

import com.cdac.dto.AddressDto;
import com.cdac.dto.ApiResponse;
import com.cdac.entities.Address;

public interface AddressService {
    Address addAddress(Long userId,AddressDto dto);
    Address updateAddress(Long addressId, AddressDto dto);
    ApiResponse deleteAddress(Long addressId);
    AddressDto getById(Long Id);
}
