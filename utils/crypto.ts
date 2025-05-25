async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: "SHA-256"
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
}

async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const spki = await window.crypto.subtle.exportKey("spki", publicKey);
  const base64 = arrayBufferToBase64(spki);
  return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
}

async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const base64 = arrayBufferToBase64(pkcs8);
  return `-----BEGIN PRIVATE KEY-----\n${base64.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;
}

export async function generateKeys(): Promise<{ publicKey: string; privateKey: string }> {
  const { publicKey, privateKey } = await generateKeyPair();
  const publicPem = await exportPublicKey(publicKey);
  const privatePem = await exportPrivateKey(privateKey);
  return { publicKey: publicPem, privateKey: privatePem };
}
