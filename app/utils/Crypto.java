package utils;

import org.apache.commons.codec.binary.Hex;
import play.Logger;
import play.exceptions.UnexpectedException;
import play.libs.Codec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.AlgorithmParameters;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.TreeMap;

import static javax.crypto.Cipher.DECRYPT_MODE;
import static javax.crypto.Cipher.ENCRYPT_MODE;

public abstract class Crypto {
    
    private static final SecretKeyFactory keyFactory;
    
    private static final String ENCODING = "UTF-8";
    
    private static final int KEYLEN_BITS = 128;
    
    private static final int ITERATIONS = 65536;
    
    private static final int SALT_LEN = 8;
    
    static {
        try {
            keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }
    
    private Crypto() {
        super();
    }
    
    public static String sign(TreeMap<String, Object> params) {
        StringBuilder builder = new StringBuilder();
        
        for (String paramKey : params.keySet()) {
            builder.append(paramKey);
            builder.append("=");
            builder.append(params.get(paramKey));
        }
        
        return hexMD5(builder.toString());
    }
    
    public static String hexMD5(String value) {
        if (Logger.isDebugEnabled()) {
            Logger.debug(String.format("明文[MD5]:[%s]", value));
        }

        String cipher = Hex.encodeHexString(md5(value));

        if (Logger.isDebugEnabled()) {
            Logger.debug(String.format("密文[MD5]:[%s]", cipher));
        }

        return cipher;
    }

    private static byte[] md5(String message) {
        try {
            MessageDigest encoder = MessageDigest.getInstance("MD5");

            return encoder.digest(message.getBytes("UTF-8"));
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String randomSalt() {
        return randomSalt(SALT_LEN);
    }

    public static String randomSalt(int length) {
        byte[] salt = new byte[length];

        SecureRandom rnd = new SecureRandom();
        rnd.nextBytes(salt);

        return Codec.byteToHexString(salt);
    }

    public static String getInitVec(String privateKey) {
        try {
            byte[] raw = privateKey.getBytes(ENCODING);
            SecretKeySpec secret = new SecretKeySpec(raw, "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

            cipher.init(Cipher.ENCRYPT_MODE, secret);

            AlgorithmParameters params = cipher.getParameters();
            byte[] initVec = params.getParameterSpec(IvParameterSpec.class).getIV();

            return Codec.byteToHexString(initVec);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String getInitVec(String privateKey, String salt) {
        try {
            KeySpec spec = new PBEKeySpec(privateKey.toCharArray(),
                    Codec.hexStringToByte(salt), ITERATIONS, KEYLEN_BITS);
            SecretKey secret = new SecretKeySpec(keyFactory.generateSecret(spec).getEncoded(), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secret);

            AlgorithmParameters params = cipher.getParameters();
            byte[] initVec = params.getParameterSpec(IvParameterSpec.class).getIV();

            return Codec.byteToHexString(initVec);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getEncryptCipher(String privateKey) {
        try {
            byte[] raw = privateKey.getBytes(ENCODING);
            SecretKeySpec secret = new SecretKeySpec(raw, "AES");

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(ENCRYPT_MODE, secret);

            return cipher;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getEncryptCipher(String privateKey, String initVec) {
        try {
            byte[] raw = privateKey.getBytes(ENCODING);
            SecretKeySpec secret = new SecretKeySpec(raw, "AES");
            IvParameterSpec iv = new IvParameterSpec(Codec.hexStringToByte(initVec));

            return getEncryptCipher(secret, iv);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getEncryptCipher(String privateKey, String initVec, String salt) {
        try {
            KeySpec spec = new PBEKeySpec(privateKey.toCharArray(),
                    Codec.hexStringToByte(salt), ITERATIONS, KEYLEN_BITS);
            SecretKey secret = new SecretKeySpec(keyFactory.generateSecret(spec).getEncoded(), "AES");
            IvParameterSpec iv = new IvParameterSpec(Codec.hexStringToByte(initVec));

            return getEncryptCipher(secret, iv);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getEncryptCipher(SecretKey secret, IvParameterSpec iv) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(ENCRYPT_MODE, secret, iv);

            return cipher;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getDecryptCipher(String privateKey) {
        try {
            byte[] raw = privateKey.getBytes(ENCODING);
            SecretKeySpec secret = new SecretKeySpec(raw, "AES");

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(DECRYPT_MODE, secret);

            return cipher;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getDecryptCipher(String privateKey, String initVec) {
        try {
            byte[] raw = privateKey.getBytes(ENCODING);
            SecretKeySpec secret = new SecretKeySpec(raw, "AES");
            IvParameterSpec iv = new IvParameterSpec(Codec.hexStringToByte(initVec));

            return getDecryptCipher(secret, iv);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getDecryptCipher(String privateKey, String initVec, String salt) {
        try {
            KeySpec spec = new PBEKeySpec(privateKey.toCharArray(),
                    Codec.hexStringToByte(salt), ITERATIONS, KEYLEN_BITS);
            SecretKey secret = new SecretKeySpec(keyFactory.generateSecret(spec).getEncoded(), "AES");
            IvParameterSpec iv = new IvParameterSpec(Codec.hexStringToByte(initVec));

            return getDecryptCipher(secret, iv);
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    private static Cipher getDecryptCipher(SecretKey secret, IvParameterSpec iv) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(DECRYPT_MODE, secret, iv);

            return cipher;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String encryptAES(String value, String privateKey) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s]", privateKey));
            }

            Cipher cipher = getEncryptCipher(privateKey);

            String ciphertext = Codec.byteToHexString(cipher.doFinal(value.getBytes(ENCODING)));

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", ciphertext));
            }

            return ciphertext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String decryptAES(String value, String privateKey) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s]", privateKey));
            }

            Cipher cipher = getDecryptCipher(privateKey);

            String plaintext =  new String(cipher.doFinal(Codec.hexStringToByte(value)), ENCODING);

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", plaintext));
            }

            return plaintext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String encryptAES(String value, String privateKey, String initVec) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s] [initVec]:[%s]", privateKey, initVec));
            }

            Cipher cipher = getEncryptCipher(privateKey, initVec);

            String ciphertext = Codec.byteToHexString(cipher.doFinal(value.getBytes(ENCODING)));

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", ciphertext));
            }

            return ciphertext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String decryptAES(String value, String privateKey, String initVec) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s] [initVec]:[%s]", privateKey, initVec));
            }

            Cipher cipher = getDecryptCipher(privateKey, initVec);

            String plaintext =  new String(cipher.doFinal(Codec.hexStringToByte(value)), ENCODING);

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", plaintext));
            }

            return plaintext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String encryptAES(String value, String privateKey, String initVec, String salt) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s] [initVec]:[%s] [salt]:[%s]", privateKey, initVec, salt));
            }

            Cipher cipher = getEncryptCipher(privateKey, initVec, salt);

            String ciphertext =  Codec.byteToHexString(cipher.doFinal(value.getBytes(ENCODING)));

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", ciphertext));
            }

            return ciphertext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }

    public static String decryptAES(String value, String privateKey, String initVec, String salt) {
        try {
            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("密文[AES]:[%s]", value));
            	Logger.debug(String.format("[privateKey]:[%s] [initVec]:[%s] [salt]:[%s]", privateKey, initVec, salt));
            }

            Cipher cipher = getDecryptCipher(privateKey, initVec, salt);

            String plaintext =  new String(cipher.doFinal(Codec.hexStringToByte(value)), ENCODING);

            if (Logger.isDebugEnabled()) {
            	Logger.debug(String.format("明文[AES]:[%s]", plaintext));
            }
            
            return plaintext;
        } catch (Exception e) {
            throw new UnexpectedException(e);
        }
    }
    
}
