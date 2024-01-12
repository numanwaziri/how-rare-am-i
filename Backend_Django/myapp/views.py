
from django.db.models import Sum, Q

# Create your views here.
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Nhanes, NhanesMale, NhanesFemale ,Asec,AsecMale, AsecFemale
from rest_framework import status


class BasePopulationProportionsView(APIView):
    asec_model = Asec  # Default model for general case
    nhanes_model = Nhanes  # Default model for general case

    # Shared methods
    def get_numeric_param(self, name):
        value = self.request.query_params.get(name, None)
        return float(value) if value is not None else None

    def get_integer_list_param(self, name):
        values = self.request.query_params.getlist(name)
        return [int(value) for value in values if value.isdigit()] or None


    def calculate_proportion(self, filtered_queryset, base_queryset):
        # Aggregate the sum of weights for both filtered and base querysets in a single query
        aggregates = base_queryset.aggregate(
            base_sum_weight=Sum('weights'),
            filtered_sum_weight=Sum('weights', filter=Q(index__in=filtered_queryset))
        )

        filtered_weight = aggregates['filtered_sum_weight'] or 0
        base_weight = aggregates['base_sum_weight'] or 0

        return filtered_weight / base_weight if base_weight > 0 else 0


    def apply_filters(self, queryset, filters):
        return queryset.filter(**{k: v for k, v in filters.items() if v is not None})


    def validate_range(self, min_val, max_val, param_min_name, param_max_name):
        # Check if min is greater than max or if negative
        if min_val is not None and max_val is not None and min_val > max_val:
            return JsonResponse({'error': f'{param_min_name} cannot be greater than {param_max_name}'}, status=status.HTTP_400_BAD_REQUEST)

        if (min_val is not None and min_val < 0) or (max_val is not None and max_val < 0):
            return JsonResponse({'error': f'{param_min_name} and {param_max_name} cannot be negative'}, status=status.HTTP_400_BAD_REQUEST)
        return None


    def validate_allowed_values(self, value, allowed_values, param_name, value_meanings):
        if isinstance(value, list):
            for val in value:
                if val not in allowed_values:
                    return self.invalid_value_response(param_name, value_meanings)
        elif value not in allowed_values and value is not None:
            return self.invalid_value_response(param_name, value_meanings)
        return None

    def invalid_value_response(self, param_name, value_meanings):
        allowed_explanations = ', '.join([f"{val} ({desc})" for val, desc in value_meanings.items()])
        return JsonResponse({'error': f'Invalid value for {param_name}. Allowed values are: {allowed_explanations}'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):

        try:

            # Extract query parameters
            age_min, age_max = self.get_numeric_param('age_min'), self.get_numeric_param('age_max')
            sex = self.get_numeric_param('sex')
            marital_statuses, races = self.get_integer_list_param('marital_status'), self.get_integer_list_param('race')
            born_us = self.get_numeric_param('born_us')
            income_min, income_max = self.get_numeric_param('income_min'), self.get_numeric_param('income_max')
            weight_min, weight_max = self.get_numeric_param('weight_min'), self.get_numeric_param('weight_max')
            height_min, height_max = self.get_numeric_param('height_min'), self.get_numeric_param('height_max')
            bmi_min, bmi_max = self.get_numeric_param('bmi_min'), self.get_numeric_param('bmi_max')
            exclude_married = self.request.query_params.get('exclude_married', '0')



            # Validate parameter range
            range_validations = [
                ('age_min', 'age_max', age_min, age_max),
                ('weight_min', 'weight_max', weight_min, weight_max),
                ('height_min', 'height_max', height_min, height_max),
                ('bmi_min', 'bmi_max', bmi_min, bmi_max),
                ('income_min', 'income_max', income_min, income_max)
            ]
            for param_min_name, param_max_name, min_val, max_val in range_validations:
                error_response = self.validate_range(min_val, max_val, param_min_name, param_max_name)
                if error_response:
                    return error_response


            # Validate allowed values
            value_meanings = {
                'sex': {1: 'Male', 2: 'Female'},
                'marital_status': {1: 'Married', 2: 'Separated/Divorced/Widowed', 3: 'Other'},
                'race': {1: 'White', 2: 'Black', 3: 'Asian', 4: 'Other'},
                'born_us': {0: 'No', 1: 'Yes'}
            }
            for param, value in [('sex', sex), ('marital_status', marital_statuses),
                                 ('race', races), ('born_us', born_us)]:
                validation_response = self.validate_allowed_values(value, list(value_meanings[param].keys()), param, value_meanings[param])
                if validation_response:
                    return validation_response


            # Common filters (present in both datasets)
            common_filters = {'age__gte': age_min, 'age__lte': age_max, 'sex': sex,
                              'marital_status__in': marital_statuses or None,
                              'race__in': races or None, 'born_us': born_us}


            asec_all = self.asec_model.objects.all()
            nhanes_all = self.nhanes_model.objects.all()

             # Apply common filters to both ASEC and NHANES datasets
            asec_queryset = self.apply_filters(asec_all, common_filters)
            nhanes_queryset = self.apply_filters(nhanes_all, common_filters)

            # Apply filters based on query parameters
            if exclude_married == '1':
                asec_queryset = asec_queryset.exclude(marital_status=1)  # Replace with your field name
                nhanes_queryset = nhanes_queryset.exclude(marital_status=1)  # Replace with your field name

            # Calculate the baseline proportion for NHANES before applying unique filters
            baseline_proportion_nhanes = self.calculate_proportion(nhanes_queryset, nhanes_all)


            # Apply unique filters
            asec_queryset = self.apply_filters(asec_queryset, {'income__gte': income_min, 'income__lte': income_max})
            nhanes_queryset = self.apply_filters(nhanes_queryset, {'weight_kg__gte': weight_min, 'weight_kg__lte': weight_max,
                                                                   'height_cm__gte': height_min, 'height_cm__lte': height_max,
                                                                   'bmi__gte': bmi_min, 'bmi__lte': bmi_max})


            # Calculate the adjusted proportions for NAHNES after unique filters
            adjusted_proportion_nhanes = self.calculate_proportion(nhanes_queryset, nhanes_all)
            adjustment_ratio = adjusted_proportion_nhanes / baseline_proportion_nhanes if baseline_proportion_nhanes != 0 else 0

            if age_max is not None and age_min is not None:
                age_filter = {'age__gte': age_min, 'age__lte': age_max}
            elif age_max is not None and age_min is None:
                age_filter = {'age__lte': age_max}
            elif age_max is None and age_min is not None:
                age_filter = {'age__gte': age_min}
            else:
                age_filter = None


            # Setup response data
            response_data = {
                # 'proportion_overall': self.calculate_proportion(asec_queryset, Asec.objects.all()) * adjustment_ratio,
                # 'proportion_in_race': self.calculate_proportion(asec_queryset, Asec.objects.filter(race__in=races)) * adjustment_ratio if races else None,
                'proportion_in_sex': self.calculate_proportion(asec_queryset, asec_all) * adjustment_ratio if sex is not None else None,
                # 'proportion_in_age': self.calculate_proportion(asec_queryset, self.apply_filters(Asec.objects,age_filter)) * adjustment_ratio if age_filter is not None else None,
                'proportion_in_age_sex': self.calculate_proportion(asec_queryset, self.apply_filters(asec_all,age_filter)) * adjustment_ratio if age_filter is not None and sex is not None else None,
                # 'proportion_in_age_race':self.calculate_proportion(asec_queryset, self.apply_filters(Asec.objects,age_filter).filter(race__in=races))*adjustment_ratio if age_filter is not None and races is not None else None,
                'proportion_in_sex_race': self.calculate_proportion(asec_queryset, asec_all.filter(race__in=races)) * adjustment_ratio if sex is not None and races else None,
                'proportion_in_age_sex_race': self.calculate_proportion(asec_queryset,self.apply_filters(asec_all.filter(race__in=races),age_filter)) *adjustment_ratio if sex is not None and races is not None and age_filter is not None else None
                }


            return Response(response_data)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({'error': 'An unexpected error occurred'+ str(e)}, status=status.HTTP_400_BAD_REQUEST)



class PopulationProportionsMaleView(BasePopulationProportionsView):
    asec_model = AsecMale
    nhanes_model = NhanesMale

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class PopulationProportionsFemaleView(BasePopulationProportionsView):
    asec_model = AsecFemale
    nhanes_model = NhanesFemale

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# Router View
class PopulationProportionsView(APIView):
    def get(self, request, *args, **kwargs):
        view_classes = {
            '1': PopulationProportionsMaleView,
            '2': PopulationProportionsFemaleView,
            None: BasePopulationProportionsView  # For when 'sex' parameter is not provided
        }

        sex = request.query_params.get('sex')
        view_class = view_classes.get(sex)

        if view_class:
            return view_class.as_view()(request._request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Invalid sex parameter. Valid values are 1 (Male) and 2 (Female).'},
                                status=status.HTTP_400_BAD_REQUEST)
