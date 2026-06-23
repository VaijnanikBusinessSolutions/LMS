import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OJTScore, Score, SkillMatrix, TraineeInfo, MasterTable, Station, HierarchyStructure


def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


def update_skill_matrix(employee, station, level, verbose=True):
    """
    Update SkillMatrix when both OJT and Evaluation are passed
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # ✅ Get TraineeInfo
    trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id).first()
    if not trainee_info:
        if verbose:
            print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id}")
            print("=" * 80)
        return

    if verbose:
        print(f"[SkillMatrix] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
              f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")

    # -------------------------
    # Check if OJT is passed
    # -------------------------
    ojt_pass = False
    if trainee_info.status == "Pass":
        ojt_exists = OJTScore.objects.filter(
            trainee__emp_id=employee.emp_id,
            topic__level=level
        ).exists()
        ojt_pass = ojt_exists
        if verbose:
            print(f"[SkillMatrix] OJT status=Pass, OJTScore exists for this level: {ojt_exists}")
    else:
        if verbose:
            print(f"[SkillMatrix] OJT not passed → Trainee status is {trainee_info.status}")

    if verbose:
        print(f"[SkillMatrix] Final OJT passed = {ojt_pass}")

    # -------------------------
    # Check if Evaluation is passed
    # -------------------------
    eval_pass = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()
    if verbose:
        print(f"[SkillMatrix] Evaluation passed = {eval_pass}")

    # -------------------------
    # Update or create SkillMatrix
    # -------------------------
    if ojt_pass and eval_pass:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
             hierarchy=hierarchy,
            defaults={
                "employee_name": trainee_info.trainee_name,
                "emp_id": trainee_info.emp_id,
                "doj": trainee_info.doj,
                # "hierarchy": hierarchy,
                "level":level,
            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ SkillMatrix created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}")

    if verbose:
        print("=" * 80)


# -------------------------
# Signal for OJTScore
# -------------------------
# @receiver(post_save, sender=OJTScore)
# def update_skill_on_ojt_save(sender, instance, **kwargs):
#     print(f"[Signal][OJTScore] Saved → Trainee {instance.trainee.emp_id}, Score={instance.score}, Topic={instance.topic}")
#     try:
#         employee = MasterTable.objects.get(emp_id=instance.trainee.emp_id)
#         station = Station.objects.get(station_name=instance.trainee.station)
#     except MasterTable.DoesNotExist:
#         print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.trainee.emp_id}")
#         return
#     except Station.DoesNotExist:
#         print(f"[Signal][ERROR] Station not found: {instance.trainee.station}")
#         return

#     # ⏳ Delay 5 seconds before running the update
#     run_after_delay(update_skill_matrix, 5, employee, station, instance.topic.level, True)


# -------------------------
# Signal for Score
# -------------------------
@receiver(post_save, sender=Score)
def update_skill_on_eval_save(sender, instance, **kwargs):
    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")
    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    # ⏳ Delay 5 seconds before running the update
    run_after_delay(update_skill_matrix, 5, instance.employee, instance.skill, instance.level, True)

"""




# Django signals for automatic notification generation
# Handles real-time notification triggers for various system events
# """

from django.db.models.signals import post_delete
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Notification, MasterTable, Score, User,HumanBodyCheckSession,HumanBodyCheckSheet,ShokuchouExamResult,HanchouExamResult,Schedule,MachineAllocation,RetrainingSession,OperatorPerformanceEvaluation,OJTLevel2Quantity,UserRegistration
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

def create_notification(
    title, message, notification_type, recipient=None, recipient_email=None, 
    employee=None, priority='medium', metadata=None
):
    try:
        logger.info(f"Creating notification: {title} for {recipient.email if recipient else recipient_email}")
        notification = Notification.objects.create(
            title=title,
            message=message,
            notification_type=notification_type,
            recipient=recipient,
            recipient_email=recipient_email or (recipient.email if recipient else None),
            employee=employee,
            priority=priority,
            metadata=metadata or {},
            is_sent=False
        )
        return notification
    except Exception as e:
        logger.error(f"Error creating notification: {str(e)}")
        return None

def get_admin_users():
    try:
        admin_users = User.objects.filter(role__name__in=['admin', 'management'])
        logger.info(f"Found {admin_users.count()} admin/management users")
        if not admin_users.exists():
            logger.warning("No admin users found, falling back to first 5 users")
            return User.objects.all()[:5]
        return admin_users
    except Exception as e:
        logger.error(f"Error fetching admin users: {str(e)}")
        return User.objects.none()

def get_employee_user(employee):
    try:
        user = User.objects.get(email=employee.email)
        logger.info(f"Found user by email: {user.email} for employee {employee.emp_id}")
        return user
    except User.DoesNotExist:
        try:
            user = User.objects.get(employeeid=employee.emp_id)
            logger.info(f"Found user by employeeid: {user.email} for employee {employee.emp_id}")
            return user
        except User.DoesNotExist:
            logger.warning(f"No user found for employee {employee.emp_id}")
            return None
    except Exception as e:
        logger.error(f"Error finding user for employee {employee.emp_id}: {str(e)}")
        return None
    
@receiver(post_save, sender=UserRegistration)
def notify_user_registered(sender, instance, created, **kwargs):
    """
    Notification when a *user* is registered in UserRegistration model.
    This will drive the 'Registration' tab.
    """
    if not created:
        return  # only on first create

    admin_users = get_admin_users()
    full_name = f"{instance.first_name} {instance.last_name or ''}".strip()
    temp_id = instance.temp_id

    # 1️⃣ Notify admins
    for admin in admin_users:
        create_notification(
            title="User Registered",
            message=f"New user {full_name} (Temp ID: {temp_id}) has been registered.",
            notification_type="user_registration",      # 👈 NEW TYPE
            recipient=admin,
            priority="medium",
            metadata={
                "temp_id": temp_id,
                "email": instance.email,
                "phone": instance.phone_number,
                "auto_generated": True,
            },
        )

@receiver(post_save, sender=MasterTable)
def notify_mastertable_employee_created(sender, instance, created, **kwargs):
    """
    This stays for MasterTable (employee master data), not for Registration tab.
    """
    if not created:
        return

    admin_users = get_admin_users()
    full_name = f"{instance.first_name} {instance.last_name or ''}".strip()
    department_name = instance.department.department_name if instance.department else "Not Assigned"

    for admin in admin_users:
        create_notification(
            title="Master Table – Employee Created",
            message=f"Employee {full_name} (ID: {instance.emp_id}) added to Master Table.",
            notification_type="mastertable_employee_created",   # 👈 NEW TYPE
            recipient=admin,
            employee=instance,
            priority="medium",
            metadata={
                "emp_id": instance.emp_id,
                "department": department_name,
                "auto_generated": True,
            },
        )


@receiver(post_delete, sender=MasterTable)
def notify_mastertable_employee_removed(sender, instance, **kwargs):
    """
    Notify when an employee row is removed from MasterTable.
    """
    admin_users = get_admin_users()
    full_name = f"{instance.first_name} {instance.last_name or ''}".strip()
    department_name = instance.department.department_name if getattr(instance, "department", None) else "Not Assigned"

    for admin in admin_users:
        create_notification(
            title="Master Table – Employee Removed",
            message=f"Employee {full_name} (ID: {instance.emp_id}) was removed from Master Table.",
            notification_type="mastertable_employee_removed",   # 👈 NEW TYPE
            recipient=admin,
            employee=None,   # record is deleted
            priority="medium",
            metadata={
                "emp_id": instance.emp_id,
                "department": department_name,
                "auto_generated": True,
            },
        )


