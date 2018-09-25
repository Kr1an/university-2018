using System;
using System.Text;

namespace ISM.GOST28147
{
    /* Info
     * https://ru.wikipedia.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_28147-89
     * https://habrahabr.ru/post/256843/
     */
    public class Program {
        public static void Main( string[] args ) 
        { 
              string inputFileName = "input.txt"; 
              string encodedFileName = "encoded.txt";
              string decodedFileName = "decoded.txt";
              string keyFileName = "key.txt";
              GOST28147Crypto crypto = new GOST28147Crypto();
              Console.WriteLine("crypto instance was created");
              Console.WriteLine("1) reading text from file " + inputFileName);
              string data = System.IO.File.ReadAllText(inputFileName).ToString().TrimEnd('\n');
              Console.WriteLine("file content: " + data);
              Console.WriteLine("2) reading key from file " + keyFileName);
              string key = System.IO.File.ReadAllText(keyFileName).ToString().TrimEnd('\n');
              Console.WriteLine("file content: " + key);
              Console.WriteLine("3) encoding text");
              string encoded = crypto.Encode(data, key);
              Console.WriteLine("encoded content: \"" + encoded + "\"");
              Console.WriteLine("write encoded content to file " + encodedFileName);
              System.IO.File.WriteAllText(encodedFileName, encoded);
              Console.WriteLine("4) make decode operation for encoded text " + encoded);
              string decoded = crypto.Decode(encoded, key); 
              Console.WriteLine("decoded content: \"" + decoded + "\"");
              Console.WriteLine("write decoded content to file: " + decodedFileName);
              System.IO.File.WriteAllText(decodedFileName, decoded);

        }

    }
    public class GOST28147Crypto
    {
        private byte[][] SubstitutionBox =
        {
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF },
              new byte[] { 0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xA,0xB,0xC,0xD,0xE,0xF }
        };

        public string Encode(string data, string key) =>
            Encoding.Unicode.GetString(
                Encode(Encoding.Unicode.GetBytes(data), key)
            );

        public byte[] Encode(byte[] data, string key) =>
            Encode(data, Encoding.Unicode.GetBytes(key));

        public byte[] Encode(byte[] data, byte[] key) =>
            MainAlgorithm(true, data, key);

        public string Decode(string data, string key) =>
            Encoding.Unicode.GetString(
                Decode(Encoding.Unicode.GetBytes(data), key)
            );

        public byte[] Decode(byte[] data, string key) =>
            Decode(data, Encoding.Unicode.GetBytes(key));

        public byte[] Decode(byte[] data, byte[] key) =>
            MainAlgorithm(false, data, key);

        private byte[] MainAlgorithm(bool isEncoding, byte[] data, byte[] key)
        {
            var subkeys = GenerateKeys(key);
            var result = new byte[data.Length];
            var block = new byte[8];

            for (int i = 0; i < data.Length / 8; i++)                    // N blocks 64bits length.
            {
                Array.Copy(data, 8 * i, block, 0, 8);
                Array.Copy(AlgorithmBlock(isEncoding, block, subkeys), 0, result, 8 * i, 8);
            }

            return result;
        }

        private byte[] AlgorithmBlock(bool isEncoding, byte[] block, uint[] keys)
        {
            var codingValue = isEncoding ? 24 : 8;

            var N1 = BitConverter.ToUInt32(block, 0);
            var N2 = BitConverter.ToUInt32(block, 4);

            for (int i = 0; i < 32; i++)
            {
                var keyIndex = i < codingValue ? (i % 8) : (7 - i % 8);  // to 24th cycle : 0 to 7; after - 7 to 0;
                var s = (N1 + keys[keyIndex]) % uint.MaxValue;           // (N1 + X[i]) mod 2^32
                s = Substitution(s);                                     // substitute from box
                s = (s << 11) | (s >> 21);
                s ^= N2;                                                 // ( s + N2 ) mod 2

                if (i < 31)                                              // last cycle : N1 don't change; N2 = s;
                {
                    N2 = N1;
                    N1 = s;
                }
                else
                {
                    N2 = s;
                }
            }

            var output = new byte[8];
            var N1buff = BitConverter.GetBytes(N1);
            var N2buff = BitConverter.GetBytes(N2);

            for (int i = 0; i < 4; i++)
            {
                output[i] = N1buff[i];
                output[4 + i] = N2buff[i];
            }

            return output;
        }

        private uint[] GenerateKeys(byte[] key)
        {
            if (key.Length != 32)
                throw new ArgumentException($"{nameof(key)} must collect 32 bytes (16 symbols).");

            var subkeys = new uint[8];

            for (int i = 0; i < 8; i++)
                subkeys[i] = BitConverter.ToUInt32(key, 4 * i);

            return subkeys;
        }

        private uint Substitution(uint value)
        {
            uint output = 0;

            for (int i = 0; i < 8; i++)
            {
                var temp = (byte)((value >> (4 * i)) & 0x0f);
                temp = SubstitutionBox[i][temp];
                output |= (uint)temp << (4 * i);
            }

            return output;
        }
    }
}
