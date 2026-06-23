# from django.core.management.base import BaseCommand
# from django.utils import timezone
# from datetime import date
# from dateutil.relativedelta import relativedelta
# from app1.models import Schedule, RecurrenceInterval

# class Command(BaseCommand):
#     help = 'Create recurring training schedules based on completed trainings'

#     def handle(self, *args, **kwargs):
#         # Get all completed schedules with recurrence enabled
#         completed_schedules = Schedule.objects.filter(
#             status='completed',
#             is_recurring=True,
#             recurrence_interval__isnull=False
#         )

#         created_count = 0
        
#         for schedule in completed_schedules:
#             interval = schedule.recurrence_interval
#             if not interval or not interval.is_active:
#                 continue
            
#             # Calculate next date
#             next_date = schedule.date + relativedelta(months=interval.interval_months)
            
#             # Check if it's time to create the next schedule
#             days_until_next = (next_date - date.today()).days
            
#             # Create schedule 30 days before the next date
#             if 0 <= days_until_next <= 30:
#                 # Check if already created
#                 existing = Schedule.objects.filter(
#                     parent_schedule=schedule,
#                     date=next_date
#                 ).exists()
                
#                 if not existing:
#                     new_schedule = Schedule.objects.create(
#                         training_category=schedule.training_category,
#                         training_name=schedule.training_name,
#                         trainer=schedule.trainer,
#                         venue=schedule.venue,
#                         status='scheduled',
#                         date=next_date,
#                         time=schedule.time,
#                         recurrence_interval=schedule.recurrence_interval,
#                         is_recurring=True,
#                         parent_schedule=schedule
#                     )
                    
#                     # Copy employees
#                     new_schedule.employees.set(schedule.employees.all())
                    
#                     # Update last recurrence date
#                     schedule.last_recurrence_date = next_date
#                     schedule.save()
                    
#                     created_count += 1
#                     self.stdout.write(
#                         self.style.SUCCESS(
#                             f'Created recurring schedule for {schedule.training_name.topic} on {next_date}'
#                         )
#                     )
        
#         self.stdout.write(
#             self.style.SUCCESS(f'Successfully created {created_count} recurring schedules')
#         )

# ====================================================================================
# from django.core.management.base import BaseCommand
# from django.utils import timezone
# from datetime import date, timedelta
# from dateutil.relativedelta import relativedelta
# from app1.models import Schedule, RecurrenceInterval
# from django.db import transaction

# class Command(BaseCommand):
#     help = 'Create recurring schedules 7 days before the interval ends'

#     def handle(self, *args, **options):
#         today = date.today()
        
#         # Find all completed recurring schedules that haven't created their next schedule yet
#         completed_recurring_schedules = Schedule.objects.filter(
#             status='completed',
#             is_recurring=True,
#             recurring_schedule_created=False,
#             recurrence_interval__isnull=False,
#             completed_date__isnull=False
#         )
        
#         created_count = 0
#         skipped_count = 0
        
#         for schedule in completed_recurring_schedules:
#             try:
#                 # Calculate when the next training should be scheduled
#                 # If completed on 12/02/2025 with 5 month interval
#                 # Next training date = 12/07/2025
#                 next_training_date = schedule.date + relativedelta(
#                     months=schedule.recurrence_interval.interval_months
#                 )
                
#                 # Calculate when to create the schedule (7 days before next training)
#                 # Creation date = 05/07/2025
#                 creation_trigger_date = next_training_date - timedelta(days=7)
                
#                 self.stdout.write(
#                     f"\nProcessing: {schedule.training_name.topic} (ID: {schedule.id})"
#                 )
#                 self.stdout.write(
#                     f"  Original date: {schedule.date}"
#                 )
#                 self.stdout.write(
#                     f"  Completed date: {schedule.completed_date}"
#                 )
#                 self.stdout.write(
#                     f"  Next training date: {next_training_date}"
#                 )
#                 self.stdout.write(
#                     f"  Creation trigger date: {creation_trigger_date}"
#                 )
#                 self.stdout.write(
#                     f"  Today: {today}"
#                 )
                
#                 # Check if today is the day to create the schedule (or past it)
#                 if today >= creation_trigger_date:
#                     # Don't create if next training date is in the past
#                     if next_training_date <= today:
#                         self.stdout.write(
#                             self.style.WARNING(
#                                 f"  ⚠ Skipped: Next training date {next_training_date} is in the past"
#                             )
#                         )
#                         skipped_count += 1
#                         continue
                    
#                     # Check if recurring schedule already exists for this date
#                     existing = Schedule.objects.filter(
#                         parent_schedule=schedule,
#                         date=next_training_date
#                     ).exists()
                    
#                     if existing:
#                         self.stdout.write(
#                             self.style.WARNING(
#                                 f"  ⚠ Skipped: Schedule already exists for {next_training_date}"
#                             )
#                         )
#                         # Mark as created to avoid checking again
#                         schedule.recurring_schedule_created = True
#                         schedule.save()
#                         skipped_count += 1
#                         continue
                    