@receiver(post_save, sender=Score)
def notify_test_assigned_and_completed(sender, instance, created, **kwargs):
    logger.info(f"Signal triggered for Score, employee={instance.employee.emp_id}, created={created}")
    try:
        admin_users = get_admin_users()
        test_name = instance.test.test_name if instance.test else "Test"
        full_name = f"{instance.employee.first_name} {instance.employee.last_name or ''}".strip()
        
        if created:
            for admin in admin_users:
                logger.info(f"Notifying admin: {admin.email}")
                create_notification(
                    title="Test Assigned",
                    message=f"Test '{test_name}' has been assigned to {full_name}.",
                    notification_type='test_assigned',
                    recipient=admin,
                    employee=instance.employee,
                    priority='medium',
                    metadata={
                        'test_name': test_name,
                        'test_id': instance.test.key_id if instance.test else None,
                        'emp_id': instance.employee.emp_id,
                        'level': str(instance.level) if instance.level else None,
                        'skill': str(instance.skill) if instance.skill else None,
                        'auto_generated': True
                    }
                )
        else:
            if instance.passed is not None:
                status = "Passed" if instance.passed else "Failed"
                priority = 'high' if not instance.passed else 'medium'
                
                for admin in admin_users:
                    logger.info(f"Notifying admin: {admin.email}")
                    create_notification(
                        title="Evaluation Completed",
                        message=f"{full_name} completed evaluation with {instance.percentage}% ({status}).",
                        notification_type='evaluation_completed',
                        recipient=admin,
                        employee=instance.employee,
                        priority=priority,
                        metadata={
                            'test_id': instance.test.key_id if instance.test else None,
                            'emp_id': instance.employee.emp_id,
                            'marks': instance.marks,
                            'percentage': str(instance.percentage),
                            'passed': instance.passed,
                            'auto_generated': True
                        }
                    )

                user = get_employee_user(instance.employee)
                if user:
                    logger.info(f"Notifying employee: {user.email}")
                    create_notification(
                        title="Your Evaluation Results",
                        message=f"You scored {instance.percentage}% ({status}).",
                        notification_type='evaluation_completed',
                        recipient=user,
                        employee=instance.employee,
                        priority=priority,
                        metadata={
                            'test_id': instance.test.key_id if instance.test else None,
                            'marks': instance.marks,
                            'percentage': str(instance.percentage),
                            'passed': instance.passed,
                            'auto_generated': True
                        }
                    )
    except Exception as e:
        logger.error(f"Error creating test notification: {str(e)}")
        
@receiver(post_save, sender=Schedule)
def notify_refresher_completed(sender, instance, created, **kwargs):
    """Send ONLY completed notification. No scheduled notification here."""

    try:
        admin_users = get_admin_users()
        training_name = instance.training_name.topic if instance.training_name else "Training"

        # ONLY Completed notification
        if instance.status.lower() == "completed":
            employee_count = instance.employees.count()

            for admin in admin_users:
                create_notification(
                    title="Refresher Training Completed",
                    message=(
                        f"Refresher Training '{training_name}' has been completed "
                        f"by {employee_count} employees."
                    ),
                    notification_type="refresher_training_completed",
                    recipient=admin,
                    priority="medium",
                    metadata={
                        "schedule_id": instance.id,
                        "training_name": training_name,
                        "employee_count": employee_count,
                        "auto_generated": True,
                    },
                )

    except Exception as e:
        print(f"❌ Refresher Notification Error: {str(e)}")


from django.db.models.signals import m2m_changed
from django.dispatch import receiver
@receiver(m2m_changed, sender=Schedule.employees.through)
def notify_refresher_scheduled(sender, instance, action, **kwargs):
    """Send ONE notification after employees are added."""

    if action != "post_add":
        return

    try:
        admin_users = get_admin_users()
        
        # Get category name
        category_name = instance.training_category.name if instance.training_category else "Training"
        
        # Get topic names
        topic_names = list(instance.topics.values_list('topic', flat=True))
        topics_str = ", ".join(topic_names) if topic_names else "No topics"
        
        venue_name = instance.venue.name if instance.venue else "TBD"
        trainer_name = instance.trainer.name if instance.trainer else "TBD"
        employee_count = instance.employees.count()

        # Check if notification already exists
        if Notification.objects.filter(
            notification_type="refresher_training_scheduled",
            metadata__schedule_id=instance.id
        ).exists():
            return

        # Create notification for each admin
        for admin in admin_users:
            create_notification(
                title="Refresher Training Scheduled",
                message=(
                    f"{category_name}: '{topics_str}' scheduled for "
                    f"{employee_count} employees on {instance.date} at {instance.time}. "
                    f"Trainer: {trainer_name}, Venue: {venue_name}"
                ),
                notification_type="refresher_training_scheduled",
                recipient=admin,
                priority="medium",
                metadata={
                    "schedule_id": instance.id,
                    "category_name": category_name,
                    "topic_names": topic_names,
                    "trainer_name": trainer_name,
                    "employee_count": employee_count,
                    "venue": venue_name,
                    "date": instance.date.isoformat() if instance.date else None,
                    "time": str(instance.time) if instance.time else None,
                    "auto_generated": True,
                },
            )
        
        print(f"✅ Notification created: {category_name} - {employee_count} employees")
        
    except Exception as e:
        print(f"❌ Refresher Notification Error: {e}")
        import traceback
        traceback.print_exc()

        
#new one 
# @receiver(post_save, sender=Schedule)
# def notify_training_scheduled(sender, instance, created, **kwargs):
#     """Notify when training is scheduled, rescheduled, or completed"""
#     try:
#         admin_users = get_admin_users()
#         training_name = str(instance.training_name.topic if instance.training_name else "Training")
#         venue_name = instance.venue.name if instance.venue else "TBD"
#         is_refresher = 'refresher' in training_name.lower()
#         employee_count = instance.employees.count()

#         if created:
#             notification_type = 'refresher_training_scheduled' if is_refresher else 'training_scheduled'
#             title = "Refresher Training Scheduled" if is_refresher else "Training Scheduled"
#             message = f"{title.replace('Scheduled', '')} '{training_name}' has been scheduled for {employee_count} employees on {instance.date} at {instance.time}."
            
#             for admin in admin_users:
#                 create_notification(
#                     title=title,
#                     message=message,
#                     notification_type=notification_type,
#                     recipient=admin,
#                     training_schedule=instance,
#                     priority='medium',
#                     metadata={
#                         'date': instance.date.isoformat() if instance.date else None,
#                         'time': str(instance.time) if instance.time else None,
#                         'venue': venue_name,
#                         'training_name': training_name,
#                         'employee_count': employee_count,
#                         'training_type': 'refresher' if is_refresher else 'regular',
#                         'auto_generated': True
#                     }
#                 )
#         else:
#             if instance.status == 'completed':
#                 notification_type = 'refresher_training_completed' if is_refresher else 'training_completed'
#                 title = "Refresher Training Completed" if is_refresher else "Training Completed"
#                 message = f"{title} '{training_name}' has been completed by {employee_count} employees."
                
#                 for admin in admin_users:
#                     create_notification(
#                         title=title,
#                         message=message,
#                         notification_type=notification_type,
#                         recipient=admin,
#                         training_schedule=instance,
#                         priority='medium',
#                         metadata={
#                             'training_name': training_name,
#                             'employee_count': employee_count,
#                             'training_type': 'refresher' if is_refresher else 'regular',
#                             'auto_generated': True
#                         }
#                     )
#     except Exception as e:
#         print(f"❌ Error creating training notification: {str(e)}")


@receiver(post_save, sender=MachineAllocation)
def notify_machine_allocation(sender, instance, created, **kwargs):
    """
    Notify when a machine allocation is created.
    """
    if not created:
        return

    skill_entry = instance.employee
    employee = getattr(skill_entry, "employee", None)
    full_name = skill_entry.employee_name or (
        f"{employee.first_name} {employee.last_name}".strip() if employee else ""
    )
    emp_id = skill_entry.emp_id
    status_display = instance.get_approval_status_display()

    admin_users = get_admin_users()

    # 1️⃣ Admin Notification
    for admin in admin_users:
        notif = create_notification(
            title="Machine Allocated",
            message=(
                f"Machine '{instance.machine.name}' has been allocated to "
                f"{full_name} (ID: {emp_id}) with status: {status_display}."
            ),
            notification_type="machine_allocated",
            recipient=admin,
            employee=employee,
            priority="medium",
            metadata={
                "machine": instance.machine.name,
                "emp_id": emp_id,
                "approval_status": instance.approval_status,
                "auto_generated": True,
            },
        )

        # FIX → attach FK manually
        if notif:
            notif.machine_allocation = instance
            notif.save(update_fields=["machine_allocation"])

    # 2️⃣ Employee Notification
    user = get_employee_user(employee) if employee else None

    if user:
        notif = create_notification(
            title="Machine Allocation Update",
            message=(
                f"Machine '{instance.machine.name}' has been allocated to you. "
                f"Status: {status_display}."
            ),
            notification_type="machine_allocated",
            recipient=user,
            employee=employee,
            priority="low",
            metadata={
                "machine": instance.machine.name,
                "approval_status": instance.approval_status,
                "auto_generated": True,
            },
        )

        if notif:
            notif.machine_allocation = instance
            notif.save(update_fields=["machine_allocation"])




