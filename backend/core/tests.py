from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, datetime
from decimal import Decimal
import json

from core.models import Company, Department, Employee
from core.serializers import CompanySerializer, DepartmentSerializer, EmployeeSerializer

User = get_user_model()


class CompanyModelTest(TestCase):
    """Unit tests for Company model"""
    
    def setUp(self):
        self.company_data = {
            'company_name': 'Test Company'
        }
    
    def test_create_company(self):
        """Test creating a company"""
        company = Company.objects.create(**self.company_data)
        
        self.assertEqual(company.company_name, self.company_data['company_name'])
        self.assertIsNotNone(company.id)
    
    def test_company_string_representation(self):
        """Test company string representation"""
        company = Company.objects.create(**self.company_data)
        self.assertEqual(str(company), self.company_data['company_name'])
    
    def test_company_unique_name(self):
        """Test that company names are unique"""
        Company.objects.create(**self.company_data)
        
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Company.objects.create(**self.company_data)


class DepartmentModelTest(TestCase):
    """Unit tests for Department model"""
    
    def setUp(self):
        self.company = Company.objects.create(
            company_name='Test Company'
        )
        self.department_data = {
            'department_name': 'Engineering',
            'company': self.company
        }
    
    def test_create_department(self):
        """Test creating a department"""
        department = Department.objects.create(**self.department_data)
        
        self.assertEqual(department.department_name, self.department_data['department_name'])
        self.assertEqual(department.company, self.company)
        self.assertIsNotNone(department.id)
    
    def test_department_string_representation(self):
        """Test department string representation"""
        department = Department.objects.create(**self.department_data)
        expected_str = f"{self.department_data['department_name']} - {self.company.company_name}"
        self.assertEqual(str(department), expected_str)
    
    def test_department_company_relationship(self):
        """Test department-company relationship"""
        department = Department.objects.create(**self.department_data)
        
        # Test forward relationship
        self.assertEqual(department.company, self.company)
        
        # Test reverse relationship
        self.assertIn(department, self.company.departments.all())


class EmployeeModelTest(TestCase):
    """Unit tests for Employee model"""
    
    def setUp(self):
        self.company = Company.objects.create(
            company_name='Test Company'
        )
        self.department = Department.objects.create(
            department_name='Engineering',
            company=self.company
        )
        self.employee_data = {
            'employee_name': 'John Doe',
            'email_address': 'john@example.com',
            'mobile_number': '+1234567890',
            'address': '123 Test Street',
            'designation': 'Software Developer',
            'employee_status': 'hired',
            'hired_on': date.today(),
            'department': self.department,
            'company': self.company
        }
    
    def test_create_employee(self):
        """Test creating an employee"""
        employee = Employee.objects.create(**self.employee_data)
        
        self.assertEqual(employee.employee_name, self.employee_data['employee_name'])
        self.assertEqual(employee.email_address, self.employee_data['email_address'])
        self.assertEqual(employee.designation, self.employee_data['designation'])
        self.assertEqual(employee.employee_status, self.employee_data['employee_status'])
        self.assertEqual(employee.department, self.department)
        self.assertEqual(employee.company, self.company)
    
    def test_employee_string_representation(self):
        """Test employee string representation"""
        employee = Employee.objects.create(**self.employee_data)
        expected_str = f"{self.employee_data['employee_name']} - {self.company.company_name}"
        self.assertEqual(str(employee), expected_str)
    
    def test_employee_days_employed_property(self):
        """Test days employed calculation"""
        employee = Employee.objects.create(**self.employee_data)
        
        # Should return number of days since hired
        self.assertIsNotNone(employee.days_employed)
        self.assertGreaterEqual(employee.days_employed, 0)


