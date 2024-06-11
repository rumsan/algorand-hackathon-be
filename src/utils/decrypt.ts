import * as CryptoJS from 'crypto-js';

export const decryptMessage = (encryptedData: string) => {
  const secretKey = process.env.SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
