
import os
from celery import shared_task
from tablib import Dataset
from .resources import BiometricAttendanceResource

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

# from celery import shared_task
# from django.core.management import call_command

# @shared_task
# def create_recurring_schedules():
#     call_command('create_recurring_schedules')

from celery import shared_task
from django.core.management import call_command
import logging

logger = logging.getLogger(__name__)

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