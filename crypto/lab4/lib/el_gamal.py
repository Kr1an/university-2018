import random
from lib.math import next_prime, primitive_root_modulo, is_coprime, get_coprime

def generate_keys(key_len):
    p = next_prime(10 ** (key_len - 1))
    g = int(random.choice(primitive_root_modulo(p)))
    x = get_coprime(p - 1)
    y = int(g ** x % p)

    return (
        (y, p, g),
        (x, p),
    )

def encrypt(key, byte):
    (y, p, g) = key
    k = random.randint(1, p - 1)
    session_key = int(g ** k % p)
    encrypted = int(byte * y ** k % p)
    return session_key, encrypted

def encrypt_byte(key, byte, session_base):
    (y, p, _) = key
    encrypted = byte * y ** session_base % p
    return encrypted

def encrypt_bytes(key, bytes):
    (_, p, g) = key
    k = random.randint(1, p - 1)
    session_key = int(g ** k % p)
    return session_key, [encrypt_byte(key, i, k) for i in bytes]

def encrypt_str(key, str):
    bytes = [ord(i) for i in str.encode('utf-8')]
    session_key, encrypted_bytes = encrypt_bytes(key, bytes)
    encrypted_str = ''.join([unichr(i) for i in encrypted_bytes])
    return session_key, encrypted_str

def decrypt(key, session_key, encrypted):
    x, p = key
    return encrypted * session_key ** (p - 1 - x) % p

def decrypt_bytes(key, session_key, bytes):
    return [decrypt(key, session_key, i) for i in bytes]

def decrypt_str(key, session_key, str):

    encrypted_bytes = [ord(i) for i in str]
    decrypted_bytes = decrypt_bytes(key, session_key, encrypted_bytes)
    decrypted_str = ''.join([unichr(i) for i in decrypted_bytes])

    return decrypted_str