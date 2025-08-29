from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Company, Department, Employee
from .serializers import (
    CompanySerializer, DepartmentSerializer, EmployeeSerializer,
    EmployeeListSerializer, DepartmentListSerializer
)
from .permissions import IsAdminOrManager, IsAdminOnly


# Company Views
class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_create(self, serializer):
        """Create a new company"""
        try:
            company = serializer.save()
            return company
        except Exception as e:
            return Response(
                {'error': f'Failed to create company: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_update(self, serializer):
        """Update a company"""
        try:
            company = serializer.save()
            return company
        except Exception as e:
            return Response(
                {'error': f'Failed to update company: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Delete company with business logic validation"""
        try:
            company = self.get_object()
            
            # Business logic: Check if company has departments or employees
            if company.departments.exists():
                return Response(
                    {'error': 'Cannot delete company with existing departments. Please delete all departments first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if company.employees.exists():
                return Response(
                    {'error': 'Cannot delete company with existing employees. Please delete all employees first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Proceed with deletion
            company.delete()
                
            return Response(
                {'message': 'Company deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to delete company: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# Department Views
class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.select_related('company').all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get_queryset(self):
        """Filter departments by company if specified"""
        queryset = Department.objects.select_related('company').all()
        company_id = self.request.query_params.get('company', None)
        if company_id is not None:
            queryset = queryset.filter(company_id=company_id)
        return queryset

    def perform_create(self, serializer):
        """Create a new department"""
        try:
            department = serializer.save()
            return department
        except Exception as e:
            return Response(
                {'error': f'Failed to create department: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.select_related('company').all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_update(self, serializer):
        """Update a department"""
        try:
            department = serializer.save()
            return department
        except Exception as e:
            return Response(
                {'error': f'Failed to update department: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Delete department with business logic validation"""
        try:
            department = self.get_object()
            
            #Check if department has employees
            if department.employees.exists():
                return Response(
                    {'error': 'Cannot delete department with existing employees. Please delete all employees first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Proceed with deletion
            department.delete()
                
            return Response(
                {'message': 'Department deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to delete department: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# Employee Views
class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.select_related('company', 'department').all()
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get_serializer_class(self):
        """Use different serializers for list and create operations"""
        if self.request.method == 'GET':
            return EmployeeListSerializer
        return EmployeeSerializer

    def get_queryset(self):
        """Filter employees based on query parameters"""
        queryset = Employee.objects.select_related('company', 'department').all()
        
        # Filter by company
        company_id = self.request.query_params.get('company', None)
        if company_id is not None:
            queryset = queryset.filter(company_id=company_id)
        
        # Filter by department
        department_id = self.request.query_params.get('department', None)
        if department_id is not None:
            queryset = queryset.filter(department_id=department_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter is not None:
            queryset = queryset.filter(employee_status=status_filter)
        
        return queryset

    def perform_create(self, serializer):
        """Create a new employee"""
        try:
            # Additional business logic before creation
            validated_data = serializer.validated_data
            
            # Handle status-specific logic
            if validated_data.get('employee_status') != 'hired':
                validated_data['hired_on'] = None
            
            employee = serializer.save()
            return employee
        except Exception as e:
            return Response(
                {'error': f'Failed to create employee: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.select_related('company', 'department').all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_update(self, serializer):
        """Update an employee"""
        try:
            # Additional business logic before update
            validated_data = serializer.validated_data
            
            # Handle status-specific logic
            if validated_data.get('employee_status') != 'hired':
                validated_data['hired_on'] = None
            
            employee = serializer.save()
            return employee
        except Exception as e:
            return Response(
                {'error': f'Failed to update employee: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Delete an employee"""
        try:
            employee = self.get_object()
            
            # Business logic before deletion (if any specific rules apply)
            employee.delete()
                
            return Response(
                {'message': 'Employee deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to delete employee: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# Utility Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_departments(request, company_id):
    """Get all departments for a specific company"""
    try:
        company = get_object_or_404(Company, id=company_id)
        departments = Department.objects.filter(company=company)
        serializer = DepartmentListSerializer(departments, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch departments: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
