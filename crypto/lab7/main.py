#!/bin/python
from fastecdsa.curve import P256
from fastecdsa.point import Point
from pyDes import triple_des, PAD_PKCS5

DATA = "Please encrypt my data"

gen_point = Point(P256.gx, P256.gy, curve=P256)


def main():

    priv_key_1 = 9
    pub_point_1 = priv_key_1 * gen_point

    priv_key_2 = 3
    pub_point_2 = priv_key_2 * gen_point

    secret_point_1 = pub_point_2 * priv_key_1
    secret_key_8_byte_1 = "{0:x}".format(secret_point_1.x)[-24:]

    secret_point_2 = pub_point_1 * priv_key_2
    secret_key_8_byte_2 = "{0:x}".format(secret_point_2.x)[-24:]

    # first client send file
    open('encrypted', 'w').write(
        triple_des(
            secret_key_8_byte_1,
            padmode=PAD_PKCS5
        ).encrypt(DATA)
    )

    # second client receives file
    encrypted = open('encrypted', 'r').read()
    print(encrypted)
    open('decrypted', 'w').write(
        triple_des(
            secret_key_8_byte_2,
            padmode=PAD_PKCS5
        ).decrypt(encrypted)
    )

if __name__ == '__main__':
    main()
