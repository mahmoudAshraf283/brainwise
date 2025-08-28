from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.utils import timezone
from datetime import date

# Create your models here.

class Company(models.Model):
    company_name = models.CharField(max_length=200, unique=True)
    @property
    def number_of_departments(self):
        return self.departments.count()

    @property
    def number_of_employees(self):
        return self.employees.count()
    def __str__(self):
        return self.company_name

class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    department_name = models.CharField(max_length=200)
    @property
    def number_of_employees(self):
        return self.employees.count()


    class Meta:
        unique_together = ['company', 'department_name']
    def __str__(self):
        return f"{self.department_name} - {self.company.company_name}"


class Employee(models.Model):
    STATUS_CHOICES = [
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    employee_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='application_received')
    employee_name = models.CharField(max_length=200)
    email_address = models.EmailField(validators=[EmailValidator()])
    
    # Mobile number validation for international formats
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    mobile_number = models.CharField(validators=[phone_regex], max_length=17)
    
    address = models.TextField()
    designation = models.CharField(max_length=200, help_text="Position/Title")
    hired_on = models.DateField(null=True, blank=True)

    @property
    def days_employed(self):
        if self.hired_on and self.employee_status == 'hired':
            return (date.today() - self.hired_on).days
        return None


    def __str__(self):
        return f"{self.employee_name} - {self.company.company_name}"
