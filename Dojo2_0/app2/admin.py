from django.contrib import admin

from django.contrib import admin
from .models import (Course, LMSProfile,Lesson,CourseStats, LessonAttachment,Test,LessonProgress,CourseAssignment,PreTestResult,PostTestResult,EmployeeGrowthReport,GeneratedMedia,
    Group,AnswerSubmission, GroupMessage, Notification,CompetencyCategory,Competency,CompetencyLevel,CompetencyRule,RuleCompetency,EmployeeCompetencyMatrix, OrganizationNode,
)



admin.site.register(Course)
admin.site.register(Notification)
admin.site.register(Lesson)
admin.site.register(CourseStats)
admin.site.register(CourseAssignment)
admin.site.register(AnswerSubmission)
admin.site.register(Test)
admin.site.register(LessonProgress)
admin.site.register(Group)
admin.site.register(LMSProfile)
admin.site.register(GroupMessage)
admin.site.register(PreTestResult)
admin.site.register(PostTestResult)
admin.site.register(EmployeeGrowthReport)
admin.site.register(LessonAttachment)
admin.site.register(CompetencyCategory)
admin.site.register(Competency)
admin.site.register(CompetencyLevel)
admin.site.register(CompetencyRule)
admin.site.register(RuleCompetency)
admin.site.register(EmployeeCompetencyMatrix)
admin.site.register(OrganizationNode)
admin.site.register(GeneratedMedia)
