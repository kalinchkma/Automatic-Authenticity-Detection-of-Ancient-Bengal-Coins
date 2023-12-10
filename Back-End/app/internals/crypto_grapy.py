from passlib.context import CryptContext

# THIS FUNCTION WILL HASH PLAIN PASSWORD BASED ON "SHA256"
def hash_password(password):
    pwd_context = CryptContext(schemes=['sha256_crypt'])
    return pwd_context.hash(password)

# THIS FUNCTION WILL VERIFY PLAIN PASSWORD OF USER
def verify_password(plain_password, hashed_password):
    pwd_context = CryptContext(schemes=['sha256_crypt'])
    return pwd_context.verify(plain_password, hashed_password)