import hashlib
import json
import re
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext as _
from django.utils import timezone
from eth_utils import is_address as is_valid_ethereum_address
from web3 import HTTPProvider, Web3
from eth_account import Account

from random import randint


from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _












web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545/'))


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, whatsapp_number=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not whatsapp_number:
            raise ValueError('The WhatsApp number field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, whatsapp_number=whatsapp_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        user.generate_ethereum_address()
        
        user.save(using=self._db)
        return user
        
    
      
    def create_superuser(self, email, password=None, whatsapp_number=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, whatsapp_number, **extra_fields)

class CustomUserProfile(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email_confirmed = models.BooleanField(default=False, verbose_name=_('Email Confirmed'))
    email_verification_code = models.CharField(max_length=6, null=True, blank=True, verbose_name=_('Verification code'))
    whatsapp_number = models.CharField(max_length=20, verbose_name=_('WhatsApp Phone Number'))
    id_proof = models.FileField(upload_to='id_proof/')
    ethereum_address = models.CharField(max_length=42, blank=True, null=True, verbose_name=_('Ethereum Address'))

    objects = CustomUserManager()

    def generate_ethereum_address(self):
        # Generate Ethereum address
        new_address = Account.create().address
        self.ethereum_address = new_address
        self.save()

    def check_valid_ethereum_address(self):
        if not self.ethereum_address:
            return False
        return web3.isAddress(self.ethereum_address)



    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'whatsapp_number']

    def __str__(self):
        return self.email
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

class User2Manager(BaseUserManager):
    def create_user(self, email, password=None, whatsapp_number=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not whatsapp_number:
            raise ValueError('The WhatsApp number field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, whatsapp_number=whatsapp_number, **extra_fields)
        user.set_password(password)  # Set the password using set_password method
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, whatsapp_number=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, whatsapp_number, **extra_fields)

class User2(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    whatsapp_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = User2Manager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'address', 'whatsapp_number']

    def __str__(self):
        return self.email
















class AccountActivation(models.Model):
    user = models.OneToOneField(CustomUserProfile, on_delete=models.CASCADE, related_name='email_confirmation')
    activation_code = models.CharField(max_length=6, null=True, blank=True, verbose_name=_('Activation Code'))
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Creation Time'))

    def __str__(self):
        return f"Email Confirmation for {self.user.email}"

    def create_confirmation(self):
        code = str(randint(100000, 999999))  # Generate a random 6-digit code
        self.activation_code = code
        self.save()
        return code

    def verify_confirmation(self, code):
        if self.activation_code == code:
            self.user.email_confirmed = True
            self.user.save()
            self.delete()  # Remove the confirmation record
            return True

        # Invalid confirmation code
        return False


class SellerProfile(models.Model):
    user = models.OneToOneField(CustomUserProfile, on_delete=models.CASCADE, related_name='seller_profile')
    phone_number = models.CharField(max_length=20)
    store_name= models.CharField(max_length=255)
    description = models.TextField(blank=True)
    adress = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)


    # Add any other fields related to sellers

    def __str__(self):
        return f"Seller Profile - {self.user.email}"

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Product(models.Model):
    
    seller = models.ForeignKey(CustomUserProfile, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='product_images/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    categories = models.ManyToManyField(Category, related_name='products')
    watched_by = models.ManyToManyField(CustomUserProfile, related_name='watched_products', blank=True)
    
    smart_contract_address = models.CharField(max_length=42, blank=True, null=True, verbose_name=_('Smart Contract Address'))
    # Add any other fields related to products
    product_hash = models.CharField(max_length=64, blank=True, null=True)  # Store the generated hash
    
  
    
    def save(self, *args, **kwargs):
        if self.check_valid_ethereum_address(self.seller.ethereum_address):
            self.product_hash = self.generate_product_hash()
        super().save(*args, **kwargs)

    def generate_product_hash(self):
        combined_data = f"{self.seller.ethereum_address}{self.name}"
        product_hash = hashlib.sha256(combined_data.encode()).hexdigest()
        return product_hash

    def __str__(self):
        return self.name
    
    def deploy_smart_contract(self):
        # Check if the seller has a valid Ethereum address
        if self.check_valid_ethereum_address(self.seller.ethereum_address):
            try:
                # Load the compiled contract data
                with open('SimpleStorage.json', 'r') as compiled_file:
                    compiled_contract = json.load(compiled_file)
                    bytecode = compiled_contract['bytecode']
                    abi = compiled_contract['abi']
                
                # Connect to the Ethereum node
                web3 = Web3(HTTPProvider('http://127.0.0.1:7545/'))
                
                # Deploy the contract
                contract = web3.eth.contract(abi=abi, bytecode=bytecode)
                tx_hash = contract.constructor().transact({'from': self.seller.ethereum_address})
                
                # Wait for the transaction receipt
                tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
                
                # Save the deployed contract address to your Product model
                self.smart_contract_address = tx_receipt.contractAddress
                self.save()
                
                return True, "Smart contract deployed successfully."
            except Exception as e:
                return False, f"Error deploying smart contract: {str(e)}"
        else:
            return False, "Invalid Ethereum address for seller."

    def check_valid_ethereum_address(self, address):
        ethereum_address_pattern = re.compile("^0x[a-fA-F0-9]{40}$")
        return bool(ethereum_address_pattern.match(address))

  





class Order(models.Model):
    user = models.ForeignKey(CustomUserProfile, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Order for {self.product.name} by {self.user.email}"
    


class Image(models.Model):
    image_carosal = models.ImageField(upload_to='image_carosal/')

    def __str__(self):
        return str(self.image_carosal) 