@receiver(post_save, sender=HanchouExamResult)
def notify_hanchou_exam_completed(sender, instance, created, **kwargs):
    """Notify when Hanchou exam is completed"""
    if not created and instance.submitted_at:
        admin_users = get_admin_users()
        status = "Passed" if instance.passed else "Failed"
        priority = 'high' if not instance.passed else 'medium'
        
        for admin in admin_users:
            create_notification(
                title="Hanchou Exam Completed",
                message=f"{instance.employee.first_name} {instance.employee.last_name} completed Hanchou exam with {instance.percentage}% ({status}).",
                notification_type='hanchou_exam_completed',
                recipient=admin,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'score': instance.score,
                    'total_questions': instance.total_questions,
                    'percentage': float(instance.percentage),
                    'passed': instance.passed,
                    'auto_generated': True
                }
            )

        user = get_employee_user(instance.employee)
        if user:
            create_notification(
                title="Your Hanchou Exam Results",
                message=f"You scored {instance.percentage}% on Hanchou exam ({status}).",
                notification_type='hanchou_exam_completed',
                recipient=user,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'percentage': float(instance.percentage),
                    'passed': instance.passed,
                    'auto_generated': True
                }
            )


@receiver(post_save, sender=ShokuchouExamResult)
def notify_shokuchou_exam_completed(sender, instance, created, **kwargs):
    """Notify when Shokuchou exam is completed"""
    if not created and instance.sho_submitted_at:
        admin_users = get_admin_users()
        status = "Passed" if instance.sho_passed else "Failed"
        priority = 'high' if not instance.sho_passed else 'medium'
        
        for admin in admin_users:
            create_notification(
                title="Shokuchou Exam Completed",
                message=f"{instance.employee.first_name} {instance.employee.last_name} completed Shokuchou exam with {instance.sho_percentage}% ({status}).",
                notification_type='shokuchou_exam_completed',
                recipient=admin,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'score': instance.sho_score,
                    'total_questions': instance.sho_total_questions,
                    'percentage': float(instance.sho_percentage),
                    'passed': instance.sho_passed,
                    'auto_generated': True
                }
            )

        user = get_employee_user(instance.employee)
        if user:
            create_notification(
                title="Your Shokuchou Exam Results",
                message=f"You scored {instance.sho_percentage}% on Shokuchou exam ({status}).",
                notification_type='shokuchou_exam_completed',
                recipient=user,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'percentage': float(instance.sho_percentage),
                    'passed': instance.sho_passed,
                    'auto_generated': True
                }
            )


@receiver(post_save, sender=OperatorPerformanceEvaluation)
def notify_ten_cycle_evaluation_completed(sender, instance, created, **kwargs):
    """Notify when 10-cycle evaluation is completed"""
    if not created and instance.is_completed:
        admin_users = get_admin_users()
        status = instance.final_status
        priority = 'high' if 'Fail' in status else 'medium'
        
        for admin in admin_users:
            create_notification(
                title="10 Cycle Evaluation Completed",
                message=f"{instance.employee.first_name} {instance.employee.last_name} completed 10-cycle evaluation with {instance.final_percentage}% ({status}).",
                notification_type='ten_cycle_evaluation_completed',
                recipient=admin,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'percentage': instance.final_percentage,
                    'status': status,
                    'station': str(instance.station) if instance.station else None,
                    'level': instance.level.level_name if instance.level else None,
                    'auto_generated': True
                }
            )

        user = get_employee_user(instance.employee)
        if user:
            create_notification(
                title="Your 10-Cycle Evaluation Results",
                message=f"You achieved {instance.final_percentage}% in 10-cycle evaluation ({status}).",
                notification_type='ten_cycle_evaluation_completed',
                recipient=user,
                employee=instance.employee,
                priority=priority,
                metadata={
                    'percentage': instance.final_percentage,
                    'status': status,
                    'level': instance.level.level_name if instance.level else None,
                    'auto_generated': True
                }
            )

# @receiver(post_save, sender=TraineeInfo)
# def notify_ojt_completed(sender, instance, created, **kwargs):
#     """
#     Notify when OJT is completed (status becomes Pass).
#     """
#     # Only trigger when updated, not created
#     if instance.status != "Pass":
#         return

#     # Prevent duplicate notifications
#     if Notification.objects.filter(
#         notification_type="ojt_completed",
#         metadata__emp_id=instance.emp_id,
#         metadata__station=instance.station.station_name if instance.station else None
#     ).exists():
#         return

#     employee = MasterTable.objects.filter(emp_id=instance.emp_id).first()
#     user = get_employee_user(employee) if employee else None
#     admin_users = get_admin_users()

#     # Notify admins
#     for admin in admin_users:
#         create_notification(
#             title="OJT Completed",
#             message=f"{instance.trainee_name} has completed OJT at station {instance.station}.",
#             notification_type="ojt_completed",
#             recipient=admin,
#             employee=employee,
#             priority="medium",
#             metadata={
#                 "emp_id": instance.emp_id,
#                 "station": instance.station.station_name if instance.station else None,
#                 "status": instance.status,
#                 "auto_generated": True,
#             }
#         )

#     # Notify employee
#     if user:
#         create_notification(
#             title="Your OJT is Completed",
#             message=f"You have successfully completed OJT at station {instance.station}.",
#             notification_type="ojt_completed",
#             recipient=user,
#             employee=employee,
#             priority="low",
#             metadata={
#                 "station": instance.station.station_name if instance.station else None,
#                 "status": instance.status,
#                 "auto_generated": True,
#             }
#         )


@receiver(post_save, sender=TraineeInfo)
def notify_ojt_completed(sender, instance, created, **kwargs):
    """
    Notify when OJT is completed (status becomes Pass).
    """

    if instance.status not in ["Pass", "Fail"]:
        return

    # Avoid duplicate notifications
    if Notification.objects.filter(
        notification_type="ojt_completed",
        metadata__emp_id=instance.emp_id,
        metadata__station=instance.station.station_name if instance.station else None,
        metadata__level=instance.level.level_name if instance.level else None,
    ).exists():
        return

    employee = MasterTable.objects.filter(emp_id=instance.emp_id).first()
    user = get_employee_user(employee) if employee else None
    admin_users = get_admin_users()

    level_name = instance.level.level_name if instance.level else "Unknown Level"
    station_name = instance.station.station_name if instance.station else "Unknown Station"
    status = instance.status

    # 🔹 Notify Admins
    for admin in admin_users:
        create_notification(
            title="OJT Completed",
            message=(
                f"{instance.trainee_name} has completed OJT at {station_name} "
                f"for {level_name}. Status: {status}."
            ),
            notification_type="ojt_completed",
            recipient=admin,
            employee=employee,
            priority="medium",
            metadata={
                "emp_id": instance.emp_id,
                "station": station_name,
                "level": level_name,
                "status": status,
                "auto_generated": True,
            }
        )

    # 🔹 Notify Employee
    if user:
        create_notification(
            title="Your OJT is Completed",
            message=(
                f"You have successfully completed OJT at {station_name} "
                f"for {level_name}. Status: {status}."
            ),
            notification_type="ojt_completed",
            recipient=user,
            employee=employee,
            priority="low",
            metadata={
                "station": station_name,
                "level": level_name,
                "status": status,
                "auto_generated": True,
            }
        )

        
