import math

def clean_sql_results(results):
    cleaned = []
    for row in results:
        clean_row = {}
        for key, value in row.items():
            if hasattr(value, 'item'):
                value = value.item()
            if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                value = None
            clean_row[key] = value
        cleaned.append(clean_row)
    return cleaned