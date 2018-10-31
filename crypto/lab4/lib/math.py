import random
from fractions import gcd
from random import randint


from .utils import tested

def _phi(n):
    amount = 0        
    for k in range(1, n + 1):
        if gcd(n, k) == 1:
            amount += 1
    return amount

@tested([
    _phi(24) == 8,
    _phi(1) == 1,
    _phi(63) == 36,
    _phi(99) == 60
])
def phi(*args, **kwarg):
    return _phi(*args, **kwarg)

def _is_prime(n, k=5):
    if n < 2: return False
    for p in [2,3,5,7,11,13,17,19,23,29]:
        if n % p == 0: return n == p
    s, d = 0, n-1
    while d % 2 == 0:
        s, d = s+1, d/2
    for _ in range(k):
        x = pow(randint(2, n-1), d, n)
        if x == 1 or x == n-1: continue
        for _ in range(1, s):
            x = (x * x) % n
            if x == 1: return False
            if x == n-1: break
        else: return False
    return True

@tested([
    _is_prime(1) == False,
    _is_prime(2) == True,
    _is_prime(1301081) == True,
    _is_prime(32416190071) == True,
    _is_prime(100000000000000000001) == False,
])
def is_prime(*args, **kwarg):
    return _is_prime(*args, **kwarg)

def _next_prime(n):
    if n < 2: return 2
    if n < 3: return 3
    if n < 5: return 5
    n = n + 1 if n % 2 == 0 else n + 2
    while not is_prime(n):
        n += [1,6,5,4,3,2,1,4,3,2,1,2,1,4,3,2,1, \
              2,1,4,3,2,1,6,5,4,3,2,1,2][n % 30]
    return n

@tested([
    _next_prime(4) == 5,
    _next_prime(10) == 11,
    _next_prime(431) == 433,
    _next_prime(32416187987) == 32416188011,
])
def next_prime(*args, **kwarg):
    return _next_prime(*args, **kwarg)

def _primitive_root_modulo(modulo):
    coprime_set = {num for num in range(1, modulo) if gcd(num, modulo) == 1}
    return [g for g in range(1, modulo) if coprime_set == {pow(g, powers, modulo)
            for powers in range(1, modulo)}]
@tested([
    sorted(_primitive_root_modulo(7)) == sorted([3, 5]),
    sorted(_primitive_root_modulo(17)) == sorted([3, 5, 6, 7, 10, 11, 12, 14]),
])
def primitive_root_modulo(*args, **kwarg):
    return _primitive_root_modulo(*args, **kwarg)

def _is_coprime(first, second):
    return gcd(first, second) == 1

@tested([
    _is_coprime(12, 13) == True,
    _is_coprime(56, 13) == True,
    _is_coprime(100, 200) == False,
])
def is_coprime(*args, **kwarg):
    return _is_coprime(*args, **kwarg)

def _get_coprime(n):
    return int(random.choice([i for i in range(1, n) if is_coprime(i, n)]))

@tested([
    is_coprime(13, _get_coprime(13)) == True,
    is_coprime(100, _get_coprime(100)) == True,
])
def get_coprime(*args, **kwarg):
    return _get_coprime(*args, **kwarg)