@receiver(post_save, sender=OJTLevel2Quantity)
def notify_ojt_quantity_completed(sender, instance, created, **kwargs):
    """Notify when OJT Quantity is completed"""

    if not created and instance.status in ['Pass', 'Fail']:
        admin_users = get_admin_users()
        priority = 'high' if instance.status == 'Fail' else 'medium'
        employee = instance.employee if hasattr(instance, 'employee') else None
        
        trainee_name = instance.trainee_name or "Unknown Trainee"
        level_name = instance.level.level_name if instance.level else "Unknown Level"

        # ---------- ADMIN NOTIFICATION ----------
        for admin in admin_users:
            create_notification(
                title="OJT Quantity Completed",
                message=(
                    f"{trainee_name} (ID: {instance.trainee_id}) completed OJT Quantity "
                    f"for **{level_name}** with status: {instance.status}."
                ),
                notification_type='ojt_quantity_completed',
                recipient=admin,
                employee=employee,
                level=instance.level,
                priority=priority,
                metadata={
                    'status': instance.status,
                    'station': instance.station_name,
                    'process': instance.process_name,
                    'trainee_id': instance.trainee_id,
                    'level': level_name,
                    'auto_generated': True
                }
            )

        # ---------- EMPLOYEE NOTIFICATION ----------
        if employee:
            user = get_employee_user(employee)
            if user:
                create_notification(
                    title="Your OJT Quantity Results",
                    message=(
                        f"Your OJT Quantity evaluation for **{level_name}** "
                        f"is completed with status: {instance.status}."
                    ),
                    notification_type='ojt_quantity_completed',
                    recipient=user,
                    employee=employee,
                    priority=priority,
                    metadata={
                        'status': instance.status,
                        'station': instance.station_name,
                        'level': level_name,
                        'auto_generated': True
                    }
                )


# @receiver(post_save, sender=OJTLevel2Quantity)
# def notify_ojt_quantity_completed(sender, instance, created, **kwargs):
#     """Notify when OJT Quantity is completed"""
#     if not created and instance.status in ['Pass', 'Fail']:
#         admin_users = get_admin_users()
#         priority = 'high' if instance.status == 'Fail' else 'medium'
#         employee = instance.employee if hasattr(instance, 'employee') else None
#         trainee_name = instance.trainee_name or "Unknown Trainee"
        
#         for admin in admin_users:
#             create_notification(
#                 title="OJT Quantity Completed",
#                 message=f"{trainee_name} (ID: {instance.trainee_id}) completed OJT Quantity with status: {instance.status}.",
#                 notification_type='ojt_quantity_completed',
#                 recipient=admin,
#                 employee=employee,
#                 level=instance.level,
#                 priority=priority,
#                 metadata={
#                     'status': instance.status,
#                     'station': instance.station_name,
#                     'process': instance.process_name,
#                     'trainee_id': instance.trainee_id,
#                     'auto_generated': True
#                 }
#             )

#         if employee:
#             user = get_employee_user(employee)
#             if user:
#                 create_notification(
#                     title="Your OJT Quantity Results",
#                     message=f"Your OJT Quantity evaluation completed with status: {instance.status}.",
#                     notification_type='ojt_quantity_completed',
#                     recipient=user,
#                     employee=employee,
#                     priority=priority,
#                     metadata={
#                         'status': instance.status,
#                         'station': instance.station_name,
#                         'auto_generated': True
#                     }
#                 )
@receiver(post_save, sender=RetrainingSession)
def notify_retraining_scheduled_and_completed(sender, instance, created, **kwargs):
    """Notify when retraining is scheduled or completed"""

    # ==========================================================
    # 🔹 Case 1 — RETRAINING SCHEDULED (created == True)
    # ==========================================================
    if created:
        admin_users = get_admin_users()
        employee = instance.employee
        user = get_employee_user(employee)

        for admin in admin_users:
            create_notification(
                title="Retraining Scheduled",
                message=(
                    f"Retraining scheduled for {employee.first_name} {employee.last_name} "
                    f"on {instance.scheduled_date} at {instance.scheduled_time}."
                ),
                notification_type='retraining_scheduled',
                recipient=admin,
                employee=employee,
                priority='medium',
                metadata={
                    'session_id': instance.id,
                    'evaluation_type': instance.evaluation_type,
                    'level': str(instance.level),
                    'attempt_no': instance.attempt_no,
                    'venue': instance.venue,
                    'auto_generated': True,
                }
            )

        if user:
            create_notification(
                title="Retraining Scheduled",
                message=(
                    f"Your retraining is scheduled for {instance.scheduled_date} at "
                    f"{instance.scheduled_time} ({instance.evaluation_type})."
                ),
                notification_type='retraining_scheduled',
                recipient=user,
                employee=employee,
                priority='medium',
                metadata={
                    'session_id': instance.id,
                    'venue': instance.venue,
                    'evaluation_type': instance.evaluation_type,
                    'auto_generated': True,
                }
            )

    # ==========================================================
    # 🔹 Case 2 — RETRAINING COMPLETED (updated with status=Completed)
    # ==========================================================
    else:
        if instance.status == 'Completed':
            admin_users = get_admin_users()
            employee = instance.employee

            for admin in admin_users:
                create_notification(
                    title="Retraining Completed",
                    message=(
                        f"Retraining completed for {employee.first_name} {employee.last_name} "
                        f"with {instance.performance_percentage}%."
                    ),
                    notification_type='retraining_completed',
                    recipient=admin,
                    employee=employee,
                    priority='medium',
                    metadata={
                        'session_id': instance.id,
                        'performance_percentage': instance.performance_percentage,
                        'required_percentage': instance.required_percentage,
                        'auto_generated': True,
                    }
                )

@receiver(post_save, sender=HumanBodyCheckSheet)
def notify_human_body_check_completed(sender, instance, created, **kwargs):
    """
    Create notification when a Human Body Check session becomes ELIGIBLE / NOT_ELIGIBLE.
    This runs whenever an answer row is saved.
    """
    session = instance.session  # FK from answer row to session

    # Use the property that calculates status from all answers
    status = (session.overall_status or "").upper()

    # Still pending? Then don't notify yet
    if status == "PENDING" or not status:
        return

    # If we already created a notification for this session, don't create again
    if Notification.objects.filter(
        notification_type="human_body_check_completed",
        metadata__session_id=session.id,   # CHECK using metadata since no FK field exists
    ).exists():
        return

    # Decide priority
    priority = "high" if status in ["FAIL", "NOT_ELIGIBLE"] else "medium"

    # ------------------------------------------
    # BUILD EMPLOYEE NAME + TEMP ID DISPLAY TEXT
    # ------------------------------------------
    employee_name = None
    if session.user:
        first = session.user.first_name or ""
        last = session.user.last_name or ""
        employee_name = f"{first} {last}".strip()

    # Build final display name
    if employee_name:
        display_name = f"{employee_name} ({session.temp_id})"
    else:
        display_name = session.temp_id

    # ------------------------------------------
    # RESOLVE EMPLOYEE (USER MODEL)
    # ------------------------------------------
    user = None
    if session.user and session.user.email:
        try:
            user = User.objects.get(email=session.user.email)
        except User.DoesNotExist:
            user = None

    # ------------------------------------------
    # SEND NOTIFICATION TO ADMINS
    # ------------------------------------------
    admin_users = get_admin_users()  # you already have this helper

    for admin in admin_users:
        create_notification(
            title="Human Body Check Completed",
            message=f"Human body check for {display_name} completed with status: {status}.",
            notification_type="human_body_check_completed",
            recipient=admin,
            priority=priority,
            metadata={
                "status": status,
                "temp_id": session.temp_id,
                "session_id": session.id,
                "auto_generated": True,
            },
        )

    # ------------------------------------------
    # SEND NOTIFICATION TO EMPLOYEE (IF EXISTS)
    # ------------------------------------------
    if user:
        create_notification(
            title="Your Human Body Check Results",
            message=f"Your human body check ({session.temp_id}) status: {status}.",
            notification_type="human_body_check_completed",
            recipient=user,
            priority=priority,
            metadata={
                "status": status,
                "session_id": session.id,
                "auto_generated": True,
            },
        )



from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MultiSkilling


