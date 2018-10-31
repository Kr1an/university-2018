#!/bin/python
import hashlib
import random
from fastecdsa.curve import P256

MESSAGE = 'please, encrypt me'
d = 32416190071
Q = d * P256.G
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m

def is_prime(n):
    if n == 1:
        return False
    i = 2
    while i*i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

def prime_in_range(a, b):
    isPrime = False
    prime = 0
    while not isPrime:
        prime = random.randint(a, b)
        isPrime = is_prime(prime)
        print('hel')
    return prime    


def sign(msg, d):
    q = P256.p
    P = P256.G
    msg_hash = hashlib.md5(msg).hexdigest()
    z = int(msg_hash, 16)
    e = z % q
    e = e if e else 1
    s = k = r = C = None
    tries = 4
    while not r or not s: 
        k = random.randint(1, q-1)
        C = k * P
        r = C.x % q
        s = (r*d + k*e) % q
        if tries <= 0:
            raise Exception('to many tries to generate "r"')
        else:
            tries -= 1
    return (r, s)


def verify(msg, r, s, Q):
    q = P256.p
    P = P256.G
    if r >= q or s >= q:
        return False
    h = hashlib.md5(msg).hexdigest()
    z = int(h, 16)
    e = z % q
    e = e if e else 1
    v = modinv(e, q)
    z1 = (s * v) % q
    z2 = -r * v % q

    C = z1 * P + z2 * Q
    R = C.x % q
    return R == r


def main():
    r, s = sign(MESSAGE, d)
    verified = verify(MESSAGE, r, s, Q)
    print('verified' if verified else 'not verified')

    

if __name__ == '__main__':
    main()