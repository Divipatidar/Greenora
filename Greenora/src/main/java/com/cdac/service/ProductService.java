package com.cdac.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.cdac.dto.ApiResponse;
import com.cdac.dto.ProductDto;
import com.cdac.entities.Product;

public interface ProductService {
	Product addProduct(Long categoryID,ProductDto dto) ;
    Product updateProduct(Long id, ProductDto dto) ;
     ApiResponse deleteProduct(Long id);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategoryId(Long categoryId);
    List<Product> searchProducts(String productName);
}
