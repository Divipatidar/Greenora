package com.cdac.service;

import java.util.List;

import com.cdac.dto.ApiResponse;
import com.cdac.dto.ProductDto;
import com.cdac.entities.Product;

public interface ProductService {
	Product addProduct(Long categoryID,ProductDto dto);
    Product updateProduct(Long id, ProductDto dto);
     ApiResponse deleteProduct(Long id);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategoryId(Long categoryId);
    List<Product> searchProducts(String productName);
}