@receiver(post_save, sender=MultiSkilling)
def notify_multiskilling(sender, instance, created, **kwargs):
    """
    Notify when multiskilling is scheduled or completed
    """
    admin_users = get_admin_users()
    employee = instance.employee
    full_name = f"{employee.first_name} {employee.last_name}".strip()

    # 1️⃣ MULTISKILLING SCHEDULED
    if created:
        for admin in admin_users:
            create_notification(
                title="Multiskilling Scheduled",
                message=f"Multiskilling for {full_name} at station '{instance.station}' has been scheduled for {instance.start_date}.",
                notification_type="multiskilling_scheduled",
                recipient=admin,
                employee=employee,
                priority="medium",
                metadata={
                    "station": instance.station.station_name if instance.station else None,
                    "level": instance.skill_level.level_name,
                    "start_date": str(instance.start_date),
                    "auto_generated": True
                }
            )

        # Send to employee (optional)
        user = get_employee_user(employee)
        if user:
            create_notification(
                title="Multiskilling Scheduled",
                message=f"Your multiskilling session is scheduled for {instance.start_date}.",
                notification_type="multiskilling_scheduled",
                recipient=user,
                employee=employee,
                priority="low",
                metadata={
                    "station": instance.station.station_name if instance.station else None,
                    "level": instance.skill_level.level_name,
                    "auto_generated": True
                }
            )
        return

    # 2️⃣ MULTISKILLING COMPLETED
    # using your computed logic from serializer: skill matrix row exists → completed
    current_status = instance.current_status

    if current_status == "completed":
        for admin in admin_users:
            create_notification(
                title="Multiskilling Completed",
                message=f"{full_name} has completed multiskilling for station '{instance.station}'.",
                notification_type="multiskilling_completed",
                recipient=admin,
                employee=employee,
                priority="medium",
                metadata={
                    "station": instance.station.station_name if instance.station else None,
                    "level": instance.skill_level.level_name,
                    "auto_generated": True
                }
            )

        user = get_employee_user(employee)
        if user:
            create_notification(
                title="Your Multiskilling Completed",
                message=f"You have completed multiskilling for station '{instance.station}'.",
                notification_type="multiskilling_completed",
                recipient=user,
                employee=employee,
                priority="medium",
                metadata={
                    "station": instance.station.station_name if instance.station else None,
                    "auto_generated": True
                }
            )

@receiver(post_save, sender=SkillMatrix)
def notify_skill_matrix_updated(sender, instance, created, **kwargs):
    employee = instance.employee
    admin_users = get_admin_users()
    level_name = instance.level.level_name
    station_name = instance.hierarchy.station.station_name if instance.hierarchy.station else "Unknown Station"

    if created:
        title = "Skill Matrix Entry Added"
        notification_type = "skill_matrix_updated"
        message = (
            f"{employee.first_name} {employee.last_name} has been added to the Skill Matrix "
            f"at {station_name} with Level {level_name}."
        )
    else:
        title = "Skill Level Upgraded"
        notification_type = "skill_matrix_updated"
        message = (
            f"{employee.first_name} {employee.last_name}'s skill level for {station_name} "
            f"has been upgraded to {level_name}."
        )

    # Notify admins
    for admin in admin_users:
        create_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            recipient=admin,
            employee=employee,
            priority="medium",
            metadata={
                "emp_id": employee.emp_id,
                "level": level_name,
                "station": station_name,
                "auto_generated": True,
            }
        )

    # Notify employee
    user = get_employee_user(employee)
    if user:
        create_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            recipient=user,
            employee=employee,
            priority="low",
            metadata={
                "level": level_name,
                "station": station_name,
                "auto_generated": True,
            }
        )






# @receiver(post_save, sender=ProductionPlan)
# def notify_production_milestone(sender, instance, created, **kwargs):
#     """Notify when production milestone is reached"""
#     if not created and instance.total_production_actual >= instance.total_production_plan:
#         admin_users = get_admin_users()
        
#         for admin in admin_users:
#             create_notification(
#                 title="Production Milestone Reached",
#                 message=f"Production plan milestone reached for {instance.month} {instance.year}: Actual {instance.total_production_actual} >= Planned {instance.total_production_plan}.",
#                 notification_type='milestone_reached',
#                 recipient=admin,
#                 priority='high',
#                 metadata={
#                     'month': instance.month,
#                     'year': instance.year,
#                     'actual': instance.total_production_actual,
#                     'planned': instance.total_production_plan,
#                     'auto_generated': True
#                 }
#             )


@receiver(post_save, sender=Notification)
def cleanup_old_notifications(sender, instance, created, **kwargs):
    """Clean up old notifications to prevent database bloat"""
    if created and instance.recipient:
        try:
            old_notifications = Notification.objects.filter(
                recipient=instance.recipient
            ).order_by('-created_at')[100:]
            
            if old_notifications:
                Notification.objects.filter(
                    id__in=[n.id for n in old_notifications]
                ).delete()
        except Exception as e:
            print(f"❌ Error cleaning up old notifications: {str(e)}")       
        




# import threading
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Score, SkillMatrix, HierarchyStructure


# # ----------------------------------------
# # Helper: Run function after a delay
# # ----------------------------------------
# def run_after_delay(func, delay, *args, **kwargs):
#     """Run a function after N seconds without blocking request"""
#     timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
#     timer.start()


# # ----------------------------------------
# # Core logic: create/update SkillMatrix
# # ----------------------------------------
# def process_score_for_skillmatrix(score):
#     """
#     ✅ Create/Update SkillMatrix if:
#       - skill = General
#       - level = Level 1
#     """
#     if not score.skill or not score.level:
#         return

#     if score.skill.station_name != "General":
#         return

#     if score.level.level_name != "Level 1":
#         return

#     employee = score.employee

#     try:
#         # ✅ Find hierarchy for this station
#         hierarchy = HierarchyStructure.objects.filter(station=score.skill).first()
#         if not hierarchy:
#             print(f"[SkillMatrix][ERROR] No hierarchy found for station={score.skill}")
#             return

#         # ✅ Create or update SkillMatrix
#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             hierarchy=hierarchy,
#             level=score.level,
#             defaults={
#                 "employee_name": employee.emp_name,   # adjust if field name differs
#                 "emp_id": employee.emp_id,
#                 "doj": employee.doj,
#             },
#         )

#         if created:
#             print(f"[SkillMatrix] ✅ Created for {employee.emp_id} ({employee.emp_name}) at {hierarchy.station}")
#         else:
#             print(f"[SkillMatrix] 🔄 Updated for {employee.emp_id} ({employee.emp_name}) at {hierarchy.station}")

#     except Exception as e:
#         print(f"[SkillMatrix][ERROR] Failed for Score ID={score.id}: {e}")


# # ----------------------------------------
# # Signal: when Score is saved
# # ----------------------------------------
# @receiver(post_save, sender=Score)
# def create_skill_matrix_from_score(sender, instance, **kwargs):
#     print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
#           f"Skill={instance.skill}, Level={instance.level}")

#     # ✅ Run with 5s delay
#     run_after_delay(process_score_for_skillmatrix, 5, instance)


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SkillMatrix, MachineAllocation

@receiver(post_save, sender=SkillMatrix)
def update_allocation_status_on_level_change(sender, instance, created, **kwargs):
    """
    Signal to update allocation status when an employee's level changes
    """
    if not created:  # Only for updates, not new creations
        # Get all pending allocations for this employee
        pending_allocations = MachineAllocation.objects.filter(
            employee=instance,
            approval_status='pending'
        )
        
        for allocation in pending_allocations:
            try:
                employee_level_value = instance.level.level_id
                machine_level_value = allocation.machine.level
                
                # Check if employee now meets the machine level requirement
                if employee_level_value >= machine_level_value:
                    allocation.approval_status = 'approved'
                    allocation.save()
                    print(f"Auto-approved allocation: {allocation}")
                    
            except (ValueError, AttributeError) as e:
                print(f"Error updating allocation {allocation.id}: {e}")
                continue



from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SkillMatrix, MultiSkilling

@receiver(post_save, sender=SkillMatrix)
def mark_multiskilling_completed(sender, instance, **kwargs):
    """
    Whenever a SkillMatrix entry is saved, check if there is a scheduled MultiSkilling
    for the same employee + station + skill_level, and mark it as completed.
    """
    employee = instance.employee
    station = getattr(instance.hierarchy, "station", None)
    level = instance.level  

    if not station or not level:
        return  

    MultiSkilling.objects.filter(
        employee=employee,
        station=station,
        skill_level=level
    ).exclude(status="completed").update(status="completed")



####---------Level 1 setup Global--------------------
#STANDARD_JR0001
import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Score, SkillMatrix, HierarchyStructure, Station, Level, MasterTable 
import logging

logger = logging.getLogger(__name__)

# ----------------------------------------
# Helper: Run function after a delay
# ----------------------------------------
def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()

