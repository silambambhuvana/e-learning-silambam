from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from app1.models import User

class CustomJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            user = User.objects.get(id=decoded['id'])

            return (user, None)

        except Exception:
            raise AuthenticationFailed('Invalid token')