from django.db import models

# Create your models here.

class Asec(models.Model):
    index = models.IntegerField(primary_key=True)
    age = models.PositiveSmallIntegerField()
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    income = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
    class Meta:
        managed = False
        db_table = 'Asec'

class AsecFemale(models.Model):
    index = models.IntegerField(primary_key=True)
    age = models.PositiveSmallIntegerField()
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    income = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
    class Meta:
        managed = False
        db_table = 'AsecFemale'

class AsecMale(models.Model):
    index = models.IntegerField(primary_key=True)
    age = models.PositiveSmallIntegerField()
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    income = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
    class Meta:
        managed = False
        db_table = 'AsecMale'

class Nhanes(models.Model):
    index = models.IntegerField(primary_key=True)
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    age = models.FloatField()
    weight_kg = models.FloatField()
    height_cm = models.FloatField()
    bmi = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))

    class Meta:
        managed = False
        db_table = 'Nhanes'


class NhanesFemale(models.Model):
    index = models.IntegerField(primary_key=True)
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    age = models.FloatField()
    weight_kg = models.FloatField()
    height_cm = models.FloatField()
    bmi = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
    class Meta:
        managed = False
        db_table = 'NhanesFemale'

class NhanesMale(models.Model):
    index = models.IntegerField(primary_key=True)
    sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
    age = models.FloatField()
    weight_kg = models.FloatField()
    height_cm = models.FloatField()
    bmi = models.FloatField()
    weights = models.FloatField()
    race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
    class Meta:
        managed = False
        db_table = 'NhanesMale'














# class ASEC(models.Model):
#     index = models.IntegerField(primary_key=True)
#     age = models.PositiveSmallIntegerField()
#     sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
#     income = models.FloatField()
#     weights = models.FloatField()
#     race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
#     marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
#     born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
#     class Meta:
#         managed = False
#         db_table = 'ASEC'

# class NHANES(models.Model):
#     index = models.IntegerField(primary_key=True)
#     sex = models.SmallIntegerField(choices=((2, 'Female'), (1, 'Male')))
#     age = models.FloatField(blank=True, null=True)
#     weight_kg = models.FloatField(blank=True, null=True)
#     height_cm = models.FloatField(blank=True, null=True)
#     bmi = models.FloatField(blank=True, null=True)
#     weights = models.FloatField()
#     race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
#     marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
#     born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))
#     class Meta:
#         managed = False
#         db_table = 'NHANES'



# class ASEC(models.Model):
    # age = models.PositiveSmallIntegerField()
    # sex = models.SmallIntegerField(choices=((0, 'Female'), (1, 'Male')))
    # income = models.FloatField()
    # weights = models.FloatField()
    # race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    # marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    # born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))


# class NHANES(models.Model):
    # age = models.PositiveSmallIntegerField()
    # sex = models.SmallIntegerField(choices=((0, 'Female'), (1, 'Male')))
    # weight_in_kg = models.FloatField(null=True, blank=True)
    # height_in_cm = models.FloatField(null=True, blank=True)
    # bmi = models.FloatField(null=True, blank=True)
    # weights = models.FloatField()
    # race = models.SmallIntegerField(choices=((1, 'White'), (2, 'Black'), (3, 'Asian'), (4, 'Other')))
    # marital_status = models.SmallIntegerField(choices=((1, 'Married'), (2, 'Widowed/Divorced/Separated'), (3, 'Other')))
    # born_us = models.SmallIntegerField(choices=((0, 'No'), (1, 'Yes')))