# ----------------------------------------
# Core logic: create/update SkillMatrix (GLOBAL LOGIC)
# ----------------------------------------
def process_score_for_skillmatrix(score_id):
    """
    Updates the SkillMatrix for all existing stations if a passing Level 1 score is saved.
    This executes the global Level 1 certification.
    """
    try:
        # Fetch the score object within the thread
        score = Score.objects.select_related('employee', 'level', 'skill').get(pk=score_id)
    except Score.DoesNotExist:
        logger.error(f"[SkillMatrix][ERROR] Score ID={score_id} not found.")
        return

    # 1. Check if the criteria for global update is met (Level 1 and Passed)
    is_level_1 = score.level and (score.level.level_name.lower() == 'level 1' or str(score.level.pk) == '1')

    if not is_level_1 or not score.passed:
        # Only proceed for passing Level 1 scores
        return

    employee = score.employee
    level_1_object = score.level # Use the Level 1 object instance

    # 2. Determine target stations (Target ALL existing stations)
    try:
        # ⭐ FIX: Fetch ALL stations, no exclusion for 'General' or any other specific station. ⭐
        target_stations_qs = Station.objects.all().distinct()
    except Exception as e:
        logger.error(f"[SkillMatrix][ERROR] Failed to fetch target stations: {e}")
        return

    if not target_stations_qs.exists():
        logger.warning("[SkillMatrix][WARNING] No stations found in the system to update.")
        return

    # 3. Perform atomic updates for the employee's SkillMatrix
    with transaction.atomic():
        updated_count = 0
        for target_station in target_stations_qs:
            
            # Find the hierarchy for the target station (required by SkillMatrix model)
            hierarchy = HierarchyStructure.objects.filter(station=target_station).first()
            if not hierarchy:
                logger.warning(f"[SkillMatrix][WARNING] No hierarchy found for station={target_station.station_name}. Skipping.")
                continue

            # Update/Create SkillMatrix entry for this specific station
            obj, created = SkillMatrix.objects.update_or_create(
                employee=employee,
                hierarchy=hierarchy,
                defaults={
                    # Set the level to the Level 1 object instance
                    "level": level_1_object, 
                    "employee_name": employee.first_name,
                    "emp_id": employee.emp_id,
                    "doj": getattr(employee, 'date_of_joining', None), 
                },
            )

            updated_count += 1
            if created:
                 logger.info(f"[SkillMatrix] ✅ Created Level 1 for {employee.emp_id} at {target_station.station_name}")
            else:
                 logger.info(f"[SkillMatrix] 🔄 Updated Level 1 for {employee.emp_id} at {target_station.station_name}")


    logger.info(f"[SkillMatrix] ⭐ Global Level 1 update completed for {employee.emp_id}. Total stations updated: {updated_count}")
    return updated_count


# ----------------------------------------
# Signal: when Score is saved
# ----------------------------------------
@receiver(post_save, sender=Score)
def update_skill_matrix_from_score(sender, instance, **kwargs):
    """
    Triggers the skill matrix update after a Score object is saved, 
    if it's a passing Level 1 score.
    """
    is_level_1 = instance.level and (instance.level.level_name.lower() == 'level 1' or str(instance.level.pk) == '1')
    
    # We only need to check if the score is Level 1 and Passed, 
    # regardless of which specific station this score object belongs to.
    if is_level_1 and instance.passed:
        logger.info(f"[Signal][Score] Detected PASSING Level 1 Score (ID={instance.pk}). Triggering global SkillMatrix update.")
        # Pass the primary key (PK) for safer fetching inside the delayed thread
        run_after_delay(process_score_for_skillmatrix, 5, instance.pk)
    else:
        logger.info(f"[Signal][Score] Score saved (ID={instance.pk}). Not a passing Level 1 score, skipping global update.")

#STANDARD_JR0001
####---------Level 1 setup Global End--------------------


#10 cycle + Evaluation










import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    Score,
    SkillMatrix,
    MasterTable,
    Station,
    HierarchyStructure,
    OperatorPerformanceEvaluation,
)


# ----------------------------------------
# Helper: Run after delay
# ----------------------------------------
def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# ----------------------------------------
# Core logic: update SkillMatrix
# ----------------------------------------
def process_skill_matrix_update(employee, station, level, verbose=True):
    """
    ✅ Update SkillMatrix when BOTH:
      - OperatorPerformanceEvaluation = Pass
      - Score = Passed
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # -------------------------
    # Check Operator Performance Evaluation
    # -------------------------
    eval_exists = OperatorPerformanceEvaluation.objects.filter(
        employee=employee,
        station=station,
        level=level,
        final_status="Pass"
    ).exists()

    if verbose:
        print(f"[SkillMatrix] OperatorPerformanceEvaluation Pass = {eval_exists}")

    # -------------------------
    # Check Score (Evaluation test)
    # -------------------------
    score_pass = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()

    if verbose:
        print(f"[SkillMatrix] Score passed = {score_pass}")

    # -------------------------
    # Update SkillMatrix if both true
    # -------------------------
    if eval_exists and score_pass:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
            hierarchy=hierarchy,
            defaults={
                "employee_name": employee.first_name,   # from MasterTable
                "emp_id": employee.emp_id,
                "doj": employee.date_of_joining,                  # from MasterTable
                # "hierarchy": hierarchy,
                "level":level,
            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ Created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 Updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → EvalModel: {eval_exists}, Score: {score_pass}")

    if verbose:
        print("=" * 80)


# ----------------------------------------
# Signal for Score
# ----------------------------------------
@receiver(post_save, sender=Score)
def trigger_skillmatrix_from_score(sender, instance, **kwargs):
    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
          f"Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")

    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    run_after_delay(process_skill_matrix_update, 5, instance.employee, instance.skill, instance.level, True)


# ----------------------------------------
# Signal for OperatorPerformanceEvaluation
# ----------------------------------------
@receiver(post_save, sender=OperatorPerformanceEvaluation)
def trigger_skillmatrix_from_performance_eval(sender, instance, **kwargs):
    print(f"[Signal][OperatorPerformanceEvaluation] Saved → Employee {instance.employee.emp_id}, "
          f"Station={instance.station}, Level={instance.level}, Status={instance.final_status}")

    run_after_delay(process_skill_matrix_update, 5, instance.employee, instance.station, instance.level, True)

















#Quantity OJT + Evaluation

import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Score, SkillMatrix, MasterTable, Station, HierarchyStructure, OJTLevel2Quantity


# ----------------------------------------
# Helper: Run function after a delay
# ----------------------------------------
def delayed_run(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# ----------------------------------------
# Core logic: Update SkillMatrix
# ----------------------------------------
def update_skillmatrix_record(employee, station, level, verbose=True):
    """
    Update SkillMatrix when:
      - OJTLevel2Quantity.status = 'Pass'
      - Score.passed = True
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # -------------------------
    # Check OJTLevel2Quantity
    # -------------------------
    try:
        ojt_entry = OJTLevel2Quantity.objects.filter(
            emp_id=employee.emp_id,
            level=level,
            station_name=station.station_name,
            status="Pass"
        ).first()
    except Exception:
        ojt_entry = None

    ojt_passed = ojt_entry is not None
    if verbose:
        print(f"[SkillMatrix] OJT passed = {ojt_passed}")

    # -------------------------
    # Check Score (Evaluation)
    # -------------------------
    score_passed = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()
    if verbose:
        print(f"[SkillMatrix] Score passed = {score_passed}")

    # -------------------------
    # Update SkillMatrix if both conditions are true
    # -------------------------
    if ojt_passed and score_passed:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
            hierarchy=hierarchy,
            defaults={
                "employee_name": ojt_entry.trainee_name,
                "emp_id": ojt_entry.emp_id,
                "doj": ojt_entry.doj,
                # "hierarchy": hierarchy,
                "level":level,

            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ Created SkillMatrix for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 Updated SkillMatrix for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_passed}, Score: {score_passed}")

    if verbose:
        print("=" * 80)