class CompanyAPITest(APITestCase):
    """Integration tests for Company API"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin',
            is_staff=True
        )
        
        self.employee_user = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employeepass123',
            role='employee'
        )
        
        # Create test company
        self.company = Company.objects.create(
            company_name='Test Company'
        )
        
        self.company_data = {
            'company_name': 'New Company'
        }
    
    def authenticate_user(self, user, password):
        """Helper method to authenticate user"""
        login_url = reverse('login')
        login_data = {
            'email': user.email,
            'password': password
        }
        response = self.client.post(login_url, login_data)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    def test_list_companies(self):
        """Test listing companies"""
        self.authenticate_user(self.admin_user, 'adminpass123')
        
        url = reverse('company-list-create')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company_name'], self.company.company_name)
    
    def test_create_company_as_admin(self):
        """Test creating company as admin"""
        self.authenticate_user(self.admin_user, 'adminpass123')
        
        url = reverse('company-list-create')
        response = self.client.post(url, self.company_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['company_name'], self.company_data['company_name'])
        
        # Verify company was created in database
        self.assertTrue(Company.objects.filter(company_name=self.company_data['company_name']).exists())
    
    def test_create_company_as_employee_forbidden(self):
        """Test that employee cannot create company"""
        self.authenticate_user(self.employee_user, 'employeepass123')
        
        url = reverse('company-list-create')
        response = self.client.post(url, self.company_data)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_company(self):
        """Test updating company"""
        self.authenticate_user(self.admin_user, 'adminpass123')
        
        url = reverse('company-detail', kwargs={'pk': self.company.pk})
        update_data = {
            'company_name': 'Updated Company Name'
        }
        response = self.client.put(url, update_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], update_data['company_name'])
        
        # Verify update in database
        self.company.refresh_from_db()
        self.assertEqual(self.company.company_name, update_data['company_name'])
    
    def test_delete_company(self):
        """Test deleting company"""
        self.authenticate_user(self.admin_user, 'adminpass123')
        
        url = reverse('company-detail', kwargs={'pk': self.company.pk})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify deletion in database
        self.assertFalse(Company.objects.filter(pk=self.company.pk).exists())


class EmployeeAPITest(APITestCase):
    """Integration tests for Employee API"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )
        
        # Create test company and department
        self.company = Company.objects.create(
            company_name='Test Company'
        )
        
        self.department = Department.objects.create(
            department_name='Engineering',
            company=self.company
        )
        
        # Create test employee
        self.employee = Employee.objects.create(
            employee_name='John Doe',
            email_address='john@example.com',
            mobile_number='+1234567890',
            address='123 Test Street',
            designation='Developer',
            employee_status='hired',
            department=self.department,
            company=self.company
        )
    
    def authenticate_admin(self):
        """Helper method to authenticate as admin"""
        login_url = reverse('login')
        login_data = {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        }
        response = self.client.post(login_url, login_data)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    def test_list_employees(self):
        """Test listing employees"""
        self.authenticate_admin()
        
        url = reverse('employee-list-create')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['employee_name'], 'John Doe')
    
    def test_employee_department_filtering(self):
        """Test filtering employees by department"""
        self.authenticate_admin()
        
        url = reverse('employee-list-create')
        response = self.client.get(url, {'department': self.department.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['department_name'], self.department.department_name)
    
    def test_employee_company_filtering(self):
        """Test filtering employees by company"""
        self.authenticate_admin()
        
        url = reverse('employee-list-create')
        response = self.client.get(url, {'company': self.company.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company_name'], self.company.company_name)


class SerializerTest(TestCase):
    """Unit tests for serializers"""
    
    def setUp(self):
        self.company = Company.objects.create(
            company_name='Test Company'
        )
        
        self.department = Department.objects.create(
            department_name='Engineering',
            company=self.company
        )
    
    def test_company_serializer(self):
        """Test company serialization"""
        serializer = CompanySerializer(self.company)
        data = serializer.data
        
        self.assertEqual(data['company_name'], self.company.company_name)
        self.assertIn('id', data)
    
    def test_department_serializer(self):
        """Test department serialization"""
        serializer = DepartmentSerializer(self.department)
        data = serializer.data
        
        self.assertEqual(data['department_name'], self.department.department_name)
        self.assertEqual(data['company'], self.company.id)
        self.assertIn('id', data)
    
    def test_company_serializer_validation(self):
        """Test company serializer validation"""
        # Test with invalid data
        invalid_data = {'company_name': ''}  # Empty name
        serializer = CompanySerializer(data=invalid_data)
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('company_name', serializer.errors)
    
    def test_department_serializer_validation(self):
        """Test department serializer validation"""
        # Test with invalid company ID
        invalid_data = {
            'department_name': 'Test Department',
            'company': 999  # Non-existent company
        }
        serializer = DepartmentSerializer(data=invalid_data)
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('company', serializer.errors)
