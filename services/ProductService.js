app.factory('ProductService', ['$http', function ($http) {
    const endpoint = 'http://localhost:3009/api/';

    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    return {
        getProductById: function (productId) {
            return $http.get(`${endpoint}product/find/${productId}`, { headers });
        },
        getRelatedProducts: function (productId) {
            return $http.get(`${endpoint}product/related?productId=${productId}`, { headers });
        },
        getProductsByTag: function (tag) {
            return $http.get(`${endpoint}product?tag=${tag}`, { headers });
        },
        addProduct: function (productData) {
            return $http.post(`${endpoint}product/add`, productData, { headers });
        },
        getPurchasedProducts: function () {
            return $http.get(`${endpoint}purchased-products`, { headers });
        },
        updateProduct: function (productId, productData) {
            return $http.put(`${endpoint}product/update/${productId}`, productData, { headers });
        },
        deleteProduct: function (productId) {
            return $http.delete(`${endpoint}product/delete/${productId}`, { headers });
        }
    };
}]);
