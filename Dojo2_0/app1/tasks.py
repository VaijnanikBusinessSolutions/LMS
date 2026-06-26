import os
import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.core.management import call_command
from tablib import Dataset

from .resources import BiometricAttendanceResource


logger = logging.getLogger(__name__)


@shared_task
def send_welcome_email_task(email, first_name, raw_password):
    subject = 'Account Created - Dojo LMS Login Details'
    email_body = f"""
Hello {first_name},

Welcome to the VTrain LMS Platform. Your account has been created by the administrator.

Here are your login credentials:
--------------------------------------------------
Username: {email}
Password: {raw_password}
--------------------------------------------------

Best Regards,
Admin Team
    """

    send_mail(
        subject,
        email_body,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=True,
    )

@shared_task
def import_attendance_from_excel():
    # EXCEL_FILE_PATH = r"E:\attendance.xlsx"
    EXCEL_FILE_PATH = r"C:\Users\jithi\OneDrive\Desktop\Attendance\attendance.xlsx"

    if not os.path.exists(EXCEL_FILE_PATH):
        return {'status': 'failed', 'reason': 'Excel file not found'}

    file_format = 'xls' if EXCEL_FILE_PATH.endswith('.xls') else 'xlsx'
    dataset = Dataset()

    try:
        with open(EXCEL_FILE_PATH, 'rb') as file_obj:
            imported_data = dataset.load(file_obj.read(), format=file_format)
    except Exception as e:
        return {'status': 'failed', 'reason': f'File read error: {str(e)}'}

    resource = BiometricAttendanceResource()
    result = resource.import_data(imported_data, dry_run=True)

    if result.has_errors():
        errors = []
        for row_number, row_errors in result.row_errors():
            for error in row_errors:
                errors.append(f"Row {row_number}: {str(error.error)}")
        return {'status': 'failed', 'errors': errors}

    resource.import_data(imported_data, dry_run=False)
    return {'status': 'success', 'message': 'Data imported successfully'}

@shared_task
def create_recurring_schedules():
    """
    Celery task to create recurring schedules
    Runs daily to check if any schedules need to be created
    """
    try:
        logger.info("Starting create_recurring_schedules task")
        call_command('create_recurring_schedules')
        logger.info("Completed create_recurring_schedules task")
    except Exception as e:
        logger.error(f"Error in create_recurring_schedules task: {str(e)}")
        raise
