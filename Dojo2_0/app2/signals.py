from django.db.models.signals import post_save, m2m_changed, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import (
    CourseAssignment, AnswerSubmission, Notification, 
    Course, Group, LessonProgress, Lesson, LMSProfile
)

User = get_user_model()

# --- HELPER FUNCTION ---
def create_notification(recipient, title, message, sender=None, type='info',related_id=None):
    if sender and recipient == sender:
        return

    Notification.objects.create(
        recipient=recipient,
        sender=sender,
        title=title,
        message=message,
        notification_type=type,
        related_object_id=related_id
    )

# ========================================================
# 1. COURSE ASSIGNMENT
# ========================================================
@receiver(post_save, sender=CourseAssignment)
def notify_employee_assignment(sender, instance, created, **kwargs):
    if created:
        create_notification(
            recipient=instance.employee,
            sender=instance.assigned_by,
            title="New Course Assigned",
            message=f"You have been assigned to the course '{instance.course.title}'.",
            type='info'
        )

# ========================================================
# 2. TEST SUBMISSION
# ========================================================
@receiver(post_save, sender=AnswerSubmission)
def notify_result_submission(sender, instance, created, **kwargs):
    if created:
        student = instance.user
        test_title = instance.test.title
        
        status_text = "PASSED" if instance.passed else "FAILED"
        type_status = 'success' if instance.passed else 'warning'

        # Get Student Name safely (Check Profile first, then Master User)
        student_name = student.first_name
        if hasattr(student, 'lms_profile'):
            student_name = student.lms_profile.firstName

        # A. Notify Student
        student_msg = f"Your test for '{test_title}' has been successfully marked. Result: {status_text} ({instance.score})."
        create_notification(
            recipient=student,
            title="Test Submitted Successfully",
            message=student_msg,
            sender=None,
            type=type_status
        )

        # B. Notify Team Leaders
        lead_msg = f"{student_name} has {status_text} the test for {test_title}."
        user_groups = student.member_of_groups.all()
        for group in user_groups:
            for leader in group.team_leaders.all():
                create_notification(leader, f"Test Result: {status_text}", lead_msg, student, type_status)

        # C. Notify Admins
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            create_notification(admin, f"System Alert: {status_text}", lead_msg, student, 'info')

# ========================================================
# 3. NEW USER REGISTERED (Welcome Message)
# ========================================================
@receiver(post_save, sender=User)
def notify_new_user_registered(sender, instance, created, **kwargs):
    if created:
        # Use Master User 'first_name' here because Profile might not exist yet
        create_notification(
            instance, 
            "Welcome!", 
            f"Hi {instance.first_name}, welcome to the platform.", 
            None, 
            'success'
        )
        
        for admin in User.objects.filter(is_staff=True):
            create_notification(admin, "New User", f"New registration: {instance.email}", instance, 'info')

# ========================================================
# 4. COURSE CREATED
# ========================================================
@receiver(post_save, sender=Course)
def notify_course_created(sender, instance, created, **kwargs):
    if created:
        # Get Instructor Name Safely
        instructor_name = "Unknown"
        if instance.instructor:
            if hasattr(instance.instructor, 'lms_profile'):
                instructor_name = instance.instructor.lms_profile.firstName
            else:
                instructor_name = instance.instructor.first_name

        title = "New Course Available"
        message = f"A new course '{instance.title}' has been published by {instructor_name}. Check it out!"

        # A. Notify Employees (Use lms_profile__userType)
        employees = User.objects.filter(lms_profile__userType='employee')
        for emp in employees:
            create_notification(emp, title, message, instance.instructor, 'info')

        # B. Notify Team Leaders (Use lms_profile__userType)
        team_leaders = User.objects.filter(lms_profile__userType='team-leader')
        for leader in team_leaders:
            create_notification(leader, title, message, instance.instructor, 'info')

        # C. Notify Admins
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            create_notification(admin, title, message, instance.instructor, 'info')

