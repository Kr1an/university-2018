#!/bin/python
from lib.md5 import hmac, hash
from lib.utils import try_read_file

if __name__ == '__main__':
    input = try_read_file('input', 'some value to be hashed')
    hash = hmac('hello', input)
    print(hash)
    # open('hashed', 'w').write(hashed)