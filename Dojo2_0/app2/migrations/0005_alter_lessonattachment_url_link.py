from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2', '0004_alter_courseassignment_employee_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lessonattachment',
            name='url_link',
            field=models.URLField(blank=True, max_length=2048, null=True),
        ),
    ]
