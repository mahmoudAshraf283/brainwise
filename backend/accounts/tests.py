from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json
from accounts.serializers import UserSerializer

User = get_user_model()


class UserModelTest(TestCase):
    """Unit tests for User model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'employee'
        }
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password='testpass123'
        )
        self.assertEqual(user.username, self.user_data['username'])
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.role, 'employee')  # default role
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.assertEqual(admin_user.username, 'admin')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    
    def test_user_string_representation(self):
        """Test user string representation"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
        self.assertEqual(str(user), 'test@example.com')  # Uses email as string representation


class AuthenticationAPITest(APITestCase):
    """Integration tests for authentication API"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.refresh_url = reverse('token_refresh')
        
        # Create test users
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin',
            is_staff=True
        )
        
        self.manager_user = User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='managerpass123',
            role='manager'
        )
        
        self.employee_user = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employeepass123',
            role='employee'
        )
    
    def test_user_login_success(self):
        """Test successful user login"""
        login_data = {
            'email': 'admin@example.com',  # Use email instead of username
            'password': 'adminpass123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'admin')
        self.assertEqual(response.data['user']['role'], 'admin')
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'admin@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_token_refresh(self):
        """Test JWT token refresh"""
        # First login to get tokens
        login_data = {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        }
        login_response = self.client.post(self.login_url, login_data)
        refresh_token = login_response.data['refresh']
        
        # Test token refresh
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_authenticated_request(self):
        """Test making authenticated requests"""
        # Get access token
        login_data = {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        }
        login_response = self.client.post(self.login_url, login_data)
        access_token = login_response.data['access']
        
        # Make authenticated request
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/core/companies/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_role_based_permissions(self):
        """Test role-based access control"""
        # Test with different user roles
        test_cases = [
            (self.admin_user, 'adminpass123', True),
            (self.manager_user, 'managerpass123', True),
            (self.employee_user, 'employeepass123', False)  # Employees can only read
        ]
        
        for user, password, can_create in test_cases:
            # Login with user
            login_data = {
                'email': user.email,
                'password': password
            }
            login_response = self.client.post(self.login_url, login_data)
            access_token = login_response.data['access']
            
            # Try to create a company
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
            company_data = {
                'company_name': f'Test Company {user.role}'
            }
            response = self.client.post('/api/core/companies/', company_data)
            
            if can_create:
                self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
            else:
                # Employee should not be able to create
                self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UserSerializerTest(TestCase):
    """Unit tests for User serializer"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            role='manager'
        )
    
    def test_user_serialization(self):
        """Test user data serialization"""
        
        serializer = UserSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertEqual(data['role'], 'manager')
        self.assertNotIn('password', data)  # Password should not be serialized
