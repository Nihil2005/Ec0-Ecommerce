
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.forms import ValidationError
from django.utils.translation import gettext as _
from django.contrib.auth import authenticate
from rest_framework import serializers

from rest_framework import serializers
from django.contrib.auth import authenticate
from web3 import Web3

from green.models import Category, Order, Product, SellerProfile,Image,CustomUserProfile
from .models import CustomUserProfile, User2, User2Manager


web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name', 'whatsapp_number')


class ProfileChangeSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if user:
                if not user.email_confirmed:
                    raise serializers.ValidationError(_('Email not confirmed. Please activate your account.'))

                data['user'] = user
                return data
            else:
                raise serializers.ValidationError(_('Invalid email or password.'))
        else:
            raise serializers.ValidationError(_('Must include "email" and "password".'))




class SignupSerializer(serializers.ModelSerializer):
    id_proof = serializers.FileField(write_only=True, required=True)  # Add id_proof field

    class Meta:
        model = CustomUserProfile
        fields = ('email', 'password', 'first_name', 'last_name', 'whatsapp_number', 'username', 'id_proof')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True}  # Ensure username is required
        }

    def validate_id_proof(self, value):
        # You can add validation for the id_proof field if needed
        # For example, you can validate the file type or size
        if value.content_type not in ['image/jpeg', 'image/png']:
            raise ValidationError(_('Only JPEG and PNG files are allowed.'))
        return value

    def create(self, validated_data):
        id_proof = validated_data.pop('id_proof')
        user = CustomUserProfile.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            whatsapp_number=validated_data.get('whatsapp_number'),
            id_proof=id_proof,  # Add id_proof to user creation
            username=validated_data['username']
        )
        return user









class AccountActivationSerializer(serializers.Serializer):
    code = serializers.CharField()


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    

class PasswordResetVerifySerializer(serializers.Serializer):
    code = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'}, validators=[validate_password])


class EmailChangeSerializer(serializers.Serializer):
    email = serializers.EmailField()


class EmailChangeVerifySerializer(serializers.Serializer):
    code = serializers.CharField()
    new_email = serializers.EmailField()


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(write_only=True, validators=[validate_password], style={'input_type': 'password'})


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'first_name', 'last_name')





class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserProfile
        fields = ['id', 'email', 'first_name', 'last_name']  




class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = '__all__'





class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'



class ProductSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    seller_name = serializers.SerializerMethodField()
    seller_whatsapp = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'description', 'price', 'categories', 'seller_name', 'seller_whatsapp']
        read_only_fields = ['seller']

    def get_seller_name(self, obj):
        return obj.seller.get_full_name() or obj.seller.email

    def get_seller_whatsapp(self, obj):
        return obj.seller.whatsapp_number if obj.seller.whatsapp_number else "Not provided"

    def create(self, validated_data):
        try:
            product = super().create(validated_data)
            self.deploy_smart_contract(product)  # Deploy smart contract upon product creation
            return product
        except Exception as e:
            # Log or handle the exception appropriately
            print(f"Error creating product: {str(e)}")
            raise serializers.ValidationError("Failed to create product")

    def deploy_smart_contract(self, product):
        
        abi = [ 
            
                   
            
         ]
        bytecode = '0x6080604052348015600e575f80fd5b5060a580601a5f395ff3fe6080604052348015600e575f80fd5b50600436106030575f3560e01c806360fe47b11460345780636d4ce63c146045575b5f80fd5b6043603f3660046059565b5f55565b005b5f5460405190815260200160405180910390f35b5f602082840312156068575f80fd5b503591905056fea26469706673582212209e5ee881008053889e2864664a65d86fd93f982305ff6c3e966e160f5163a33d64736f6c63430008190033'
      
        try:
            contract = web3.eth.contract(abi=abi, bytecode=bytecode)
            tx_hash = contract.constructor().transact()
            tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
            product.smart_contract_address = tx_receipt.contractAddress
            product.save()
        except Exception as e:
            # Log or handle the exception appropriately
            print(f"Error deploying smart contract: {str(e)}")












class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'



class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('image_carosal',)



class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = '__all__'  # 


class SellerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['phone_number', 'store_name', 'description', 'adress'] 
        


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'






class User2SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User2
        fields = ('email', 'name', 'address', 'whatsapp_number')  # Include 'name' and 'address'

    def create(self, validated_data):
        user = User2.objects.create_user(
            email=validated_data['email'],
            name=validated_data.get('name'),
            address=validated_data.get('address'),
            whatsapp_number=validated_data.get('whatsapp_number'),
            password=None  # Since password is handled separately in User2 model
        )
        return user




class User2LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if user:
                if not user.email_confirmed:
                    raise serializers.ValidationError(_('Email not confirmed. Please activate your account.'))

                data['user'] = user
                return data
            else:
                raise serializers.ValidationError(_('Invalid email or password.'))
        else:
            raise serializers.ValidationError(_('Must include "email" and "password".'))
















class User2DetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()  # Assuming User2 is a custom user model
        fields = ('id', 'email', 'first_name', 'last_name')


class User2PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(write_only=True, validators=[validate_password], style={'input_type': 'password'})


class User2EmailChangeSerializer(serializers.Serializer):
    email = serializers.EmailField()


class User2EmailChangeVerifySerializer(serializers.Serializer):
    code = serializers.CharField()
    new_email = serializers.EmailField()


class User2PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()






new_product_data = {
    'name': 'Product Name',
    'description': 'Product Description',
    'price': 100.00,
    # Add other required fields...
}
serializer = ProductSerializer(data=new_product_data)
if serializer.is_valid():
    product = serializer.save()
    # Access the smart contract address associated with the product
    smart_contract_address = product.smart_contract_address
    print("Smart Contract Address:", smart_contract_address)
else:
    print("Error:", serializer.errors)