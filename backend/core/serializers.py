from rest_framework import serializers
from django.core.validators import EmailValidator, RegexValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Company, Department, Employee
from datetime import date
import re


class CompanySerializer(serializers.ModelSerializer):
    number_of_departments = serializers.ReadOnlyField()
    number_of_employees = serializers.ReadOnlyField()

    class Meta:
        model = Company
        fields = ['id', 'company_name', 'number_of_departments', 'number_of_employees']

    def validate_company_name(self, value):
        """Validate company name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Company name cannot be empty.")
        
        # Check for uniqueness
        company_name = value.strip()
        existing_query = Company.objects.filter(company_name=company_name)
        
        # For updates, exclude the current instance
        if self.instance:
            existing_query = existing_query.exclude(pk=self.instance.pk)
        
        if existing_query.exists():
            raise serializers.ValidationError("A company with this name already exists.")
        
        return company_name


class DepartmentSerializer(serializers.ModelSerializer):
    number_of_employees = serializers.ReadOnlyField()
    company_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'company', 'company_name', 'department_name', 'number_of_employees']

    def validate_department_name(self, value):
        """Validate department name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Department name cannot be empty.")
        return value.strip()

    def validate_company(self, value):
        """Validate company exists"""
        if not value:
            raise serializers.ValidationError("Company is required.")
        return value

    def validate(self, data):
        """Additional department validation"""
        company = data.get('company')
        department_name = data.get('department_name')
        
        if company and department_name:
            # Check if department with same name already exists in the company
            existing_query = Department.objects.filter(
                company=company, 
                department_name=department_name.strip()
            )
            
            # For updates, exclude the current instance
            if self.instance:
                existing_query = existing_query.exclude(pk=self.instance.pk)
            
            if existing_query.exists():
                raise serializers.ValidationError(
                    "A department with this name already exists in the selected company."
                )
        
        return data


class EmployeeSerializer(serializers.ModelSerializer):
    days_employed = serializers.ReadOnlyField()
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'company', 'company_name', 'department', 'department_name',
            'employee_status', 'employee_name', 'email_address', 'mobile_number',
            'address', 'designation', 'hired_on', 'days_employed'
        ]

    def validate_employee_name(self, value):
        """Validate employee name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Employee name cannot be empty.")
        
        # Check for minimum length
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Employee name must be at least 2 characters long.")
        
        return value.strip()

    def validate_email_address(self, value):
        """Validate email address format"""
        if not value or not value.strip():
            raise serializers.ValidationError("Email address is required.")
        
        # Use Django's email validator
        email_validator = EmailValidator()
        try:
            email_validator(value.strip())
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        
        # Additional email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value.strip()):
            raise serializers.ValidationError("Enter a valid email address.")
        
        return value.strip().lower()

    def validate_mobile_number(self, value):
        """Validate mobile number format"""
        if not value or not value.strip():
            raise serializers.ValidationError("Mobile number is required.")
        
        # Phone number validation using regex
        phone_pattern = r'^\+?1?\d{9,15}$'
        if not re.match(phone_pattern, value.strip()):
            raise serializers.ValidationError(
                "Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        
        return value.strip()

    def validate_designation(self, value):
        """Validate designation"""
        if not value or not value.strip():
            raise serializers.ValidationError("Designation cannot be empty.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Designation must be at least 2 characters long.")
        
        return value.strip()

    def validate_address(self, value):
        """Validate address"""
        if not value or not value.strip():
            raise serializers.ValidationError("Address cannot be empty.")
        
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Address must be at least 5 characters long.")
        
        return value.strip()

    def validate_company(self, value):
        """Validate company"""
        if not value:
            raise serializers.ValidationError("Company is required.")
        return value

    def validate_department(self, value):
        """Validate department"""
        if not value:
            raise serializers.ValidationError("Department is required.")
        return value

    def validate_employee_status(self, value):
        """Validate employee status"""
        valid_statuses = ['application_received', 'interview_scheduled', 'hired', 'not_accepted']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        return value

    def validate_hired_on(self, value):
        """Validate hired date"""
        if value and value > date.today():
            raise serializers.ValidationError("Hired date cannot be in the future.")
        return value

    def validate(self, data):
        """Additional employee validation and business logic"""
        company = data.get('company')
        department = data.get('department')
        employee_status = data.get('employee_status')
        hired_on = data.get('hired_on')
        email_address = data.get('email_address')

        # Validate that department belongs to the selected company
        if company and department:
            if department.company != company:
                raise serializers.ValidationError(
                    "The selected department does not belong to the selected company."
                )

        # Validate hired_on field based on employee status
        if employee_status == 'hired':
            if not hired_on:
                raise serializers.ValidationError(
                    "Hired date is required when employee status is 'hired'."
                )
        else:
            # Clear hired_on if status is not hired
            data['hired_on'] = None

        # Check for duplicate email addresses
        if email_address:
            existing_query = Employee.objects.filter(email_address=email_address.lower())
            
            # For updates, exclude the current instance
            if self.instance:
                existing_query = existing_query.exclude(pk=self.instance.pk)
            
            if existing_query.exists():
                raise serializers.ValidationError(
                    "An employee with this email address already exists."
                )

        # Validate status transitions (basic workflow)
        if self.instance and self.instance.employee_status != employee_status:
            current_status = self.instance.employee_status
            new_status = employee_status
            
            # Define allowed transitions
            allowed_transitions = {
                'application_received': ['interview_scheduled', 'not_accepted'],
                'interview_scheduled': ['hired', 'not_accepted'],
                'hired': [],  # Once hired, cannot change status
                'not_accepted': []  # Once not accepted, cannot change status
            }
            
            if new_status not in allowed_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot change status from '{current_status}' to '{new_status}'. "
                    f"Allowed transitions: {allowed_transitions.get(current_status, [])}"
                )

        return data


class EmployeeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing employees"""
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    days_employed = serializers.ReadOnlyField()

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_name', 'email_address', 'mobile_number',
            'designation', 'employee_status', 'hired_on', 'days_employed',
            'company_name', 'department_name'
        ]


class DepartmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing departments by company"""
    class Meta:
        model = Department
        fields = ['id', 'department_name']


class EmployeeReportSerializer(serializers.ModelSerializer):
    """Serializer for Employee Report showing hired employees """
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    days_employed = serializers.ReadOnlyField()
    position = serializers.CharField(source='designation', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_name', 'email_address', 'mobile_number',
            'position', 'hired_on', 'days_employed', 'company_name', 'department_name'
        ]
