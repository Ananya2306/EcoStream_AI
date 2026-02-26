def normalize(value, max_value):
    return min(value / max_value, 1)

def percentage_change(old, new):
    if old == 0:
        return 0
    return round(((old - new) / old) * 100, 2)