#                     # Create the new recurring schedule
#                     with transaction.atomic():
#                         new_schedule = Schedule.objects.create(
#                             training_category=schedule.training_category,
#                             training_name=schedule.training_name,
#                             trainer=schedule.trainer,
#                             venue=schedule.venue,
#                             status='scheduled',
#                             date=next_training_date,
#                             time=schedule.time,
#                             recurrence_interval=schedule.recurrence_interval,
#                             is_recurring=True,
#                             parent_schedule=schedule,
#                             recurring_schedule_created=False,
#                             completed_date=None
#                         )
                        
#                         # Copy employees
#                         new_schedule.employees.set(schedule.employees.all())
                        
#                         # Mark original schedule as having created its recurring instance
#                         schedule.recurring_schedule_created = True
#                         schedule.save()
                        
#                         self.stdout.write(
#                             self.style.SUCCESS(
#                                 f"  ✓ Created recurring schedule (ID: {new_schedule.id}) for {next_training_date}"
#                             )
#                         )
#                         created_count += 1
#                 else:
#                     self.stdout.write(
#                         f"  ℹ Not yet time to create (trigger: {creation_trigger_date})"
#                     )
#                     skipped_count += 1
                    
#             except Exception as e:
#                 self.stdout.write(
#                     self.style.ERROR(
#                         f"  ✗ Error processing schedule {schedule.id}: {str(e)}"
#                     )
#                 )
#                 skipped_count += 1
        
#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"\n{'='*60}"
#             )
#         )
#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"Summary: {created_count} schedules created, {skipped_count} skipped/pending"
#             )
#         )
#         self.stdout.write(
#             self.style.SUCCESS(
#                 f"{'='*60}\n"
#             )
#         )


from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from app1.models import Schedule
from django.db import transaction

class Command(BaseCommand):
    help = 'Create recurring schedules 7 days before the interval ends'

    def handle(self, *args, **options):
        today = date.today()
        
        # Find all completed recurring schedules that haven't created their next schedule yet
        completed_recurring_schedules = Schedule.objects.filter(
            status='completed',
            is_recurring=True,
            recurring_schedule_created=False,
            recurrence_months__isnull=False,
            completed_date__isnull=False
        )
        
        created_count = 0
        skipped_count = 0
        
        for schedule in completed_recurring_schedules:
            try:
                # Get the next training date (with override support)
                next_training_date = schedule.get_next_training_date()
                
                if not next_training_date:
                    self.stdout.write(
                        self.style.WARNING(
                            f"  ⚠ Skipped: No next training date for schedule {schedule.id}"
                        )
                    )
                    skipped_count += 1
                    continue
                
                # Calculate when to create the schedule (7 days before next training)
                creation_trigger_date = schedule.get_next_creation_date()
                
                self.stdout.write(
                    f"\nProcessing: {schedule.training_name.topic} (ID: {schedule.id})"
                )
                self.stdout.write(
                    f"  Original date: {schedule.date}"
                )
                self.stdout.write(
                    f"  Completed date: {schedule.completed_date}"
                )
                self.stdout.write(
                    f"  Recurrence: {schedule.recurrence_months} month(s)"
                )
                self.stdout.write(
                    f"  Next training date: {next_training_date}"
                )
                self.stdout.write(
                    f"  Creation trigger date: {creation_trigger_date}"
                )
                self.stdout.write(
                    f"  Today: {today}"
                )
                
                # Check if today is the day to create the schedule (or past it)
                if today >= creation_trigger_date:
                    # Don't create if next training date is in the past
                    if next_training_date <= today:
                        self.stdout.write(
                            self.style.WARNING(
                                f"  ⚠ Skipped: Next training date {next_training_date} is in the past"
                            )
                        )
                        skipped_count += 1
                        continue
                    
                    # Check if recurring schedule already exists for this date
                    existing = Schedule.objects.filter(
                        parent_schedule=schedule,
                        date=next_training_date
                    ).exists()
                    
                    if existing:
                        self.stdout.write(
                            self.style.WARNING(
                                f"  ⚠ Skipped: Schedule already exists for {next_training_date}"
                            )
                        )
                        # Mark as created to avoid checking again
                        schedule.recurring_schedule_created = True
                        schedule.save()
                        skipped_count += 1
                        continue
                    
                    # Create the new recurring schedule
                    with transaction.atomic():
                        new_schedule = Schedule.objects.create(
                            training_category=schedule.training_category,
                            training_name=schedule.training_name,
                            trainer=schedule.trainer,
                            venue=schedule.venue,
                            status='scheduled',
                            date=next_training_date,
                            time=schedule.time,
                            recurrence_months=schedule.recurrence_months,
                            is_recurring=True,
                            parent_schedule=schedule,
                            recurring_schedule_created=False,
                            completed_date=None,
                            next_training_date_override=None
                        )
                        
                        # Copy employees
                        new_schedule.employees.set(schedule.employees.all())
                        
                        # Mark original schedule as having created its recurring instance
                        schedule.recurring_schedule_created = True
                        schedule.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"  ✓ Created recurring schedule (ID: {new_schedule.id}) for {next_training_date}"
                            )
                        )
                        created_count += 1
                else:
                    self.stdout.write(
                        f"  ℹ Not yet time to create (trigger: {creation_trigger_date})"
                    )
                    skipped_count += 1
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"  ✗ Error processing schedule {schedule.id}: {str(e)}"
                    )
                )
                skipped_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\n{'='*60}"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Summary: {created_count} schedules created, {skipped_count} skipped/pending"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'='*60}\n"
            )
        )