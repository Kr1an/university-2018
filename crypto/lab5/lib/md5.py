from bitarray import bitarray
from utils import tested
from math import sin


def _round_stream(bits):
    bits.append(1)
    length = bits.length()
    extra_block_length = length % 512
    lack_count = 448 - extra_block_length
    if lack_count < 0:
        lack_count = 448 + 512 - extra_block_length
    bits.extend([0] * lack_count)
    return bits

@tested([
    _round_stream(bitarray([0] * 512)).length() == 512 + 448,
    _round_stream(bitarray([])).length() == 448,
    _round_stream(bitarray([0] * (512 + 448))).length() == 2 * 512 + 448,
    (_round_stream(bitarray([0] * 10000)).length() - 448) % 512 == 0
])
def round_stream(*args, **kwarg):
    return _round_stream(*args, **kwarg)

def _add_data_len(bits, initial_length):
    initial_length = initial_length % 2 ** 64
    b = bitarray('{0:b}'.format(initial_length))
    l = b[-32:]
    lf = bitarray(32 - l.length())
    lf.setall(0)
    lf.extend(l)
    h = b[-64:-32]
    hf = bitarray(32 - h.length())
    hf.setall(0)
    hf.extend(h)
    bits.extend(lf)
    bits.extend(hf)
    return bits

@tested([
    _add_data_len(bitarray(448), 12534523423423423423424).length() == 512,
    _add_data_len(bitarray(512 * 3 + 448), 123123).length() == 512 * 4
])
def add_data_len(*args, **kwarg):
    return _add_data_len(*args, **kwarg)

num_to_32_bits = lambda n : bitarray('{0:032b}'.format(n))


A_DEFAULT = num_to_32_bits(0x67452301)
B_DEFAULT = num_to_32_bits(0xEFCDAB89)
C_DEFAULT = num_to_32_bits(0x98BADCFE)
D_DEFAULT = num_to_32_bits(0x10325476)
T_TBL = [num_to_32_bits(int(abs(sin(i+1)) * 2**32)) for i in range(64)]
ROTATE_TBL = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
]
FUNCTIONS = \
    [lambda x, y, z : x & y | ~x & z] * 16 + \
    [lambda x, y, z : x & z | ~z & y] * 16 + \
    [lambda x, y, z : x ^ y ^ z] * 16 + \
    [lambda x, y, z : y ^ (~z | x)] * 16

INDEX_FNS = \
    [lambda i : i] * 16 + \
    [lambda i : (5 * i + 1) % 16] * 16 + \
    [lambda i : (3 * i + 5) % 16] * 16 + \
    [lambda i : (7 * i) % 16] * 16
 
def cycle_calc(bits):
    a = A_DEFAULT
    b = B_DEFAULT
    c = C_DEFAULT
    d = D_DEFAULT


    while bits.length():
        aa = a
        bb = b
        cc = c
        dd = d
        chank = bits[0:512]

        for i in range(0, 63):
            f = FUNCTIONS[i](b, c, d)
            g = INDEX_FNS[i](i)
            to_rotate = a ^ f ^ T_TBL[i] ^ chank[32*g:32*g+32]
            new_b = to_rotate[ROTATE_TBL[i]:] + to_rotate[:ROTATE_TBL[i]]
            a, b, c, d = d, new_b, b, c

        a = aa ^ a
        b = bb ^ b
        c = cc ^ c
        d = dd ^ d

        bits = bits[512:]

    
    return a + b + c + d

def hexed(bits):
    return '{:X}'.format(int(bits.to01(), 2))

def hash(data):
    bits = bitarray()
    bits.frombytes(data.encode('utf-8'))
    initial_length = bits.length()

    bits = round_stream(bits)

    add_data_len(bits, initial_length)
    bits = cycle_calc(bits)
    return hexed(bits)

def hmac(key, message):
    key_bits = bitarray()
    key_bits.frombytes(key.encode('utf-8'))
    key_len = key_bits.length()
    b = 512
    L = 128

    k0 = None
    if key_len <= b:
        k0 = key_bits + bitarray(b - key_len)
    else:
        k0 = bitarray('{0:0b}'.format(hash(message)))
    
    ikeypad = k0 ^ bitarray('00110110'*(b/8))
    okeypad = k0 ^ bitarray('01011100'*(b/8))

    inner = hash(ikeypad.tobytes().decode('utf-8', 'ignore') + message)
    
    return hash(okeypad.tobytes().decode('utf-8', 'ignore') + inner)