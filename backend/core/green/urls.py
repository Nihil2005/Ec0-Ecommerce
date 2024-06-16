from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from green import bot

from . import views 



urlpatterns = [
    path('', views.Account.as_view(), name = 'accounts'),
    path('edit-details/', views.AccountChange.as_view(), name='edit-details'),
    path('login/', views.Login.as_view(),name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', views.Signup.as_view(), name='signup'),
    path('activate-account/', views.AccountActivationView.as_view(), name='account-activation'),
    path('password-change/', views.PasswordChangeView.as_view(), name='password-change'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password-reset/verify/', views.PasswordResetVerifyView.as_view(), name='password-reset-verify'),
    path('email-change/', views.EmailChangeView.as_view(), name='email-change'),
    path('email-change/verify/', views.EmailChangeVerifyView.as_view(), name='email-change-verify'),
    path('seller-profile/', views.SellerProfileView.as_view(), name='seller-profile'),
    path('productsxx/', views.ProductListAPIView.as_view(), name='product-list'),
    path('products/find', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('seller-profile/<int:profile_id>/', views.SellerProfileDetailView.as_view(), name='seller-profile-detail'),
    path('users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('images/', views.ImageView.as_view(), name='get_images'),
    path('profilex/', views.ProfileView.as_view(), name='profile'),
    path('profile/', views.profile, name='profile'),
    path('become-seller/', views.BecomeSellerView.as_view(), name='become_seller'),
    path('seller-registration/', views.SellerRegistrationView.as_view(), name='seller-registration'),
    path('categories/',views.CategoryViewSet.as_view({'get': 'list'})),
    path('products/<int:pk>/',views.ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),
    path('products/search/', views.product_search, name='product-search'),

    path('productsxy/<int:pk>/', views.ProductByIdAPIView.as_view(), name='product-detail'),
    path('user-products/', views.UserProductsAPIView.as_view(), name='user_products'),
    path('chatbot/', bot.chatbot_response, name='chatbot_response'),
    path('products/<int:product_id>/watched-count/', views.get_watched_count, name='watched_count'),
    path('userlogin/', views.LoginUser2.as_view(), name='login_user2'),
    path('usersignup/', views.SignupUser2.as_view(), name='signup_user2'),
   
    
  
  
]

urlpatterns = format_suffix_patterns(urlpatterns)