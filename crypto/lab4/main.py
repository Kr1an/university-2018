#!/bin/python

import random
import lib.el_gamal as el_gamal
from lib.utils import try_read_file

if __name__ == '__main__':
    key_len = 4
    key_len = int(raw_input('Enter the bit-length of base primary nubmer({}): '.format(key_len)) or key_len)
    (pub, priv) = el_gamal.generate_keys(key_len)

    print(pub, priv)

    message = try_read_file('input', 'some placeholder text')

    session, encrypted = el_gamal.encrypt_str(pub, message)

    open('encrypted', 'w').write(encrypted.encode('utf-8'))

    encrypted_from_file = open('encrypted', 'r').read().decode('utf-8')
    print(encrypted_from_file)

    decrypted = el_gamal.decrypt_str(priv, session, encrypted_from_file)
    open('decrypted', 'w').write(decrypted.encode('utf-8'))
    print(decrypted)


    



