// Fonctions de sécurité locales. Elles ne remplacent pas un serveur d'authentification.
const TaskFlowSecurity = (() => {
  const encoder = new TextEncoder();

  function passwordRules(password) {
    const length = [...password].length;
    return {
      length: length >= 8 && length <= 64,
      uppercase: /\p{Lu}/u.test(password),
      lowercase: /\p{Ll}/u.test(password),
      number: /\p{N}/u.test(password),
      special: /[\p{P}\p{S}]/u.test(password),
    };
  }

  function assessPassword(password, username = '') {
    const rules = passwordRules(password);
    const length = [...password].length;
    const simplePattern = /(password|motdepasse|azerty|qwerty|1234|abcd|(.)\2{3,})/i.test(password);
    const containsUsername = username.length >= 3 && password.toLocaleLowerCase().includes(username.toLocaleLowerCase());
    if (!Object.values(rules).every(Boolean) || simplePattern || containsUsername) return 'weak';
    if (length >= 16) return 'strong';
    if (length >= 12) return 'medium';
    return 'weak';
  }

  function toBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
  }

  function fromBase64(value) {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  }

  async function deriveKey(password, salt) {
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: fromBase64(salt), iterations: 250000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async function encrypt(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data)));
    return { iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) };
  }

  async function decrypt(key, encrypted) {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(encrypted.iv) },
      key,
      fromBase64(encrypted.ciphertext),
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  function lockoutMinutes(failures) {
    return failures < 3 ? 0 : 5 * 2 ** (failures - 3);
  }

  return { passwordRules, assessPassword, toBase64, deriveKey, encrypt, decrypt, lockoutMinutes };
})();

if (typeof module !== 'undefined') module.exports = TaskFlowSecurity;