# ========================================================
# 5. ADDED TO GROUP
# ========================================================
@receiver(m2m_changed, sender=Group.employees.through)
def notify_group_membership_change(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for user_id in pk_set:
            user = User.objects.get(pk=user_id)
            create_notification(
                recipient=user,
                title="New Team Membership",
                message=f"You have been added to the team/group: '{instance.name}'.",
                sender=instance.user,
                type='info'
            )

# ========================================================
# 6. ASSIGNMENT DUE DATE CHANGED
# ========================================================
@receiver(pre_save, sender=CourseAssignment)
def notify_due_date_change(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_assignment = CourseAssignment.objects.get(pk=instance.pk)
            if old_assignment.due_date != instance.due_date and instance.due_date is not None:
                new_date_str = instance.due_date.strftime('%Y-%m-%d')
                create_notification(
                    recipient=instance.employee,
                    title="Due Date Updated",
                    message=f"The deadline for '{instance.course.title}' has been changed to {new_date_str}.",
                    sender=instance.assigned_by,
                    type='warning'
                )
        except CourseAssignment.DoesNotExist:
            pass

# ========================================================
# 7. COURSE COMPLETION
# ========================================================
@receiver(post_save, sender=LessonProgress)
def notify_course_completion(sender, instance, created, **kwargs):
    if instance.completed:
        user = instance.user
        course = instance.course
        
        total_lessons = course.roadmap.count()
        completed_lessons = LessonProgress.objects.filter(user=user, course=course, completed=True).count()

        if total_lessons > 0 and total_lessons == completed_lessons:
            
            # A. Congratulate Employee
            create_notification(
                recipient=user,
                title="Course Completed! 🎉",
                message=f"Congratulations! You have finished all lessons in '{course.title}'. Good luck on the test!",
                sender=None,
                type='success'
            )

            # B. Inform Team Leads
            # Get Name Safely
            user_name = user.first_name
            if hasattr(user, 'lms_profile'):
                user_name = user.lms_profile.firstName

            user_groups = user.member_of_groups.all()
            for group in user_groups:
                for leader in group.team_leaders.all():
                    create_notification(
                        recipient=leader,
                        title="Course Completed",
                        message=f"{user_name} has finished the course content for '{course.title}'.",
                        sender=user,
                        type='info'
                    )

# ========================================================
# 8. LESSON UPDATED
# ========================================================
@receiver(post_save, sender=Lesson)
def notify_lesson_update(sender, instance, created, **kwargs):
    if not created: 
        course = instance.course
        active_assignments = CourseAssignment.objects.filter(course=course)
        
        for assignment in active_assignments:
            create_notification(
                recipient=assignment.employee,
                title="Course Content Updated",
                message=f"Content in lesson '{instance.title}' (Course: {course.title}) has been updated.",
                sender=course.instructor,
                type='info'
            )

# ========================================================
# 9. AUTO-CREATE LMS PROFILE (CRUCIAL NEW PART)
# ========================================================
@receiver(post_save, sender=User)
def create_lms_profile(sender, instance, created, **kwargs):
    """
    When a Standard Dojo User is created, automatically create 
    an LMS Profile for them so they can access the LMS.
    """
    if created:
        # Check if the user has a Role (Standard Dojo Logic)
        user_type = 'employee' # Default
        
        # Mapping Dojo Roles to LMS Roles
        # Adjust these role names to match your Dojo Database exactly
        if instance.role and instance.role.name.lower() in ['admin', 'manager', 'director']:
            user_type = 'admin'
        elif instance.role and instance.role.name.lower() in ['supervisor', 'team lead', 'lead']:
            user_type = 'team-leader'
            
        LMSProfile.objects.create(
            user=instance,
            # Copy basic details from the Master User to the Profile
            firstName=instance.first_name, 
            lastName=instance.last_name,
            userType=instance.role.name,
            designation=instance.designation,
            department=instance.department,
            hq=instance.hq,
            bu=instance.business_unit,
            section=instance.section,
        )

# ... (Keep all your existing imports) ...
from .models import (
    CourseAssignment, AnswerSubmission, Notification, 
    Course, Group, LessonProgress, Lesson, LMSProfile,
    CourseEnrollmentRequest # <--- IMPORT THE NEW MODEL HERE
)

@receiver(post_save, sender=CourseEnrollmentRequest)
def notify_admin_of_request(sender, instance, created, **kwargs):
    """
    When an employee clicks 'Request to Join', notify the Admins.
    """
    if created:
        # Get Employee Name safely
        emp_name = instance.user.first_name
        if hasattr(instance.user, 'lms_profile'):
            emp_name = instance.user.lms_profile.firstName

        title = "New Enrollment Request"
        message = f"{emp_name} has requested access to the course '{instance.course.title}'."

        # Notify all Admins (Superusers or Staff)
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            create_notification(
                recipient=admin,
                title=title,
                message=message,
                sender=instance.user,
                type='warning',
                related_id=instance.id, 
            )

# ========================================================
# 11. APPROVE REQUEST (Admin -> Employee)
# ========================================================
@receiver(pre_save, sender=CourseEnrollmentRequest)
def process_enrollment_approval(sender, instance, **kwargs):
    """
    When Admin changes status from PENDING to APPROVED:
    1. Create the CourseAssignment (Enroll the user).
    2. Notification is handled by Signal #1 (notify_employee_assignment).
    """
    if instance.pk: # Ensure it's an update, not a creation
        try:
            previous_request = CourseEnrollmentRequest.objects.get(pk=instance.pk)
            
            # Check if status changed to APPROVED
            if previous_request.status != 'APPROVED' and instance.status == 'APPROVED':
                
                # 1. Create the actual Course Assignment
                # This ensures the user is enrolled.
                # Note: This line triggers Signal #1 (notify_employee_assignment) automatically!
                CourseAssignment.objects.get_or_create(
                    employee=instance.user,
                    course=instance.course,
                    defaults={
                        'assigned_by': None # Or a system user
                    }
                )

                # Optional: If you want a specific "Request Approved" notification separate 
                # from the standard "Assigned" notification, add it here.
                # But Signal #1 usually covers this requirement nicely.

            # Check if status changed to REJECTED
            elif previous_request.status != 'REJECTED' and instance.status == 'REJECTED':
                create_notification(
                    recipient=instance.user,
                    title="Enrollment Request Declined",
                    message=f"Your request to join '{instance.course.title}' has been declined by the administrator.",
                    sender=None,
                    type='error'
                )

        except CourseEnrollmentRequest.DoesNotExist:
            pass

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrganizationNode, LMSProfile

@receiver(post_save, sender=OrganizationNode)
def auto_assign_bu_to_profiles(sender, instance, created, **kwargs):
    if instance.org_type == 'bu' and created:
        # Assign this BU to all employees whose department contains part of BU name
        LMSProfile.objects.filter(
            department__icontains=instance.name.split()[0]
        ).update(bu=instance.name)
        
        # OR assign to all employees in departments under this BU (if you have parent links)
        # Keep it simple with name matching
        print(f"Auto-assigned BU '{instance.name}' to matching employees")