# ----------------------------------------
# Signal for OJTLevel2Quantity
# ----------------------------------------
# @receiver(post_save, sender=OJTLevel2Quantity)
# def handle_ojt_save(sender, instance, **kwargs):
#     print(f"[Signal][OJTLevel2Quantity] Saved → Trainee {instance.trainee_name} ({instance.emp_id}), Status={instance.status}")
#     try:
#         employee = MasterTable.objects.get(emp_id=instance.emp_id)
#         station = Station.objects.get(station_name=instance.station_name)
#     except MasterTable.DoesNotExist:
#         print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.emp_id}")
#         return
#     except Station.DoesNotExist:
#         print(f"[Signal][ERROR] Station not found: {instance.station_name}")
#         return

#     # ⏳ Delay 5 seconds before running the update
#     delayed_run(update_skillmatrix_record, 5, employee, station, instance.level, True)
@receiver(post_save, sender=OJTLevel2Quantity)
def handle_ojt_save(sender, instance, **kwargs):
    print(f"[Signal][OJTLevel2Quantity] Saved → Trainee {instance.trainee_name} ({instance.emp_id}), Status={instance.status}")

    try:
        employee = MasterTable.objects.get(emp_id=instance.emp_id)

        # ✅ Prefer station_id if available
        if instance.station_id:
            station = Station.objects.get(pk=instance.station_id)
        else:
            # ⚠️ Fallback to station_name if station_id is missing
            station = Station.objects.filter(station_name=instance.station_name).first()
            if not station:
                print(f"[Signal][ERROR] Station not found: {instance.station_name}")
                return

    except MasterTable.DoesNotExist:
        print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.emp_id}")
        return
    except Station.DoesNotExist:
        print(f"[Signal][ERROR] Station not found with ID: {instance.station_id}")
        return

    # ⏳ Delay 5 seconds before running the update
    delayed_run(update_skillmatrix_record, 5, employee, station, instance.level, True)


# ----------------------------------------
# Signal for Score
# ----------------------------------------
@receiver(post_save, sender=Score)
def handle_score_save(sender, instance, **kwargs):
    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")
    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    # ⏳ Delay 5 seconds before running the update
    delayed_run(update_skillmatrix_record, 5, instance.employee, instance.skill, instance.level, True)


import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    OJTScore,
    Score,
    SkillMatrix,
    TraineeInfo,
    MasterTable,
    Station,
    HierarchyStructure,
    SkillMatrixFeatureFlag,   # <-- NEW model
)


# ----------------------------------------
# Helper: check if feature is enabled
# ----------------------------------------
def is_feature_enabled(feature_name):
    return SkillMatrixFeatureFlag.objects.filter(
        feature_name=feature_name, enabled=True
    ).exists()


# ----------------------------------------
# Helper: Run function after delay
# ----------------------------------------
def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# ----------------------------------------
# Core logic: update SkillMatrix
# ----------------------------------------
def update_skill_matrix(employee, station, level, verbose=True):
    """
    Update SkillMatrix when both OJT and Evaluation are passed
    Update SkillMatrix when OJT (for THIS station/level), Evaluation, AND Ten Cycle are all passed
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # ✅ Get TraineeInfo

    # ✅ Get TraineeInfo (Needed for name/doj and general status logging)
    # Filter by emp_id AND the specific station being certified to get the relevant record.
    # If the TraineeInfo record is unique per employee, we must fetch the correct one.
    # Since TraineeInfo has a ForeignKey to Station, we must use the 'station' parameter.

    # trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id).first()
    
    trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id, station=station).first()
    
    if not trainee_info:
        if verbose:
            # print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id}")
            print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id} at Station: {station.station_name}")
            # If no TraineeInfo exists for this station/skill, OJT cannot be complete.
            print("=" * 80)
        return

    if verbose:
        print(f"[SkillMatrix] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
              f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")

    # -------------------------
    # Check if OJT is passed for THIS Station/Level
    # -------------------------
    ojt_pass = False
    
    # CRITICAL CHANGE: We rely on the TraineeInfo.status only if it applies to this station.
    # The TraineeInfoViewSet logic is now responsible for setting this status correctly 
    # based on OJT scores associated with this trainee/station.
    if trainee_info.status == "Pass":

        # Additional Sanity Check: Ensure there's a score linked to the trainee for the target level.
        # This prevents a scenario where the status was manually set to 'Pass' without any scores.
        # ojt_exists = OJTScore.objects.filter(

        ojt_exists_for_station_level = OJTScore.objects.filter(
            # Filter by the TraineeInfo instance, which is already scoped by station in the fetch above.
            trainee__emp_id=employee.emp_id,
            topic__level=level
        ).exists()
        # ojt_pass = ojt_exists

        # OJT is passed only if the trainee's status is "Pass" AND scores actually exist for this level.
        ojt_pass = ojt_exists_for_station_level
        if verbose:
            # print(f"[SkillMatrix] OJT status=Pass, OJTScore exists for this level: {ojt_exists}")
            print(f"[SkillMatrix] OJT status is {trainee_info.status}. OJTScore exists for THIS trainee/level: {ojt_exists_for_station_level}")
    else:
        if verbose:
            print(f"[SkillMatrix] OJT not passed → Trainee status is {trainee_info.status}")

    if verbose:
        print(f"[SkillMatrix] Final OJT passed = {ojt_pass}")

    # -------------------------
    # Check if Evaluation is passed
    # -------------------------
    eval_pass = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()
    if verbose:
        print(f"[SkillMatrix] Evaluation passed = {eval_pass}")

    # -------------------------
    # Update or create SkillMatrix
    # -------------------------
    if ojt_pass and eval_pass:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
            hierarchy=hierarchy,
            defaults={
                "employee_name": trainee_info.trainee_name,
                "emp_id": trainee_info.emp_id,
                "doj": trainee_info.doj,
                # "hierarchy": hierarchy,
                "level":level,

            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ SkillMatrix created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}")

    if verbose:
        print("=" * 80)


# ----------------------------------------
# Signal for OJTScore
# ----------------------------------------

@receiver(post_save, sender=OJTScore)
def update_skill_on_ojt_save(sender, instance, **kwargs):
    print(f"[Signal][OJTScore] Saved → Trainee {instance.trainee.emp_id}, Score={instance.score}, Topic={instance.topic}")
    try:
        employee = MasterTable.objects.get(emp_id=instance.trainee.emp_id)
        if not instance.trainee.station:
            print(f"[Signal][ERROR] No station for trainee {instance.trainee.emp_id}")
            return
            
        # --- CHANGE THIS ---
        # Instead of getting the ID, get the whole object.
        station_object = instance.trainee.station 
        
    except MasterTable.DoesNotExist:
        print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.trainee.emp_id}")
        return
    except Exception as e:
        print(f"[Signal][ERROR] Station access failed: {e}")
        return

    # --- AND CHANGE THIS ---
    # Pass the full station_object to the function.
    # run_after_delay(update_skill_matrix, 5, employee, station_object, instance.topic.level, True)

    update_skill_matrix(employee, station_object, instance.topic.level, True)


# ----------------------------------------
# Signal for Score
# ----------------------------------------
@receiver(post_save, sender=Score)
def update_skill_on_eval_save(sender, instance, **kwargs):
    if not is_feature_enabled("ojt_evaluation"):
        return  # 🚫 disabled via frontend toggle

    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
          f"Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")
    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    # ⏳ Delay 5 seconds before running the update
    run_after_delay(update_skill_matrix, 5, instance.employee, instance.skill, instance.level, True)




















import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    Score,
    SkillMatrix,
    MasterTable,
    Station,
    HierarchyStructure,
    OperatorPerformanceEvaluation,
    SkillMatrixFeatureFlag,   # <-- add this
)


# ----------------------------------------
# Helper: check if feature is enabled
# ----------------------------------------
def is_feature_enabled(feature_name: str) -> bool:
    return SkillMatrixFeatureFlag.objects.filter(
        feature_name=feature_name, enabled=True
    ).exists()


# ----------------------------------------
# Helper: Run after delay
# ----------------------------------------
def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# ----------------------------------------
# Core logic: update SkillMatrix
# ----------------------------------------
def process_skill_matrix_update(employee, station, level, verbose=True):
    """
    ✅ Update SkillMatrix when BOTH:
      - OperatorPerformanceEvaluation = Pass
      - Score = Passed
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # -------------------------
    # Check Operator Performance Evaluation
    # -------------------------
    eval_exists = OperatorPerformanceEvaluation.objects.filter(
        employee=employee,
        station=station,
        level=level,
        final_status="Pass"
    ).exists()

    if verbose:
        print(f"[SkillMatrix] OperatorPerformanceEvaluation Pass = {eval_exists}")

    # -------------------------
    # Check Score (Evaluation test)
    # -------------------------
    score_pass = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()

    if verbose:
        print(f"[SkillMatrix] Score passed = {score_pass}")

    # -------------------------
    # Update SkillMatrix if both true
    # -------------------------
    if eval_exists and score_pass:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
            hierarchy=hierarchy,
            defaults={
                "employee_name": employee.first_name,   # from MasterTable
                "emp_id": employee.emp_id,
                "doj": employee.date_of_joining,        # from MasterTable
                # "hierarchy": hierarchy,
                "level":level
            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ Created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 Updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → EvalModel: {eval_exists}, Score: {score_pass}")

    if verbose:
        print("=" * 80)


# ----------------------------------------
# Signal for Score
# ----------------------------------------
@receiver(post_save, sender=Score)
def trigger_skillmatrix_from_score(sender, instance, **kwargs):
    if not is_feature_enabled("cycle_evaluation"):
        return  # 🚫 disabled via frontend toggle

    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
          f"Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")

    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    run_after_delay(process_skill_matrix_update, 5, instance.employee, instance.skill, instance.level, True)


