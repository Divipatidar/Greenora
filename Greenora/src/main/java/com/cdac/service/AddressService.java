package com.cdac.service;

import com.cdac.dto.AddressDto;
import com.cdac.dto.ApiResponse;
import com.cdac.entities.Address;

public interface AddressService {
    Address addAddress(AddressDto dto);
    Address updateAddress(Long addressId, AddressDto dto);
    ApiResponse deleteAddress(Long addressId);
}
