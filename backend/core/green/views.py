import random
import string
from tkinter import Image
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail, EmailMultiAlternatives
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.translation import gettext as _
from django.contrib.auth import login, logout, get_user_model
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view,authentication_classes, permission_classes
from rest_framework import status,generics, permissions
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from .models import AccountActivation, Category, Order, Product, SellerProfile,Image
from .serializers import (CategorySerializer, ImageSerializer, OrderSerializer, ProductSerializer, ProfileSerializer, PasswordResetVerifySerializer,
                          EmailChangeSerializer, EmailChangeVerifySerializer,
                          PasswordChangeSerializer, PasswordResetSerializer,
                          ProfileChangeSerializer, LoginSerializer, SellerProfileSerializer, SellerRegistrationSerializer, 
                          SignupSerializer, AccountActivationSerializer, User2SignupSerializer, UserDetailSerializer)
from .serializers import SignupSerializer
from django.http import JsonResponse
class Account(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer

    def get(self, request, format=None):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

class AccountChange(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileChangeSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = request.user

            if 'first_name' in serializer.validated_data:
                user.first_name = serializer.validated_data['first_name']
            if 'last_name' in serializer.validated_data:
                user.last_name = serializer.validated_data['last_name']

            user.save()

            content = {'success': _('User information changed.')}
            return Response(content, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

class Login(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            token, created = Token.objects.get_or_create(user=user)

            if user is not None and user.email_confirmed:
                login(request, user)
                response_data = {
                    'user_id': user.id,
                    'token': token.key,  # Include token in response
                    'success': _('User authenticated.'),
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            elif user is not None and not user.email_confirmed:
                return Response({'error': _('Email not confirmed. Please activate your account.')}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({'error': _('Invalid email or password.')}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Signup(APIView):
    serializer_class = SignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            # Check if the email is already registered
            if get_user_model().objects.filter(email=email).exists():
                return Response({'error': _('Email is already registered.')}, status=status.HTTP_400_BAD_REQUEST)

            # Save the user first
            user = serializer.save()
            
            # Create a token for the user
            Token.objects.create(user=user)

            # Create email confirmation
            email_confirmation = AccountActivation(user=user)
            confirmation_code = email_confirmation.create_confirmation()

            # Send the account activation email with the activation code
            self.send_activation_email(user, confirmation_code)

            return Response({'success': _('User signed up successfully.')}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_activation_email(self, user, confirmation_code):
        subject = _('Activate Your Account')
        context = {'activation_code': confirmation_code}
        html_content = render_to_string('account_activation_email.html', context)

        # Create the email message with HTML content
        msg = EmailMultiAlternatives(subject, html_content, 'felizsas2k@gmail.com', [user.email])
        msg.attach_alternative(html_content, "text/html")  # Attach HTML content

        try:
            msg.send()
        except Exception as e:
            print(f"Failed to send activation email: {e}")



class AccountActivationView(APIView):
    serializer_class = AccountActivationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            activation_code = serializer.validated_data.get('code')  

            email_confirmation = AccountActivation.objects.filter(activation_code=activation_code).first()

            if email_confirmation:
                if email_confirmation.verify_confirmation(activation_code):
                    return Response({'success': _('Account Activated. Proceed To Log in')}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': _('Invalid confirmation code.')}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': _('Invalid confirmation code.')}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response({'success': 'User logged out successfully.'}, status=status.HTTP_200_OK)

# Generate a random 6-digit code
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

class PasswordResetView(APIView):
    serializer_class = PasswordResetSerializer
    
    def post(self, request, format=None):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                # Find the user with the provided email
                user = get_user_model().objects.get(email=email)
            except get_user_model().DoesNotExist:
                return Response({'error': _('User with this email does not exist.')}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a unique code for password reset
            code = generate_verification_code()

            # Attach the code to the user
            user.email_verification_code = code
            user.save()

            # Send the reset password email
            subject = _('Reset Your Password')
            html_message = render_to_string('reset_password_email.html', {'verification_code': code})
            plain_message = strip_tags(html_message)  # Strips HTML tags for plain text email
            from_email = 'Your Email'  
            to_email = [email]

            try:
                # Send the email
                msg = EmailMultiAlternatives(subject, plain_message, from_email, to_email)
                msg.attach_alternative(html_message, "text/html")
                msg.send()
            except Exception as e:
                # Handle email sending failure
                return Response({'error': _('Failed to send reset email.')}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'success': _('Verification code sent successfully.')}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetVerifyView(APIView):
    serializer_class = PasswordResetVerifySerializer
    
    def post(self, request, format=None):
        serializer = PasswordResetVerifySerializer(data=request.data)

        if serializer.is_valid():
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']

            # Find the user with the provided verification code
            try:
                user = get_user_model().objects.get(email_verification_code=code)
            except get_user_model().DoesNotExist:
                return Response({'error': _('Invalid verification code.')}, status=status.HTTP_400_BAD_REQUEST)

            # Set the new password and clear the verification code
            user.set_password(new_password)
            user.email_verification_code = None
            user.save()

            return Response({'success': _('Password reset successfully.')}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailChangeView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EmailChangeSerializer

    def send_email_change_confirmation(self, user):
        code = get_random_string(length=6)
        user.email_verification_code = code
        user.save()

        subject = 'Confirm Email Change'
        message = f'Your verification code is: {code}'
        from_email = 'felizsas2k@gmail.com'  
        to_email = user.email

        # Send the email
        send_mail(subject, message, from_email, [to_email], fail_silently=True)

    def post(self, request, format=None):
        serializer = EmailChangeSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            new_email = serializer.validated_data['email']

            # Verify that the provided email matches the logged-in user's email
            if new_email != user.email:
                raise PermissionDenied("Provided email doesn't match the logged-in user's email.")

            # Send the email change confirmation email with code
            self.send_email_change_confirmation(user)

            return Response({'success': 'Email change request sent successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailChangeVerifyView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EmailChangeVerifySerializer
    
    def post(self, request, format=None):
        serializer = EmailChangeVerifySerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            code = serializer.validated_data['code']
            new_email = serializer.validated_data['new_email']

            # Validate the code and update the email if valid
            if user.email_verification_code == code:
                user.email = new_email
                user.email_verification_code = None  # Clear the verification code
                user.save()
                return Response({'success': 'Email changed successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            # Check if the current password is correct
            if not user.check_password(old_password):
                return Response({'error': _('Current password is incorrect.')}, status=status.HTTP_400_BAD_REQUEST)

            # Set the new password and save the user
            user.set_password(new_password)
            user.save()

            # Optional: Invalidate existing authentication tokens if needed

            return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserDetailView(RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserDetailSerializer
    lookup_field = 'id'




class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = ProfileSerializer(user)
    return Response(serializer.data)














class SellerProfileDetailView(APIView):
    def get(self, request, profile_id):
        seller_profile = get_object_or_404(SellerProfile, id=profile_id)
        serializer = SellerProfileSerializer(seller_profile)
        return Response(serializer.data)







class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)





class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)  # Example: Filtering by product name
            # Add additional filtering logic as needed for other fields
        return queryset



class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow authenticated users to create products

class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  










        
class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductByIdAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')  # Get the product ID from URL parameters
        try:
            product = self.get_queryset().get(pk=product_id)
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)


class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product']
            product = Product.objects.get(pk=product_id)
            total_price = product.price * serializer.validated_data['quantity']
            serializer.save(user=request.user, total_price=total_price)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageView(APIView):
    def get(self, request):
        images = Image.objects.all()  # Make sure this line is correct
        serializer = ImageSerializer(images, many=True)
        return Response({'image_urls': serializer.data})
    

class BecomeSellerView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        try:
            # Check if the user is already a seller
            seller_profile = SellerProfile.objects.get(user=user)
            return Response({'error': 'User is already a seller.'}, status=status.HTTP_400_BAD_REQUEST)
        except SellerProfile.DoesNotExist:
            # Create a new SellerProfile for the user
            seller_profile = SellerProfile.objects.create(user=user)
            return Response({'success': 'User became a seller successfully.'}, status=status.HTTP_200_OK)
        


class SellerProfileView(APIView):
    def get(self, request):
        seller_profiles = SellerProfile.objects.all()
        serializer = SellerProfileSerializer(seller_profiles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SellerProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class SellerRegistrationView(APIView):
    def post(self, request):
        serializer = SellerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Save the serializer with the current user
            serializer.save(user=request.user)  # Assuming you have a user associated with the seller profile
            return Response({"message": "Seller registration successful."}, status=status.HTTP_201_CREATED)
        else:
            # If the data is invalid, return the validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer




def product_search(request):
    query = request.GET.get('q', '')
    if query:
        results = Product.objects.filter(name__icontains=query)
        serialized_results = [{'id': product.id, 'name': product.name} for product in results]
        return JsonResponse(serialized_results, safe=False)
    else:
        return JsonResponse([], safe=False)
    





class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]   # Add appropriate permissions

    # Optionally, you can override the delete method to add custom logic
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)
    


def get_watched_count(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        watched_count = product.watched_by.count()
        return JsonResponse({'watched_count': watched_count})
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)










class LoginUser2(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            token, created = Token.objects.get_or_create(user=user)

            if user is not None and user.email_confirmed:
                login(request, user)
                response_data = {
                    'user_id': user.id,
                    'token': token.key,  # Include token in response
                    'success': _('User authenticated.'),
                }

                return Response(response_data, status=status.HTTP_200_OK)
            elif user is not None and not user.email_confirmed:
                return Response({'error': _('Email not confirmed. Please activate your account.')},
                                status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({'error': _('Invalid email or password.')}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignupUser2(APIView):
    serializer_class =  User2SignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            # Check if the email is already registered
            if get_user_model().objects.filter(email=email).exists():
                return Response({'error': _('Email is already registered.')}, status=status.HTTP_400_BAD_REQUEST)

            # Save the user first
            user = serializer.save()

            # Create a token for the user
            Token.objects.create(user=user)

            # Create email confirmation
            email_confirmation = AccountActivation(user=user)
            confirmation_code = email_confirmation.create_confirmation()

            # Send the account activation email with the activation code
            self.send_activation_email(user, confirmation_code)

            return Response({'success': _('User signed up successfully.')}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_activation_email(self, user, confirmation_code):
        subject = _('Activate Your Account')
        context = {'activation_code': confirmation_code}
        html_content = render_to_string('account_activation_email.html', context)

        # Create the email message with HTML content
        msg = EmailMultiAlternatives(subject, html_content, 'felizsas2k@gmail.com', [user.email])
        msg.attach_alternative(html_content, "text/html")  # Attach HTML content

        try:
            msg.send()
        except Exception as e:
            print(f"Failed to send activation email: {e}")