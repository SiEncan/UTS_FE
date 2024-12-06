app.factory('ReviewService', ['$http', function ($http) {
    const endpoint = 'http://localhost:3009/api/';

    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    return {
        getUserReviews: function (productId) {
            return $http.get(`${endpoint}product/${productId}/reviews`, { headers });
        },
        addReview: function (productId, reviewData) {
            return $http.post(`${endpoint}product/${productId}/reviews`, reviewData, { headers });
        },
        updateReview: function (productId, reviewId, updatedReview) {
            return $http.put(`${endpoint}product/${productId}/reviews/${reviewId}`, updatedReview, { headers });
        },
        deleteReview: function (productId, reviewId) {
            return $http.delete(`${endpoint}product/${productId}/reviews/${reviewId}`, { headers });
        },
    };
}]);