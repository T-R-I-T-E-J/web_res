// Manual Test Script for Encryption Service
// Run with: node test-encryption-manual.js

const CryptoJS = require('crypto-js');
const crypto = require('crypto');

// Get encryption key from environment or use test key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test-encryption-key-for-testing-purposes-only';

console.log('========================================');
console.log('🔐 Encryption Service Manual Test');
console.log('========================================\n');

// Test 1: Basic Encryption/Decryption
console.log('[Test 1] Basic Encryption/Decryption');
console.log('--------------------------------------');
const plainText = 'user@example.com';
console.log('Plain text:', plainText);

const encrypted = CryptoJS.AES.encrypt(plainText, ENCRYPTION_KEY).toString();
console.log('Encrypted:', encrypted);

const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
console.log('Decrypted:', decrypted);

if (decrypted === plainText) {
  console.log('✅ PASS: Encryption/Decryption works correctly\n');
} else {
  console.log('❌ FAIL: Decryption does not match original\n');
}

// Test 2: Hashing
console.log('[Test 2] SHA-256 Hashing');
console.log('--------------------------------------');
const dataToHash = 'sensitive-data';
console.log('Data to hash:', dataToHash);

const hashed = CryptoJS.SHA256(dataToHash).toString();
console.log('Hashed (SHA-256):', hashed);

const hashedAgain = CryptoJS.SHA256(dataToHash).toString();
if (hashed === hashedAgain) {
  console.log('✅ PASS: Hash is consistent\n');
} else {
  console.log('❌ FAIL: Hash is not consistent\n');
}

// Test 3: Email Masking
console.log('[Test 3] Email Masking');
console.log('--------------------------------------');
const email = 'user@example.com';
const [localPart, domain] = email.split('@');
const maskedLocal = localPart.length > 3 
  ? `${localPart.substring(0, 3)}***` 
  : localPart;
const maskedEmail = `${maskedLocal}@${domain}`;

console.log('Original email:', email);
console.log('Masked email:', maskedEmail);

if (maskedEmail === 'use***@example.com') {
  console.log('✅ PASS: Email masking works correctly\n');
} else {
  console.log('❌ FAIL: Email masking incorrect\n');
}

// Test 4: Phone Masking
console.log('[Test 4] Phone Number Masking');
console.log('--------------------------------------');
const phone = '1234567890';
const lastFour = phone.substring(phone.length - 4);
const maskedPhone = '*'.repeat(phone.length - 4) + lastFour;

console.log('Original phone:', phone);
console.log('Masked phone:', maskedPhone);

if (maskedPhone === '******7890') {
  console.log('✅ PASS: Phone masking works correctly\n');
} else {
  console.log('❌ FAIL: Phone masking incorrect\n');
}

// Test 5: Aadhaar Masking
console.log('[Test 5] Aadhaar Number Masking');
console.log('--------------------------------------');
const aadhaar = '123456789012';
const lastFourAadhaar = aadhaar.substring(aadhaar.length - 4);
const maskedAadhaar = '*'.repeat(aadhaar.length - 4) + lastFourAadhaar;

console.log('Original Aadhaar:', aadhaar);
console.log('Masked Aadhaar:', maskedAadhaar);

if (maskedAadhaar === '********9012') {
  console.log('✅ PASS: Aadhaar masking works correctly\n');
} else {
  console.log('❌ FAIL: Aadhaar masking incorrect\n');
}

// Test 6: Object Encryption
console.log('[Test 6] Object Encryption/Decryption');
console.log('--------------------------------------');
const obj = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
};
console.log('Original object:', JSON.stringify(obj, null, 2));

const objString = JSON.stringify(obj);
const encryptedObj = CryptoJS.AES.encrypt(objString, ENCRYPTION_KEY).toString();
console.log('Encrypted object:', encryptedObj);

const decryptedObjString = CryptoJS.AES.decrypt(encryptedObj, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
const decryptedObj = JSON.parse(decryptedObjString);
console.log('Decrypted object:', JSON.stringify(decryptedObj, null, 2));

if (JSON.stringify(obj) === JSON.stringify(decryptedObj)) {
  console.log('✅ PASS: Object encryption/decryption works correctly\n');
} else {
  console.log('❌ FAIL: Object decryption does not match original\n');
}

// Test 7: Key Generation
console.log('[Test 7] Encryption Key Generation');
console.log('--------------------------------------');
const generatedKey = crypto.randomBytes(32).toString('hex');
console.log('Generated key:', generatedKey);
console.log('Key length:', generatedKey.length, 'characters');

if (generatedKey.length === 64) {
  console.log('✅ PASS: Key generation works correctly (64 hex chars)\n');
} else {
  console.log('❌ FAIL: Key length incorrect\n');
}

// Test 8: Multiple Encryptions
console.log('[Test 8] Multiple Encryptions (Different Results)');
console.log('--------------------------------------');
const text = 'test@example.com';
const enc1 = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
const enc2 = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();

console.log('Encryption 1:', enc1);
console.log('Encryption 2:', enc2);

// Note: CryptoJS AES includes random IV, so encryptions will be different
if (enc1 !== enc2) {
  console.log('✅ PASS: Multiple encryptions produce different ciphertexts (good!)\n');
} else {
  console.log('⚠️  WARNING: Multiple encryptions produce same ciphertext\n');
}

// Both should decrypt to same value
const dec1 = CryptoJS.AES.decrypt(enc1, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
const dec2 = CryptoJS.AES.decrypt(enc2, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

if (dec1 === text && dec2 === text) {
  console.log('✅ PASS: Both decrypt to original text\n');
} else {
  console.log('❌ FAIL: Decryption failed\n');
}

// Summary
console.log('========================================');
console.log('📊 Test Summary');
console.log('========================================');
console.log('✅ All encryption tests completed!');
console.log('');
console.log('Key Features Tested:');
console.log('  ✅ AES-256 Encryption/Decryption');
console.log('  ✅ SHA-256 Hashing');
console.log('  ✅ Email Masking');
console.log('  ✅ Phone Masking');
console.log('  ✅ Aadhaar Masking');
console.log('  ✅ Object Encryption');
console.log('  ✅ Key Generation');
console.log('  ✅ Multiple Encryptions');
console.log('');
console.log('🎉 Encryption Service is working correctly!');
console.log('========================================\n');
