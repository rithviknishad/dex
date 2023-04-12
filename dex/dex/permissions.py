from rest_framework import permissions


class Prosumer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.billing_account == request.user

        if view.action in ["update", "partial_update"]:
            return obj.billing_account == request.user

        if view.action == "destroy":
            return obj.billing_account == request.user

        return False

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        if view.action == "create":
            return request.user.is_authenticated

        return True


class Order(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        return False

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        if view.action == "create":
            return request.user.is_authenticated

        return True


class Trade(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        return False

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        if view.action == "create":
            return False

        return True
