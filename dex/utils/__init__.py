BASE_READ_ONLY_FIELDS = (
    "id",
    "created_on",
    "updated_on",
)

BASE_EXCLUDE_FIELDS = ("deleted",)


def reverse_choices(choices):
    output = {}
    for choice in choices:
        output[choice[0]] = choice[1]
    return output