# ----------------------------------------
# Signal for OperatorPerformanceEvaluation
# ----------------------------------------
@receiver(post_save, sender=OperatorPerformanceEvaluation)
def trigger_skillmatrix_from_performance_eval(sender, instance, **kwargs):
    if not is_feature_enabled("cycle_evaluation"):
        return  # 🚫 disabled via frontend toggle

    print(f"[Signal][OperatorPerformanceEvaluation] Saved → Employee {instance.employee.emp_id}, "
          f"Station={instance.station}, Level={instance.level}, Status={instance.final_status}")

    run_after_delay(process_skill_matrix_update, 5, instance.employee, instance.station, instance.level, True)





















import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    Score,
    SkillMatrix,
    MasterTable,
    Station,
    HierarchyStructure,
    OJTLevel2Quantity,
    SkillMatrixFeatureFlag,   # <-- NEW
)


# ----------------------------------------
# Helper: check if feature is enabled
# ----------------------------------------
def is_feature_enabled(feature_name: str) -> bool:
    return SkillMatrixFeatureFlag.objects.filter(
        feature_name=feature_name, enabled=True
    ).exists()


# ----------------------------------------
# Helper: Run function after a delay
# ----------------------------------------
def delayed_run(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# ----------------------------------------
# Core logic: Update SkillMatrix
# ----------------------------------------
def update_skillmatrix_record(employee, station, level, verbose=True):
    """
    Update SkillMatrix when:
      - OJTLevel2Quantity.status = 'Pass'
      - Score.passed = True
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # -------------------------
    # Check OJTLevel2Quantity
    # -------------------------
    try:
        ojt_entry = OJTLevel2Quantity.objects.filter(
            emp_id=employee.emp_id,
            level=level,
            station_name=station.station_name,
            status="Pass"
        ).first()
    except Exception:
        ojt_entry = None

    ojt_passed = ojt_entry is not None
    if verbose:
        print(f"[SkillMatrix] OJT passed = {ojt_passed}")

    # -------------------------
    # Check Score (Evaluation)
    # -------------------------
    score_passed = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()
    if verbose:
        print(f"[SkillMatrix] Score passed = {score_passed}")

    # -------------------------
    # Update SkillMatrix if both conditions are true
    # -------------------------
    if ojt_passed and score_passed:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
             hierarchy=hierarchy,
            defaults={
                "employee_name": ojt_entry.trainee_name,
                "emp_id": ojt_entry.emp_id,
                "doj": ojt_entry.doj,
                # "hierarchy": hierarchy,
                "level":level
            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ Created SkillMatrix for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 Updated SkillMatrix for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_passed}, Score: {score_passed}")

    if verbose:
        print("=" * 80)


# ----------------------------------------
# Signal for OJTLevel2Quantity
# ----------------------------------------
# @receiver(post_save, sender=OJTLevel2Quantity)
# def handle_ojt_save(sender, instance, **kwargs):
#     if not is_feature_enabled("quantity_ojt_evaluation"):
#         return  # 🚫 disabled from frontend toggle

#     print(f"[Signal][OJTLevel2Quantity] Saved → Trainee {instance.trainee_name} ({instance.emp_id}), Status={instance.status}")
#     try:
#         employee = MasterTable.objects.get(emp_id=instance.emp_id)
#         station = Station.objects.get(station_name=instance.station_name)
#     except MasterTable.DoesNotExist:
#         print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.emp_id}")
#         return
#     except Station.DoesNotExist:
#         print(f"[Signal][ERROR] Station not found: {instance.station_name}")
#         return

#     # ⏳ Delay 5 seconds before running the update
#     delayed_run(update_skillmatrix_record, 5, employee, station, instance.level, True)
# ----------------------------------------
# Signal for OJTLevel2Quantity
# ----------------------------------------
@receiver(post_save, sender=OJTLevel2Quantity)
def handle_ojt_save(sender, instance, **kwargs):
    print(f"[Signal][OJTLevel2Quantity] Saved → Trainee {instance.trainee_name} ({instance.emp_id}), Status={instance.status}")

    try:
        employee = MasterTable.objects.get(emp_id=instance.emp_id)

        # ✅ Prefer station_id if available
        if instance.station_id:
            station = Station.objects.get(pk=instance.station_id)
        else:
            # ⚠️ Fallback to station_name if station_id is missing
            station = Station.objects.filter(station_name=instance.station_name).first()
            if not station:
                print(f"[Signal][ERROR] Station not found: {instance.station_name}")
                return

    except MasterTable.DoesNotExist:
        print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.emp_id}")
        return
    except Station.DoesNotExist:
        print(f"[Signal][ERROR] Station not found with ID: {instance.station_id}")
        return

    # ⏳ Delay 5 seconds before running the update
    delayed_run(update_skillmatrix_record, 5, employee, station, instance.level, True)


# ----------------------------------------
# Signal for Score
# ----------------------------------------
@receiver(post_save, sender=Score)
def handle_score_save(sender, instance, **kwargs):
    if not is_feature_enabled("quantity_ojt_evaluation"):
        return  # 🚫 disabled from frontend toggle

    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
          f"Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")
    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    # ⏳ Delay 5 seconds before running the update
    delayed_run(update_skillmatrix_record, 5, instance.employee, instance.skill, instance.level, True)




# your_app/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import ManagementReviewCTQandPDI

@receiver([post_save, post_delete], sender=ManagementReviewCTQandPDI)
def update_total_review(sender, instance, **kwargs):
    if instance.review_type == 'TOTAL':
        return

    department = instance.department
    month_year = instance.month_year

    component_reviews = ManagementReviewCTQandPDI.objects.filter(
        department=department,
        month_year=month_year
    ).exclude(review_type='TOTAL')
    
    if not component_reviews.exists():
        ManagementReviewCTQandPDI.objects.filter(
            department=department,
            month_year=month_year,
            review_type='TOTAL'
        ).delete()
        return

    totals = component_reviews.aggregate(
        total_new_operators_joined=Sum('new_operators_joined'),
        total_new_operators_trained=Sum('new_operators_trained'),
        total_defects_msil=Sum('defects_msil'),
        total_defects_tier1=Sum('defects_tier1'),
        total_internal_rejection=Sum('internal_rejection'),
        total_training_plan=Sum('training_plan'),
        total_training_actual=Sum('training_actual'),
    )

    total_obj, created = ManagementReviewCTQandPDI.objects.update_or_create(
        department=department,
        month_year=month_year,
        review_type='TOTAL',
        defaults={
            'new_operators_joined': totals['total_new_operators_joined'] or 0,
            'new_operators_trained': totals['total_new_operators_trained'] or 0,
            'defects_msil': totals['total_defects_msil'] or 0,
            'defects_tier1': totals['total_defects_tier1'] or 0,
            'internal_rejection': totals['total_internal_rejection'] or 0,
            # ✨ --- FIX IS HERE --- ✨
            # Use the correct keys from the 'totals' dictionary
            'training_plan': totals['total_training_plan'] or 0,
            'training_actual': totals['total_training_actual'] or 0,
        }
    )

