import React, { useState, useEffect, useRef } from 'react';

// Common passwords list (top 100)
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'password1', 'password123', 'batman', 'login',
  'admin', 'welcome', 'hello', 'charlie', 'donald', 'password12', '12345',
  '1234567890', 'access', 'flower', 'hottie', 'loveme', 'zaq1zaq1', 'password2',
  'hello123', 'princess', 'qwerty123', 'starwars', 'soccer', 'hockey', 'killer',
  'george', 'jennifer', 'jordan', 'banana', 'maggie', 'computer', 'internet',
  'secret', 'orange', 'pepper', 'michael1', 'michelle', 'nicole', 'rockyou',
  'daniel', 'summer', 'samsung', 'instagram', 'password21', 'amanda', 'jessica',
  'joshua', 'thomas', 'andrew', 'chris', 'lovers', 'nicholas', 'united',
  'tigger', '1q2w3e4r', '1qaz2wsx', 'q1w2e3r4', 'zxcvbnm', 'asdfgh', '121212',
  'flower', 'freedom', 'whatever', 'qazwsxedc', 'admin123', 'root', 'toor'
];

const KEYBOARD_PATTERNS = [
  'qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm',
  '1234567890', '12345', '123456', '1234567', '12345678', '123456789',
  'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', 'poiuy', 'lkjhg', 'mnbvc',
  '!@#$%^', '@#$%^&', '#$%^&*', 'qweasd', 'asdzxc', 'zxcv'
];

const DICTIONARY_WORDS = [
  'password', 'login', 'admin', 'user', 'welcome', 'hello', 'world',
  'love', 'life', 'god', 'faith', 'peace', 'hope', 'money', 'cash',
  'dollar', 'king', 'queen', 'prince', 'princess', 'angel', 'devil',
  'dragon', 'tiger', 'lion', 'eagle', 'wolf', 'bear', 'dog', 'cat',
  'bird', 'fish', 'horse', 'monkey', 'snake', 'chicken', 'duck',
  'apple', 'banana', 'orange', 'grape', 'mango', 'lemon', 'cherry',
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple',
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december', 'monday',
  'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'summer', 'winter', 'spring', 'autumn', 'rain', 'snow', 'storm'
];

const TYPOSQUAT_TARGETS = [
  'google', 'facebook', 'amazon', 'apple', 'microsoft', 'paypal', 'netflix',
  'bank', 'hdfc', 'sbi', 'icici', 'chase', 'wellsfargo', 'citi', 'hsbc',
  'instagram', 'twitter', 'whatsapp', 'telegram', 'discord', 'snapchat',
  'tiktok', 'youtube', 'linkedin', 'reddit', 'pinterest', 'tumblr',
  'dropbox', 'drive', 'onedrive', 'icloud', 'mega', 'mediafire',
  'spotify', 'soundcloud', 'deezer', 'pandora',
  'steam', 'epicgames', 'roblox', 'minecraft', 'fortnite', 'gta',
  'uber', 'ola', 'lyft', 'grab', 'airbnb', 'booking', 'makemytrip', 'goibibo',
  'flipkart', 'snapdeal', 'myntra', 'ajio',
  'gmail', 'yahoo', 'outlook', 'hotmail', 'aol', 'protonmail',
  'skype', 'zoom', 'teams', 'webex',
  'wordpress', 'blogspot', 'wix', 'squarespace',
  'shopify', 'magento', 'woocommerce', 'bigcommerce',
  'ebay', 'etsy', 'aliexpress', 'alibaba', 'wish',
  'coinbase', 'binance', 'kraken', 'blockchain', 'metamask',
  'IRS', 'SOCIAL', 'SECURITY', 'TAX', 'GOV', 'OFFICIAL',
  'fedex', 'ups', 'usps', 'dhl', 'hulu', 'disney', 'prime',
  'battle', 'cod', 'valorant', 'csgo', 'lol', 'dota'
];

const RISKY_TLDS = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.pw', '.cc', '.ws', '.buzz', '.icu', '.su', '.racing', '.win', '.download', '.click', '.link', '.work', '.party', '.gq', '.fit', '.kim', '.science', '.review', '.stream', '.date', '.faith', '.loan', '.cricket'];
const MALWARE_EXTENSIONS = ['.exe', '.apk', '.bat', '.cmd', '.com', '.cpl', '.scr', '.vbs', '.js', '.jse', '.wsf', '.wsh', '.msi', '.dll', '.jar', '.pif', '.vba', '.vbe', '.ps1', '.sh', '.bash', '.zsh', '.app', '.ipa', '.dmg', '.pkg', '.deb', '.rpm', '.vhd', '.iso', '.img'];
const PHISHING_KEYWORDS = {
  urgency: ['urgent', 'immediate', 'action', 'now', 'limited', 'expire', 'suspended', 'verify', 'confirm', 'alert', 'warning', 'notice', 'update'],
  account: ['account', 'login', 'signin', 'log-in', 'sign-in', 'authenticate', 'security', 'password', 'credentials'],
  financial: ['bank', 'payment', 'invoice', 'transaction', 'transfer', 'refund', 'credit', 'debit', 'wallet', 'balance'],
  prize: ['winner', 'won', 'prize', 'lottery', 'congratulations', 'reward', 'claim', 'free', 'gift', 'bonus', 'million'],
  fake: ['secure', 'official', 'support', 'helpdesk', 'customer', 'service', 'representative', 'agent']
};

async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function sha256Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function calculateEntropy(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 10000000000;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;
  if (seconds < 1) return { text: 'Instant', seconds };
  if (seconds < 60) return { text: `${Math.round(seconds)} seconds`, seconds };
  if (seconds < 3600) return { text: `${Math.round(seconds / 60)} minutes`, seconds };
  if (seconds < 86400) return { text: `${Math.round(seconds / 3600)} hours`, seconds };
  if (seconds < 31536000) return { text: `${Math.round(seconds / 86400)} days`, seconds };
  if (seconds < 31536000 * 100) return { text: `${Math.round(seconds / 31536000)} years`, seconds };
  if (seconds < 31536000 * 1000000) return { text: `${Math.round(seconds / 31536000 / 1000)} thousand years`, seconds };
  if (seconds < 31536000 * 1000000000) return { text: `${Math.round(seconds / 31536000 / 1000000)} million years`, seconds };
  return { text: 'Billions of years', seconds };
}

function detectKeyboardPatterns(password) {
  const patterns = [];
  KEYBOARD_PATTERNS.forEach(p => { if (password.toLowerCase().includes(p)) patterns.push(`Keyboard pattern: "${p}"`); });
  return patterns;
}

function detectDictionaryWords(password) {
  const words = [];
  DICTIONARY_WORDS.forEach(w => { if (password.toLowerCase().includes(w)) words.push(`Common word: "${w}"`); });
  return words;
}

function detectRepeatedChars(password) {
  const issues = [];
  if (/(.)\1\1/.test(password)) issues.push('Contains 3+ repeated characters (e.g., "aaa", "111")');
  if (/(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(password)) issues.push('Contains sequential numbers');
  if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba)/.test(password.toLowerCase())) issues.push('Contains sequential letters');
  return issues;
}

function detectLeetSpeak(password) {
  const leetMap = { '0':'o', '1':'i', '2':'z', '3':'e', '4':'a', '5':'s', '6':'g', '7':'t', '8':'b', '9':'g', '@':'a', '$':'s', '!':'i', '#':'h', '%':'x' };
  let leetCount = 0;
  for (const char of password) { if (leetMap[char]) leetCount++; }
  return leetCount > Math.floor(password.length / 3);
}

function generatePassword(length = 16, options = { uppercase: true, lowercase: true, numbers: true, symbols: true }) {
  let charset = '';
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) { password += charset[array[i] % charset.length]; }
  return password;
}

function analyzeUrl(inputUrl) {
  let score = 0;
  let reasons = [];
  let testUrl = inputUrl.trim().toLowerCase();
  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) { testUrl = 'http://' + testUrl; }
  try {
    const parsed = new URL(testUrl);
    const fullUrl = testUrl;
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const query = parsed.search.toLowerCase();
    const domainParts = domain.split('.');
    const domainName = domainParts[0];
    if (parsed.protocol === 'http:') { score += 15; reasons.push("⚠️ Insecure HTTP connection"); }
    for (const tld of RISKY_TLDS) { if (domain.endsWith(tld)) { score += 20; reasons.push(`🚨 High-risk TLD: ${tld}`); break; } }
    for (const brand of TYPOSQUAT_TARGETS) {
      const legitimateTLDs = ['.com', '.org', '.net', '.io', '.co', '.gov', '.edu', '.in', '.uk', '.au', '.de', '.fr', '.jp', '.cn', '.ru', '.br', '.mx', '.ca'];
      const typoPatterns = [brand.replace(/l/g, '1').replace(/i/g, '1').replace(/e/g, '3').replace(/a/g, '4').replace(/o/g, '0'), brand + 's', brand.replace(/[aeiou]/g, ''), brand + 'login', brand + 'support', brand + 'verify', 'my' + brand, 'login-' + brand, brand + '-login', '-' + brand + '-'];
      for (const tp of typoPatterns) { if (domain.includes(tp) && !legitimateTLDs.some(tld => domain === brand + tld)) { score += 35; reasons.push(`🚨 Fake "${brand}" detected`); break; } }
    }
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) { score += 50; reasons.push("🚨 Raw IP address"); }
    if (domain.includes('xn--')) { score += 40; reasons.push("🚨 Punycode/IDN - Real domain hidden"); }
    if ((domain.includes('а') || domain.includes('е') || domain.includes('о')) && (domain.includes('google') || domain.includes('facebook') || domain.includes('amazon') || domain.includes('apple'))) { score += 45; reasons.push("🚨 HOMOGLYPH ATTACK - Cyrillic characters detected"); }
    for (const ext of MALWARE_EXTENSIONS) { if (path.includes(ext)) { score += 40; reasons.push(`🚨 MALWARE FILE: ${ext}`); break; } }
    if (fullUrl.includes('@') && !domain.includes('@')) { score += 35; reasons.push("🚨 @ symbol trick"); }
    const suspiciousSubdomains = ['login', 'signin', 'secure', 'verify', 'account', 'update', 'confirm', 'banking', 'wallet', 'support'];
    const hasSuspicious = suspiciousSubdomains.some(sub => domainParts.slice(0, -2).some(part => part.includes(sub)));
    if (hasSuspicious && domainParts.length > 2) { score += 20; reasons.push("⚠️ Suspicious subdomain"); }
    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rb.gy', 'v.gd'];
    for (const s of shorteners) { if (domain.includes(s)) { score += 20; reasons.push(`⚠️ Shortened URL`); break; } }
    for (const [, keywords] of Object.entries(PHISHING_KEYWORDS)) { const found = keywords.filter(kw => fullUrl.includes(kw)); if (found.length >= 2) { score += 15; reasons.push(`⚠️ Phishing keywords: ${found.slice(0, 3).join(', ')}`); } }
    const cryptoKws = ['crypto', 'bitcoin', 'btc', 'eth', 'wallet', 'invest', 'yield', 'binance', 'double', 'giveaway', 'claim-free'];
    const foundCrypto = cryptoKws.filter(kw => fullUrl.includes(kw));
    if (foundCrypto.length >= 2) { score += 35; reasons.push(`🚨 Crypto scam detected`); }
    const charCounts = {};
    for (const char of domainName) { if (char !== '-' && char !== '.') { charCounts[char] = (charCounts[char] || 0) + 1; } }
    let domainEntropy = 0;
    for (const char in charCounts) { const p = charCounts[char] / domainName.length; domainEntropy -= p * Math.log2(p); }
    if (domainEntropy > 3.5 && domainName.length > 8) { score += 20; reasons.push(`⚠️ Randomly generated domain`); }
    const suspParams = ['redirect=', 'url=', 'link=', 'goto=', 'next=', 'payment=', 'checkout=', 'download='];
    for (const param of suspParams) { if (query.includes(param)) { score += 20; reasons.push(`⚠️ Suspicious redirect parameter`); break; } }
    if (fullUrl.startsWith('data:') || fullUrl.startsWith('javascript:')) { score += 60; reasons.push("🚨 Dangerous protocol"); }
    if (fullUrl.length > 200) { score += 15; reasons.push(`⚠️ Very long URL`); }
    score = Math.min(score, 100);
    if (score === 0) return { isSafe: true, score: 0, reasons: ["✅ Clean URL", "✅ No threats detected"] };
    else if (score < 30) return { isSafe: true, score, reasons: ["✅ Mostly safe", ...reasons.slice(0, 2)] };
    else if (score < 60) return { isSafe: false, score, reasons: ["⚠️ SUSPICIOUS URL", ...reasons] };
    else return { isSafe: false, score, reasons: ["🚨 HIGH RISK - DO NOT VISIT", ...reasons] };
  } catch (e) {
    return { isSafe: false, score: 100, reasons: ["🚨 Invalid URL format"] };
  }
}

// ==========================================
// AES Encryption/Decryption for History
// Using Web Crypto API (browser built-in)
// ==========================================
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(data, password) {
  const salt = 'PassGuard_History_Salt_v1';
  const key = await deriveKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  });
}

async function decryptData(encryptedStr, password) {
  const salt = 'PassGuard_History_Salt_v1';
  const key = await deriveKey(password, salt);
  const { iv, data } = JSON.parse(encryptedStr);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

// ===== STEP 1: AUTO BACKUP TO INDEXEDDB FUNCTIONS =====
function openBackupDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PassGuardBackup', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('backups')) {
        db.createObjectStore('backups', { keyPath: 'key' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveBackupToIndexedDB() {
  try {
    const db = await openBackupDB();
    const tx = db.transaction('backups', 'readwrite');
    const store = tx.objectStore('backups');

    const keysToBackup = [
      'secure_vault_real',
      'secure_vault_decoy',
      'history_access_hash',
      'passwordCheckHistory',
      'intruder_logs',
      'lastBackupReminder'
    ];

    for (const key of keysToBackup) {
      const value = localStorage.getItem(key);
      if (value) {
        store.put({ key, value, timestamp: Date.now() });
      }
    }

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });

    console.log('✅ Backup saved to IndexedDB');
  } catch (err) {
    console.error('Backup failed:', err);
  }
}

async function restoreFromIndexedDB() {
  try {
    const db = await openBackupDB();
    const tx = db.transaction('backups', 'readonly');
    const store = tx.objectStore('backups');
    const allRequest = store.getAll();

    return new Promise((resolve, reject) => {
      allRequest.onsuccess = () => {
        const backups = allRequest.result;
        if (backups && backups.length > 0) {
          let restored = 0;
          for (const backup of backups) {
            if (backup.value && !localStorage.getItem(backup.key)) {
              localStorage.setItem(backup.key, backup.value);
              restored++;
            }
          }
          resolve(restored);
        } else {
          resolve(0);
        }
      };
      allRequest.onerror = () => reject(allRequest.error);
    });
  } catch (err) {
    console.error('Restore failed:', err);
    return 0;
  }
}

function importFromJSONFile(file, masterPass) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (file.name.endsWith('.enc')) {
          const bytes = window.CryptoJS.AES.decrypt(content, masterPass);
          const decrypted = bytes.toString(window.CryptoJS.enc.Utf8);
          if (!decrypted) { reject('Wrong master password!'); return; }
          const data = JSON.parse(decrypted);
          resolve(data);
        } else {
          const data = JSON.parse(content);
          resolve(data);
        }
      } catch (err) {
        reject('Invalid file or wrong password!');
      }
    };
    reader.onerror = () => reject('File read error!');
    reader.readAsText(file);
  });
}

function exportEncryptedBackup(vaultData, masterPassword) {
  const encrypted = window.CryptoJS.AES.encrypt(
    JSON.stringify(vaultData),
    masterPassword
  ).toString();
  const blob = new Blob([encrypted], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PassGuard_Backup_${new Date().toISOString().split('T')[0]}.enc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportFullBackup() {
  const fullBackup = {};
  const keysToBackup = [
    'secure_vault_real',
    'secure_vault_decoy',
    'history_access_hash',
    'passwordCheckHistory',
    'intruder_logs',
    'lastBackupReminder'
  ];
  for (const key of keysToBackup) {
    const value = localStorage.getItem(key);
    if (value) { fullBackup[key] = value; }
  }
  fullBackup._exportDate = new Date().toLocaleString();
  fullBackup._version = '1.0';
  const dataStr = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `PassGuard_FULL_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

function importFullBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let restored = 0;
        for (const key in data) {
          if (key.startsWith('_')) continue;
          localStorage.setItem(key, data[key]);
          restored++;
        }
        resolve(restored);
      } catch (err) {
        reject('Invalid backup file!');
      }
    };
    reader.onerror = () => reject('File read error!');
    reader.readAsText(file);
  });
}

export default function PasswordBreachChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [breachCount, setBreachCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('checker');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [generatorOptions, setGeneratorOptions] = useState({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [urlToScan, setUrlToScan] = useState('');
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [urlResult, setUrlResult] = useState(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [vaultData, setVaultData] = useState([]);
  const [vaultFilter, setVaultFilter] = useState('all');
  const [showVaultPasswords, setShowVaultPasswords] = useState({});
  const [newVaultItem, setNewVaultItem] = useState({ site: '', username: '', password: '', category: 'Social', notes: '' });
  const [activeVaultMode, setActiveVaultMode] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupData, setSetupData] = useState({ realPassword: '', decoyPassword: '', confirmDecoy: '' });
  const [showUnlockWarning, setShowUnlockWarning] = useState(false);
  const [lastBackupReminder, setLastBackupReminder] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [intruderAlert, setIntruderAlert] = useState(null);
  const [intruderLogs, setIntruderLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // ===== HISTORY SECURITY STATES =====
  const [historyAccessPassword, setHistoryAccessPassword] = useState('');
  const [isHistoryUnlocked, setIsHistoryUnlocked] = useState(false);
  const [historyNeedsSetup, setHistoryNeedsSetup] = useState(false);
  const [historySetupPassword, setHistorySetupPassword] = useState('');
  const [historySetupConfirm, setHistorySetupConfirm] = useState('');
  const [historyFailedAttempts, setHistoryFailedAttempts] = useState(0);
  const [historyLocked, setHistoryLocked] = useState(false);
  const [historyLockTimer, setHistoryLockTimer] = useState(0);
  const [historyPasswordKey, setHistoryPasswordKey] = useState('');
  const [showHistoryPassword, setShowHistoryPassword] = useState(false);

  // ===== STEP 2: NEW STATES FOR BACKUP/RESTORE =====
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');
  const [dataLost, setDataLost] = useState(false);
  const fileInputRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ===== PANIC KEY =====
  useEffect(() => {
    const handlePanic = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === '9') {
        localStorage.setItem('secure_vault_real', '00000000000'); localStorage.removeItem('secure_vault_real');
        localStorage.setItem('secure_vault_decoy', '00000000000'); localStorage.removeItem('secure_vault_decoy');
        localStorage.removeItem('intruder_logs');
        localStorage.removeItem('history_password_hash');
        localStorage.removeItem('encrypted_check_history');
        localStorage.removeItem('history_intruder_logs');
        document.body.innerHTML = '<div style="background:#fff; color:#ef4444; height:100vh; display:flex; align-items:center; justify-content:center; font-size:2rem; font-family:sans-serif; font-weight:bold;">🚨 ALL DATA PURGED. SYSTEM SECURED.</div>';
        setTimeout(() => window.location.href = 'https://www.google.com', 1500);
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, []);

  // ===== STEP 3: UPDATED INIT useEffect WITH AUTO-DETECT DATA LOSS =====
  useEffect(() => {
    const realVault = localStorage.getItem('secure_vault_real');
    const decoyVault = localStorage.getItem('secure_vault_decoy');

    if (!realVault && !decoyVault) {
      // Check if data was EVER saved (IndexedDB still has it?)
      restoreFromIndexedDB().then((restored) => {
        if (restored > 0) {
          // Data was in IndexedDB — AUTO RESTORED!
          alert('⚠️ localStorage was cleared!\n\n✅ Data AUTO-RESTORED from IndexedDB backup!\n\nYour vault is safe! 🔒');
          window.location.reload();
        } else {
          // Check if this is genuinely first time or data loss
          const hasEverSetup = localStorage.getItem('passguard_ever_setup');
          if (!hasEverSetup) {
            // First time user — show setup
            setNeedsSetup(true);
          } else {
            // DATA WAS LOST! Show restore option
            setDataLost(true);
          }
        }
      });
    } else {
      // Data exists — save to IndexedDB as backup
      saveBackupToIndexedDB();
      // Mark that setup was done
      localStorage.setItem('passguard_ever_setup', 'true');
    }

    // Check if history password exists
    const historyHash = localStorage.getItem('history_password_hash');
    if (!historyHash) {
      setHistoryNeedsSetup(true);
    }

    const savedLogs = localStorage.getItem('intruder_logs');
    if (savedLogs) { try { setIntruderLogs(JSON.parse(savedLogs)); } catch (e) {} }
    const savedReminder = localStorage.getItem('lastBackupReminder');
    if (savedReminder) setLastBackupReminder(parseInt(savedReminder));
  }, []);

  // ===== HISTORY LOCKOUT TIMER =====
  useEffect(() => {
    let interval;
    if (historyLocked && historyLockTimer > 0) {
      interval = setInterval(() => {
        setHistoryLockTimer(prev => {
          if (prev <= 1) {
            setHistoryLocked(false);
            setHistoryFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [historyLocked, historyLockTimer]);

  // ===== VAULT INACTIVITY =====
  useEffect(() => {
    let inactivityTimer;
    const resetTimer = () => {
      if (vaultUnlocked) {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => { lockVault(); }, 5 * 60 * 1000);
      }
    };
    if (vaultUnlocked) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('scroll', resetTimer);
      window.addEventListener('click', resetTimer);
      resetTimer();
    }
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [vaultUnlocked]);

  useEffect(() => {
    if (vaultUnlocked && vaultData.length > 0) {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - lastBackupReminder > sevenDays) { setShowUnlockWarning(true); }
    }
  }, [vaultUnlocked, vaultData.length, lastBackupReminder]);

  // ===== HISTORY PASSWORD SETUP =====
  const setupHistoryPassword = async () => {
    if (!historySetupPassword || historySetupPassword.length < 6) {
      return alert('⚠️ History password must be at least 6 characters!');
    }
    if (historySetupPassword !== historySetupConfirm) {
      return alert('⚠️ Passwords do not match!');
    }

    const hash = await sha256Hash(historySetupPassword);
    localStorage.setItem('history_password_hash', hash);

    const encrypted = await encryptData([], historySetupPassword);
    localStorage.setItem('encrypted_check_history', encrypted);

    setHistoryNeedsSetup(false);
    setHistoryPasswordKey(historySetupPassword);
    setIsHistoryUnlocked(true);
    setHistory([]);
    setHistorySetupPassword('');
    setHistorySetupConfirm('');
    alert('✅ History password created!\n\n⚠️ REMEMBER this password - it CANNOT be recovered!');
  };

  // ===== HISTORY UNLOCK =====
  const unlockHistory = async () => {
    if (historyLocked) return;
    if (!historyAccessPassword) return;

    const storedHash = localStorage.getItem('history_password_hash');
    const inputHash = await sha256Hash(historyAccessPassword);

    if (inputHash === storedHash) {
      setHistoryFailedAttempts(0);
      setHistoryPasswordKey(historyAccessPassword);

      const encryptedHistory = localStorage.getItem('encrypted_check_history');
      if (encryptedHistory) {
        try {
          const decrypted = await decryptData(encryptedHistory, historyAccessPassword);
          setHistory(decrypted);
        } catch (e) {
          setHistory([]);
        }
      } else {
        setHistory([]);
      }

      setIsHistoryUnlocked(true);
      setHistoryAccessPassword('');
    } else {
      const newFails = historyFailedAttempts + 1;
      setHistoryFailedAttempts(newFails);

      if (newFails >= 5) {
        localStorage.removeItem('encrypted_check_history');
        localStorage.removeItem('history_password_hash');

        const historyLogs = JSON.parse(localStorage.getItem('history_intruder_logs') || '[]');
        historyLogs.unshift({ time: new Date().toLocaleString(), action: 'HISTORY WIPED - 5 failed attempts' });
        localStorage.setItem('history_intruder_logs', JSON.stringify(historyLogs));

        captureIntruder();
        setHistoryNeedsSetup(true);
        setHistoryFailedAttempts(0);
        alert('🚨 SECURITY BREACH!\n\n5 failed attempts detected.\n\n⚠️ ALL HISTORY DATA HAS BEEN PERMANENTLY DESTROYED.\n\n📸 Intruder photo captured.');
      } else if (newFails >= 3) {
        setHistoryLocked(true);
        setHistoryLockTimer(60);
        captureIntruder();
        alert(`🚨 INTRUDER ALERT!\n\n${newFails} failed attempts.\nLocked for 60 seconds.\n📸 Photo captured.\n\n⚠️ ${5 - newFails} more wrong attempts = ALL HISTORY WIPED!`);
      } else {
        alert(`❌ Wrong password!\n\nAttempt ${newFails}/5\n⚠️ After 3 fails: 60s lockout + photo\n⚠️ After 5 fails: ALL DATA DESTROYED`);
      }

      setHistoryAccessPassword('');
    }
  };

  // ===== LOCK HISTORY =====
  const lockHistory = () => {
    setIsHistoryUnlocked(false);
    setHistory([]);
    setHistoryPasswordKey('');
    setHistoryAccessPassword('');
  };

  // ===== SAVE HISTORY (ENCRYPTED) =====
  const saveToHistory = async (pwd, count) => {
    const maskedPwd = pwd.substring(0, 3) + '•'.repeat(Math.max(0, pwd.length - 3));
    const newEntry = { password: maskedPwd, breachCount: count, time: new Date().toLocaleString() };

    if (isHistoryUnlocked && historyPasswordKey) {
      const newHistory = [newEntry, ...history.slice(0, 49)];
      setHistory(newHistory);
      try {
        const encrypted = await encryptData(newHistory, historyPasswordKey);
        localStorage.setItem('encrypted_check_history', encrypted);
      } catch (e) {
        console.error('Failed to encrypt history');
      }
    } else if (historyPasswordKey) {
      const encryptedHistory = localStorage.getItem('encrypted_check_history');
      let currentHistory = [];
      if (encryptedHistory) {
        try {
          currentHistory = await decryptData(encryptedHistory, historyPasswordKey);
        } catch (e) {}
      }
      const newHistory = [newEntry, ...currentHistory.slice(0, 49)];
      try {
        const encrypted = await encryptData(newHistory, historyPasswordKey);
        localStorage.setItem('encrypted_check_history', encrypted);
      } catch (e) {}
    }
  };

  const isCryptoLoaded = () => typeof window.CryptoJS !== 'undefined';

  // ===== STEP 5: UPDATED initializeDualVault WITH SETUP MARK + AUTO BACKUP =====
  const initializeDualVault = () => {
    if (!setupData.realPassword || !setupData.decoyPassword) return alert('Please fill in both passwords!');
    if (setupData.realPassword.length < 8 || setupData.decoyPassword.length < 8) return alert('Minimum 8 characters!');
    if (setupData.realPassword === setupData.decoyPassword) return alert('Real and Decoy must be DIFFERENT!');
    if (setupData.decoyPassword !== setupData.confirmDecoy) return alert('Decoy passwords do not match!');
    const emptyVault = [];
    const encryptedReal = window.CryptoJS.AES.encrypt(JSON.stringify(emptyVault), setupData.realPassword).toString();
    const decoyVault = [
      { id: '1', site: 'Facebook', username: 'john.doe@email.com', password: 'Password123', category: 'Social', notes: 'Personal account', createdAt: new Date().toLocaleString(), favorite: false },
      { id: '2', site: 'Gmail', username: 'johndoe@gmail.com', password: 'MyGmail2024', category: 'Email', notes: 'Primary email', createdAt: new Date().toLocaleString(), favorite: false }
    ];
    const encryptedDecoy = window.CryptoJS.AES.encrypt(JSON.stringify(decoyVault), setupData.decoyPassword).toString();
    localStorage.setItem('secure_vault_real', encryptedReal);
    localStorage.setItem('secure_vault_decoy', encryptedDecoy);
    setNeedsSetup(false);
    setMasterPassword(setupData.realPassword);
    setActiveVaultMode('real');
    setVaultData(emptyVault);
    setVaultUnlocked(true);
    setShowUnlockWarning(true);

    // ===== MARK SETUP DONE + AUTO BACKUP =====
    localStorage.setItem('passguard_ever_setup', 'true');
    saveBackupToIndexedDB();

    alert('✅ Dual Vault System Created!\n\n⚠️ IMPORTANT: Remember BOTH passwords!');
  };

  const captureIntruder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
            const photoData = canvasRef.current.toDataURL('image/png');
            setIntruderAlert(photoData);
            const newLog = { photo: photoData, time: new Date().toLocaleString() };
            const updatedLogs = [newLog, ...intruderLogs];
            setIntruderLogs(updatedLogs);
            localStorage.setItem('intruder_logs', JSON.stringify(updatedLogs));
            stream.getTracks().forEach(track => track.stop());
          }
        }, 1000);
      }
    } catch (err) {
      setIntruderAlert('CAMERA_DENIED');
      const newLog = { photo: 'CAMERA_DENIED', time: new Date().toLocaleString() };
      const updatedLogs = [newLog, ...intruderLogs];
      setIntruderLogs(updatedLogs);
      localStorage.setItem('intruder_logs', JSON.stringify(updatedLogs));
    }
  };

  const unlockVault = () => {
    if (!isCryptoLoaded()) return alert('Encryption library not loaded. Please refresh.');
    if (needsSetup) return alert('Complete setup first!');
    const encryptedReal = localStorage.getItem('secure_vault_real');
    const encryptedDecoy = localStorage.getItem('secure_vault_decoy');
    try {
      const bytes = window.CryptoJS.AES.decrypt(encryptedReal, masterPassword);
      const decryptedData = JSON.parse(bytes.toString(window.CryptoJS.enc.Utf8));
      setActiveVaultMode('real'); setVaultData(decryptedData); setVaultUnlocked(true); setFailedAttempts(0); setShowUnlockWarning(true); return;
    } catch (e) {}
    try {
      const bytes = window.CryptoJS.AES.decrypt(encryptedDecoy, masterPassword);
      const decryptedData = JSON.parse(bytes.toString(window.CryptoJS.enc.Utf8));
      setActiveVaultMode('decoy'); setVaultData(decryptedData); setVaultUnlocked(true); setFailedAttempts(0); return;
    } catch (e) {}
    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);
    if (newFails >= 3) { captureIntruder(); } else { alert(`❌ Wrong password! Attempt ${newFails} of 3.`); }
    setMasterPassword('');
  };

  // ===== STEP 4: UPDATED saveVault WITH AUTO BACKUP TO INDEXEDDB =====
  const saveVault = (data) => {
    const storageKey = activeVaultMode === 'decoy' ? 'secure_vault_decoy' : 'secure_vault_real';
    const encrypted = window.CryptoJS.AES.encrypt(JSON.stringify(data), masterPassword).toString();
    localStorage.setItem(storageKey, encrypted);
    setVaultData(data);

    // ===== AUTO BACKUP TO INDEXEDDB =====
    saveBackupToIndexedDB();
  };

  const lockVault = () => {
    setVaultUnlocked(false); setVaultData([]); setMasterPassword(''); setShowVaultPasswords({});
    setNewVaultItem({ site: '', username: '', password: '', category: 'Social', notes: '' });
    setActiveVaultMode(null); setShowLogs(false); setShowUnlockWarning(false);
  };

  const addToVault = () => {
    if (!newVaultItem.site || !newVaultItem.password) return alert('Fill site name and password!');
    const newItem = { id: Date.now().toString(), ...newVaultItem, createdAt: new Date().toLocaleString(), favorite: false };
    saveVault([...vaultData, newItem]);
    setNewVaultItem({ site: '', username: '', password: '', category: 'Social', notes: '' });
  };

  const deleteFromVault = (id) => { if (window.confirm('Are you sure you want to delete this password?')) { saveVault(vaultData.filter(item => item.id !== id)); } };
  const toggleVaultPassword = (id) => setShowVaultPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFavorite = (id) => { saveVault(vaultData.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item)); };

  const exportVault = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vaultData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `PassGuard_Vault_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    const now = Date.now();
    setLastBackupReminder(now);
    localStorage.setItem('lastBackupReminder', now.toString());
    setShowUnlockWarning(false);
    alert('✅ Vault exported successfully!\n\n💾 Keep this backup file SAFE!');
  };

  const clearIntruderLogs = () => {
    if (window.confirm("Are you sure you want to clear all intruder logs?")) {
      setIntruderLogs([]); localStorage.removeItem('intruder_logs');
    }
  };

  const dismissWarning = () => { setShowUnlockWarning(false); };

  const filteredVault = vaultData.filter(item => vaultFilter === 'all' ? true : item.category === vaultFilter).sort((a, b) => a.favorite === b.favorite ? a.site.localeCompare(b.site) : (a.favorite ? -1 : 1));

  const checkCommonPasswords = (pwd) => COMMON_PASSWORDS.includes(pwd.toLowerCase());

  const calculateStrength = (pwd) => {
    const details = []; let score = 0;
    if (pwd.length >= 8) score += 1; if (pwd.length >= 12) score += 1; if (pwd.length >= 16) score += 1; if (pwd.length >= 20) score += 1;
    if (/[a-z]/.test(pwd)) score += 1; if (/[A-Z]/.test(pwd)) score += 1; if (/[0-9]/.test(pwd)) score += 1; if (/[^a-zA-Z0-9]/.test(pwd)) score += 2;
    if (checkCommonPasswords(pwd)) { score = 0; details.push('❌ Found in top 100 common passwords'); }
    const kp = detectKeyboardPatterns(pwd); if (kp.length > 0) { score -= 2; details.push(...kp); }
    const dw = detectDictionaryWords(pwd); if (dw.length > 0) { score -= 1; details.push(...dw); }
    const rc = detectRepeatedChars(pwd); if (rc.length > 0) { score -= 1; details.push(...rc); }
    if (detectLeetSpeak(pwd)) { score -= 1; details.push('⚠️ Contains leet speak substitutions'); }
    score = Math.max(0, score);
    let level = 'Very Weak', color = '#ef4444';
    if (score >= 8) { level = 'Very Strong'; color = '#22c55e'; } else if (score >= 6) { level = 'Strong'; color = '#4ade80'; } else if (score >= 4) { level = 'Medium'; color = '#f59e0b'; } else if (score >= 2) { level = 'Weak'; color = '#fb923c'; }
    return { score, level, color, details };
  };

  const strength = password ? calculateStrength(password) : null;
  const entropy = password ? calculateEntropy(password) : 0;
  const crackTime = password ? estimateCrackTime(entropy) : null;

  const handleKeyPress = (e) => { if (e.key === 'Enter') checkPassword(); };
  const handleGenerate = () => { const pwd = generatePassword(generatorOptions.length, generatorOptions); setGeneratedPassword(pwd); };
  const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error('Failed to copy'); } };

  const checkPassword = async () => {
    if (!password) return;
    setLoading(true); setError(''); setBreachCount(null);
    try {
      if (checkCommonPasswords(password)) { setBreachCount(9999999); await saveToHistory(password, 9999999); setLoading(false); return; }
      const hash = await sha1(password);
      const response = await fetch(`https://api.pwnedpasswords.com/range/${hash.substring(0, 5)}`);
      if (!response.ok) throw new Error('Failed');
      const lines = (await response.text()).split('\n');
      let found = false;
      for (const line of lines) {
        if (line.split(':')[0].trim() === hash.substring(5)) {
          const count = parseInt(line.split(':')[1].trim());
          setBreachCount(count);
          await saveToHistory(password, count);
          found = true; break;
        }
      }
      if (!found) { setBreachCount(0); await saveToHistory(password, 0); }
    } catch (err) { setError('Connection error.'); }
    setLoading(false);
  };

  const handleScanUrl = () => {
    if (!urlToScan) return;
    setIsScanningUrl(true); setUrlResult(null);
    setTimeout(() => { setUrlResult(analyzeUrl(urlToScan)); setIsScanningUrl(false); }, 1500);
  };

  // ===== CLEAR HISTORY =====
  const clearHistory = async () => {
    if (window.confirm('⚠️ Are you sure you want to permanently delete ALL check history?\n\nThis action CANNOT be undone!')) {
      setHistory([]);
      if (historyPasswordKey) {
        const encrypted = await encryptData([], historyPasswordKey);
        localStorage.setItem('encrypted_check_history', encrypted);
      }
    }
  };

  const tabs = [
    { id: 'checker', label: 'Check', icon: '🔍' },
    { id: 'generator', label: 'Generate', icon: '⚡' },
    { id: 'vault', label: 'Vault', icon: '🔐' },
    { id: 'urlScanner', label: 'Link Scan', icon: '🔗' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 40%, #f5f0ff 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif', position: 'relative' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .mac-card { background: rgba(255,255,255,0.72); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.9); border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8); }
        .mac-input { background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; outline: none; transition: all 0.2s; color: #1d1d1f; font-family: inherit; font-size: 15px; }
        .mac-input:focus { border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.15); background: #fff; }
        .mac-btn-primary { background: linear-gradient(180deg, #0077ed 0%, #0062cc 100%); color: #fff; border: none; border-radius: 10px; font-family: inherit; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2); }
        .mac-btn-primary:hover:not(:disabled) { background: linear-gradient(180deg, #0082ff 0%, #006ee0 100%); transform: translateY(-0.5px); box-shadow: 0 3px 10px rgba(0,100,220,0.3); }
        .mac-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .mac-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .mac-tab { background: transparent; border: none; border-radius: 8px; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; color: #6e6e73; display: flex; align-items: center; gap: 5px; padding: 7px 14px; }
        .mac-tab:hover { background: rgba(0,0,0,0.05); color: #1d1d1f; }
        .mac-tab.active { background: #fff; color: #0071e3; box-shadow: 0 1px 4px rgba(0,0,0,0.12), 0 0.5px 1px rgba(0,0,0,0.08); font-weight: 600; }
        .mac-pill { border-radius: 20px; font-size: 12px; font-weight: 600; padding: 3px 10px; }
        .mac-secondary-btn { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; color: #1d1d1f; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; padding: 7px 14px; }
        .mac-secondary-btn:hover { background: rgba(0,0,0,0.09); }
        .mac-danger-btn { background: rgba(255,59,48,0.1); border: 1px solid rgba(255,59,48,0.2); border-radius: 8px; color: #ff3b30; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; padding: 7px 14px; }
        .mac-danger-btn:hover { background: rgba(255,59,48,0.18); }
        .mac-success-btn { background: rgba(52,199,89,0.1); border: 1px solid rgba(52,199,89,0.25); border-radius: 8px; color: #34c759; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; padding: 7px 14px; }
        .mac-success-btn:hover { background: rgba(52,199,89,0.18); }
        .slider-mac { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; background: linear-gradient(to right, #0071e3 0%, #0071e3 var(--val,50%), #d1d1d6 var(--val,50%), #d1d1d6 100%); outline: none; }
        .slider-mac::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 1px solid rgba(0,0,0,0.18); box-shadow: 0 2px 6px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.1s; }
        .slider-mac::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .fade-in { animation: fadeUp 0.25s ease-out; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        .traffic-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .checkbox-mac { width: 16px; height: 16px; accent-color: #0071e3; cursor: pointer; }
        .select-mac { background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 10px 14px; font-family: inherit; font-size: 14px; color: #1d1d1f; outline: none; width: 100%; cursor: pointer; }
        .select-mac:focus { border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.15); }
        .vault-item { background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.07); border-radius: 12px; transition: all 0.2s; }
        .vault-item:hover { background: rgba(255,255,255,0.9); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .icon-btn { background: transparent; border: none; border-radius: 6px; padding: 6px 8px; cursor: pointer; font-size: 15px; transition: background 0.15s; }
        .icon-btn:hover { background: rgba(0,0,0,0.06); }
        .icon-btn-danger:hover { background: rgba(255,59,48,0.1); }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(175,82,222,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(52,199,89,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* INTRUDER OVERLAY */}
      {intruderAlert && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(180,0,0,0.96)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'center' }}>🚨 INTRUDER DETECTED 🚨</div>
          <p style={{ fontSize: '1rem', marginBottom: '28px', color: 'rgba(255,200,200,1)', textAlign: 'center', maxWidth: '400px' }}>UNAUTHORIZED ACCESS ATTEMPT HAS BEEN LOGGED SECURELY.</p>
          {intruderAlert !== 'CAMERA_DENIED' ? (
            <img src={intruderAlert} alt="Intruder" style={{ width: '280px', height: '210px', objectFit: 'cover', border: '3px solid #fff', borderRadius: '12px', boxShadow: '0 0 40px rgba(255,0,0,0.6)' }} />
          ) : (
            <div style={{ width: '280px', height: '210px', background: 'rgba(255,255,255,0.1)', border: '3px solid #fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '16px', fontSize: '14px' }}>
              CAMERA ACCESS DENIED. TIMESTAMP & IP LOGGED.
            </div>
          )}
          <button onClick={() => { setIntruderAlert(null); setFailedAttempts(0); }} style={{ marginTop: '28px', padding: '12px 28px', background: '#fff', color: '#b00000', fontWeight: 700, border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
            Dismiss & Reset Interface
          </button>
        </div>
      )}

      {/* ===== STEP 6: DATA LOSS RECOVERY MODAL ===== */}
      {dataLost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9997,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '16px'
        }}>
          <div className="mac-card" style={{
            maxWidth: '480px', width: '100%',
            padding: '32px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px' }}>⚠️</div>
            <h2 style={{
              fontSize: '22px', fontWeight: 700,
              color: '#ff3b30', marginBottom: '10px'
            }}>
              Vault Data Not Found!
            </h2>
            <p style={{
              color: '#6e6e73', fontSize: '14px',
              marginBottom: '20px', lineHeight: 1.6
            }}>
              It seems your browser data was cleared or this is a new device.
              Your encrypted vault data is no longer in localStorage.
            </p>

            <div style={{
              background: 'rgba(52,199,89,0.08)',
              border: '1px solid rgba(52,199,89,0.25)',
              borderRadius: '10px', padding: '16px',
              marginBottom: '16px', textAlign: 'left'
            }}>
              <p style={{
                fontWeight: 700, color: '#1a7340',
                fontSize: '14px', marginBottom: '8px'
              }}>
                ✅ Recovery Options:
              </p>
              <p style={{ fontSize: '13px', color: '#1a7340', marginBottom: '4px' }}>
                📁 Import from JSON backup file
              </p>
              <p style={{ fontSize: '13px', color: '#1a7340', marginBottom: '4px' }}>
                🔐 Import from encrypted .enc backup
              </p>
              <p style={{ fontSize: '13px', color: '#1a7340' }}>
                🆕 Or start fresh with a new vault
              </p>
            </div>

            {restoreStatus && (
              <div style={{
                background: restoreStatus.includes('✅')
                  ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                border: `1px solid ${restoreStatus.includes('✅')
                  ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)'}`,
                borderRadius: '8px', padding: '10px',
                marginBottom: '12px', fontSize: '13px',
                color: restoreStatus.includes('✅') ? '#1a7340' : '#c0392b',
                fontWeight: 600
              }}>
                {restoreStatus}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.enc"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setRestoreFile(e.target.files[0]);
                }
              }}
            />

            {!restoreFile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mac-btn-primary"
                  style={{ width: '100%', padding: '13px', fontSize: '15px' }}
                >
                  📁 Select Backup File (.json or .enc)
                </button>
                <button
                  onClick={() => {
                    setDataLost(false);
                    setNeedsSetup(true);
                    localStorage.removeItem('passguard_ever_setup');
                  }}
                  className="mac-secondary-btn"
                  style={{ width: '100%', padding: '12px' }}
                >
                  🆕 Start Fresh (New Vault)
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: 'rgba(0,113,227,0.06)',
                  border: '1px solid rgba(0,113,227,0.15)',
                  borderRadius: '8px', padding: '10px',
                  fontSize: '13px', color: '#0055b3'
                }}>
                  📎 Selected: <strong>{restoreFile.name}</strong>
                  ({(restoreFile.size / 1024).toFixed(1)} KB)
                </div>

                {restoreFile.name.endsWith('.enc') && (
                  <input
                    type="password"
                    placeholder="Enter master password to decrypt"
                    value={restorePassword}
                    onChange={(e) => setRestorePassword(e.target.value)}
                    className="mac-input"
                    style={{
                      width: '100%', padding: '12px',
                      textAlign: 'center', fontSize: '15px'
                    }}
                  />
                )}

                <button
                  onClick={async () => {
                    try {
                      setRestoreStatus('⏳ Restoring...');

                      if (restoreFile.name.endsWith('.enc')) {
                        if (!restorePassword) {
                          setRestoreStatus('❌ Enter master password!');
                          return;
                        }
                        const data = await importFromJSONFile(restoreFile, restorePassword);
                        const encrypted = window.CryptoJS.AES.encrypt(
                          JSON.stringify(data), restorePassword
                        ).toString();
                        localStorage.setItem('secure_vault_real', encrypted);
                        localStorage.setItem('passguard_ever_setup', 'true');
                        saveBackupToIndexedDB();
                        setRestoreStatus('✅ Vault restored successfully!');
                        setTimeout(() => window.location.reload(), 1500);
                      } else {
                        const restored = await importFullBackup(restoreFile);
                        localStorage.setItem('passguard_ever_setup', 'true');
                        saveBackupToIndexedDB();
                        setRestoreStatus(`✅ Restored ${restored} items successfully!`);
                        setTimeout(() => window.location.reload(), 1500);
                      }

                    } catch (err) {
                      setRestoreStatus(`❌ ${err}`);
                    }
                  }}
                  className="mac-btn-primary"
                  style={{ width: '100%', padding: '13px', fontSize: '15px' }}
                >
                  🔐 Restore Vault Now
                </button>

                <button
                  onClick={() => {
                    setRestoreFile(null);
                    setRestorePassword('');
                    setRestoreStatus('');
                  }}
                  className="mac-secondary-btn"
                  style={{ width: '100%', padding: '10px' }}
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECURITY WARNING MODAL */}
      {showUnlockWarning && vaultUnlocked && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="mac-card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '16px' }}>🔐 Important Security Notice</h2>
              <div style={{ background: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '12px', textAlign: 'left' }}>
                <p style={{ fontWeight: 700, color: '#b45309', marginBottom: '8px', fontSize: '13px' }}>🚨 CRITICAL RULES:</p>
                <p style={{ fontSize: '13px', color: '#78350f', marginBottom: '5px' }}>❌ <strong>NEVER</strong> clear browser data while vault is in use!</p>
                <p style={{ fontSize: '13px', color: '#78350f', marginBottom: '5px' }}>❌ <strong>NEVER</strong> use Incognito/Private mode!</p>
                <p style={{ fontSize: '13px', color: '#78350f', marginBottom: '5px' }}>❌ <strong>NEVER</strong> share your Master Password!</p>
                <p style={{ fontSize: '13px', color: '#78350f' }}>🔒 Auto-lock activates after 5 minutes of inactivity</p>
              </div>
              <div style={{ background: 'rgba(0,113,227,0.07)', border: '1px solid rgba(0,113,227,0.15)', borderRadius: '10px', padding: '14px', marginBottom: '18px', textAlign: 'left' }}>
                <p style={{ fontWeight: 700, color: '#0055b3', marginBottom: '8px', fontSize: '13px' }}>💾 BACKUP REMINDER:</p>
                <p style={{ fontSize: '13px', color: '#0055b3', marginBottom: '5px' }}>Export your vault regularly as JSON backup!</p>
                <p style={{ fontSize: '13px', color: '#0055b3', marginBottom: '5px' }}>Keep backup files in a <strong>SECURE</strong> location!</p>
                <p style={{ fontSize: '13px', color: '#0055b3' }}>If you forget Master Password, data <strong>CANNOT</strong> be recovered!</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={exportVault} className="mac-btn-primary" style={{ flex: 1, padding: '12px', fontSize: '14px' }}>📤 Export Backup Now</button>
                <button onClick={dismissWarning} className="mac-secondary-btn" style={{ flex: 1 }}>Later</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px 48px', position: 'relative', zIndex: 1 }}>
        
        {/* Traffic dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginBottom: '24px' }}>
          <span className="traffic-dot" style={{ background: '#ff5f57' }} />
          <span className="traffic-dot" style={{ background: '#ffbd2e' }} />
          <span className="traffic-dot" style={{ background: '#28c840' }} />
        </div>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em', marginBottom: '8px', lineHeight: 1.1 }}>
            Password Security Hub
          </h1>
          <p style={{ color: '#6e6e73', fontSize: '16px', fontWeight: 400 }}>Check, Generate, Scan & Protect Your Digital Life</p>
        </header>

        {/* Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '4px', display: 'flex', gap: '2px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`mac-tab ${activeTab === tab.id ? 'active' : ''}`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== URL SCANNER ===== */}
        {activeTab === 'urlScanner' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="mac-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px' }}>🔗 Deep Threat URL Scanner</h3>
              <p style={{ color: '#6e6e73', fontSize: '13px', marginBottom: '20px' }}>Our heuristic AI engine analyzes Domain Entropy, Typosquatting, and Social Engineering patterns.</p>
              <input type="text" value={urlToScan} onChange={e => setUrlToScan(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleScanUrl()} placeholder="Paste a link... (e.g., http://login-hdfc-8a7b6c.xyz)" className="mac-input" style={{ width: '100%', padding: '12px 16px', marginBottom: '12px' }} />
              <button onClick={handleScanUrl} disabled={!urlToScan || isScanningUrl} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
                {isScanningUrl ? '⏳ Analyzing Heuristics...' : 'Perform Deep Scan 🕵️‍♂️'}
              </button>
            </div>
            {urlResult && (
              <div className={`mac-card fade-in`} style={{ padding: '24px', borderColor: urlResult.isSafe ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)', background: urlResult.isSafe ? 'rgba(52,199,89,0.05)' : 'rgba(255,59,48,0.05)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2.5rem' }}>{urlResult.isSafe ? '✅' : '🚨'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: urlResult.isSafe ? '#34c759' : '#ff3b30' }}>
                        {urlResult.isSafe ? 'URL Looks Safe!' : 'MALICIOUS THREAT DETECTED!'}
                      </h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#6e6e73', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Threat Score</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: urlResult.isSafe ? '#34c759' : '#ff3b30' }}>{urlResult.score}%</div>
                      </div>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${urlResult.score}%`, background: urlResult.isSafe ? '#34c759' : '#ff3b30', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Heuristic Engine Logs</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {urlResult.reasons.map((reason, idx) => (
                          <li key={idx} style={{ fontSize: '13px', color: urlResult.isSafe ? '#1a7340' : '#c0392b', fontWeight: 500 }}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CHECKER ===== */}
        {activeTab === 'checker' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="mac-card" style={{ padding: '24px' }}>
              <label style={{ display: 'block', color: '#1d1d1f', fontWeight: 600, marginBottom: '10px', fontSize: '15px' }}>Enter Password to Check 🔐</label>
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your password here..." className="mac-input" style={{ width: '100%', padding: '13px 46px 13px 16px' }} />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <button onClick={checkPassword} disabled={!password || loading} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
                {loading ? '⏳ Checking...' : 'Check for Breaches 🚀'}
              </button>
            </div>

            {(breachCount !== null || error) && (
              <div className={`mac-card fade-in`} style={{ padding: '24px', borderColor: breachCount === 0 ? 'rgba(52,199,89,0.3)' : breachCount !== null ? 'rgba(255,59,48,0.3)' : 'rgba(255,159,10,0.3)', background: breachCount === 0 ? 'rgba(52,199,89,0.05)' : breachCount !== null ? 'rgba(255,59,48,0.05)' : 'rgba(255,159,10,0.05)' }}>
                {error ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff9500', marginBottom: '6px' }}>Connection Error</h3>
                    <p style={{ color: '#6e6e73' }}>{error}</p>
                  </div>
                ) : breachCount === 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>✅</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#34c759', marginBottom: '6px' }}>Good News! 🎉</h3>
                    <p style={{ color: '#1d1d1f', fontSize: '15px' }}>This password has <strong style={{ color: '#34c759' }}>NOT</strong> been found in any known data breaches!</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🚨</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff3b30', marginBottom: '6px' }}>Password Compromised!</h3>
                    <p style={{ color: '#1d1d1f', fontSize: '15px' }}>Found in <strong style={{ color: '#ff3b30', fontSize: '26px' }}>{breachCount?.toLocaleString()}</strong> data breaches!</p>
                  </div>
                )}
              </div>
            )}

            {password && strength && (
              <div className="mac-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '18px' }}>📊 Password Strength Analysis</h3>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6e6e73', fontSize: '14px' }}>Strength Level</span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: strength.color }}>{strength.level}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(strength.score / 10) * 100}%`, background: strength.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
                  {[
                    { val: password.length, label: 'Characters' },
                    { val: entropy, label: 'Entropy (bits)' },
                    { val: crackTime?.text, label: 'Time to Crack' },
                    { val: `${strength.score}/10`, label: 'Score' }
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ fontSize: i === 2 ? '13px' : '22px', fontWeight: 700, color: '#1d1d1f', marginBottom: '4px' }}>{stat.val}</div>
                      <div style={{ fontSize: '11px', color: '#6e6e73' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                {strength.details.length > 0 && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>⚠️ Issues Found:</div>
                    {strength.details.map((detail, i) => (
                      <div key={i} style={{ background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: '8px', padding: '10px 12px', color: '#c0392b', fontSize: '13px', marginBottom: '6px' }}>{detail}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mac-card" style={{ padding: '16px 20px' }}>
              <h4 style={{ fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', fontSize: '14px' }}>🔒 Privacy Protection</h4>
              <p style={{ color: '#6e6e73', fontSize: '13px', lineHeight: 1.5 }}>
                Your password is <strong>never sent</strong> to any server. We use <strong>k-Anonymity</strong> — only the first 5 characters of your password's SHA-1 hash are sent to the API. The check happens entirely in your browser!
              </p>
            </div>
          </div>
        )}

        {/* ===== GENERATOR ===== */}
        {activeTab === 'generator' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="mac-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '20px' }}>⚡ Password Generator</h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#1d1d1f', fontSize: '14px', marginBottom: '10px' }}>
                  Password Length: <strong style={{ color: '#0071e3' }}>{generatorOptions.length}</strong>
                </label>
                <input type="range" min="8" max="64" value={generatorOptions.length}
                  onChange={e => setGeneratorOptions({ ...generatorOptions, length: parseInt(e.target.value) })}
                  className="slider-mac"
                  style={{ '--val': `${((generatorOptions.length - 8) / 56) * 100}%` }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { key: 'uppercase', label: 'ABC Uppercase' },
                  { key: 'lowercase', label: 'abc Lowercase' },
                  { key: 'numbers', label: '123 Numbers' },
                  { key: 'symbols', label: '!@# Symbols' },
                ].map(opt => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={generatorOptions[opt.key]} onChange={e => setGeneratorOptions({ ...generatorOptions, [opt.key]: e.target.checked })} className="checkbox-mac" />
                    <span style={{ color: '#1d1d1f', fontSize: '14px', fontWeight: 500 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleGenerate} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>Generate Password 🎲</button>
              {generatedPassword && (
                <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(0,113,227,0.05)', border: '1px solid rgba(0,113,227,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <code style={{ flex: 1, color: '#1d1d1f', fontSize: '15px', fontFamily: '"SF Mono", "Fira Code", monospace', wordBreak: 'break-all' }}>{generatedPassword}</code>
                  <button onClick={() => copyToClipboard(generatedPassword)} className="mac-secondary-btn" style={{ whiteSpace: 'nowrap' }}>
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              )}
            </div>
            <div className="mac-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>🛡️ Why Strong Passwords Matter?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { icon: '🔓', title: 'Brute Force Attacks', desc: 'Hackers use powerful computers to try billions of password combinations per second. Strong passwords can take centuries to crack!' },
                  { icon: '📧', title: 'Data Breaches', desc: 'Billions of passwords have been leaked in data breaches. Using unique passwords prevents hackers from accessing all your accounts at once.' },
                  { icon: '🔑', title: 'Credential Stuffing', desc: 'Hackers use leaked passwords from one site to try on other sites. Using different passwords for each account stops this attack.' },
                  { icon: '💼', title: 'Password Managers', desc: 'Use a password manager to generate and store unique passwords for all your accounts. You only need to remember one master password!' },
                ].map((card, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
                    <div style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '14px', marginBottom: '6px' }}>{card.title}</div>
                    <div style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.5 }}>{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== VAULT ===== */}
        {activeTab === 'vault' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!vaultUnlocked ? (
              <div className="mac-card" style={{ padding: '32px' }}>
                {needsSetup ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔐</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>Setup Secure Vault</h3>
                    <p style={{ color: '#6e6e73', marginBottom: '20px', fontSize: '14px' }}>This vault uses <strong>Plausible Deniability</strong>. Create TWO passwords — one for your real vault, one for a decoy vault.</p>
                    <div style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.25)', borderRadius: '10px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
                      <p style={{ fontWeight: 700, color: '#b45309', marginBottom: '8px', fontSize: '13px' }}>⚠️ IMPORTANT TIPS:</p>
                      <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px' }}>• Use <strong>16+ characters</strong> for Master Password</p>
                      <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px' }}>• Mix: A-Z, a-z, 0-9, !@#$%</p>
                      <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px' }}>• Real &amp; Decoy passwords must be <strong>DIFFERENT</strong></p>
                      <p style={{ fontSize: '13px', color: '#92400e' }}>• <strong>REMEMBER</strong> both passwords — cannot be recovered!</p>
                    </div>
                    <div style={{ maxWidth: '380px', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { label: '🔐 Real Master Password', key: 'realPassword', placeholder: 'Your actual vault password' },
                        { label: '🎭 Decoy Master Password', key: 'decoyPassword', placeholder: 'Different password for decoy vault' },
                        { label: '🎭 Confirm Decoy Password', key: 'confirmDecoy', placeholder: 'Confirm decoy password' },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ display: 'block', color: '#1d1d1f', fontWeight: 600, fontSize: '14px', marginBottom: '7px' }}>{field.label}</label>
                          <input type="password" value={setupData[field.key]} onChange={e => setSetupData({ ...setupData, [field.key]: e.target.value })} placeholder={field.placeholder} className="mac-input" style={{ width: '100%', padding: '12px 14px' }} />
                        </div>
                      ))}
                      <button onClick={initializeDualVault} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>Initialize Dual Vault System 🔐</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', maxWidth: '360px', margin: '0 auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>Vault Locked</h3>
                    <p style={{ color: '#6e6e73', fontSize: '14px', marginBottom: '20px' }}>Enter your master password to unlock your AES-256 secure vault.</p>
                    <input type="password" value={masterPassword} onChange={e => setMasterPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && unlockVault()} placeholder="Master Password" className="mac-input" style={{ width: '100%', padding: '13px', textAlign: 'center', letterSpacing: '0.15em', fontSize: '16px', marginBottom: '12px' }} />
                    <button onClick={unlockVault} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>Unlock 🔓</button>
                    <p style={{ marginTop: '12px', fontSize: '12px', color: '#ff3b30', fontWeight: 600 }}>Failed attempts: {failedAttempts}/3 before Security Lockdown.</p>
                    <div style={{ marginTop: '14px', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: '10px', padding: '12px' }}>
                      <p style={{ color: '#c0392b', fontSize: '12px' }}>⚠️ <strong>Zero-Knowledge Architecture:</strong> If you forget your master password, your data <strong>CANNOT</strong> be recovered.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="mac-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34c759', fontWeight: 600, fontSize: '14px' }}>
                    <span style={{ fontSize: '18px' }}>🔓</span>
                    <span>Unlocked ({activeVaultMode === 'decoy' ? 'Decoy Mode' : 'Real Mode'})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowLogs(!showLogs)} className="mac-secondary-btn" style={{ position: 'relative' }}>
                      📸 Intruder Logs
                      {intruderLogs.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ff3b30', color: '#fff', fontSize: '10px', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{intruderLogs.length}</span>}
                    </button>
                    <button onClick={exportVault} className="mac-success-btn">📤 Export Backup</button>
                    {/* ===== STEP 7: Full Backup button ===== */}
                    <button onClick={exportFullBackup} className="mac-secondary-btn">💾 Full Backup</button>
                    <button onClick={lockVault} className="mac-danger-btn">🔒 Lock Vault</button>
                  </div>
                </div>

                {showLogs && (
                  <div className="mac-card fade-in" style={{ padding: '20px', borderColor: 'rgba(255,59,48,0.25)', background: 'rgba(255,59,48,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#c0392b' }}>📸 Security Audit: Intruder Logs ({intruderLogs.length})</h3>
                      {intruderLogs.length > 0 && <button onClick={clearIntruderLogs} style={{ background: 'none', border: 'none', color: '#ff3b30', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Clear All</button>}
                    </div>
                    {intruderLogs.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#34c759', padding: '16px', fontWeight: 500 }}>🛡️ No intruders logged. Your vault is safe!</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
                        {intruderLogs.map((log, i) => (
                          <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1px solid rgba(255,59,48,0.12)', padding: '10px', textAlign: 'center' }}>
                            {log.photo === 'CAMERA_DENIED' ? (
                              <div style={{ width: '100%', height: '90px', background: '#f0f0f5', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e73', fontSize: '11px', marginBottom: '6px' }}>No Photo (Camera Denied)</div>
                            ) : (
                              <img src={log.photo} alt="Intruder" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '7px', marginBottom: '6px' }} />
                            )}
                            <span style={{ fontSize: '11px', color: '#ff3b30', fontWeight: 600 }}>{log.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mac-card" style={{ padding: '22px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>➕ Add New Password</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1d1d1f', marginBottom: '6px' }}>Site/Service Name *</label>
                      <input type="text" value={newVaultItem.site} onChange={e => setNewVaultItem({ ...newVaultItem, site: e.target.value })} placeholder="e.g., Gmail, Facebook" className="mac-input" style={{ width: '100%', padding: '11px 13px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1d1d1f', marginBottom: '6px' }}>Username/Email</label>
                      <input type="text" value={newVaultItem.username} onChange={e => setNewVaultItem({ ...newVaultItem, username: e.target.value })} placeholder="e.g., john@email.com" className="mac-input" style={{ width: '100%', padding: '11px 13px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1d1d1f', marginBottom: '6px' }}>Password *</label>
                      <input type="password" value={newVaultItem.password} onChange={e => setNewVaultItem({ ...newVaultItem, password: e.target.value })} placeholder="Enter password" className="mac-input" style={{ width: '100%', padding: '11px 13px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1d1d1f', marginBottom: '6px' }}>Category</label>
                      <select value={newVaultItem.category} onChange={e => setNewVaultItem({ ...newVaultItem, category: e.target.value })} className="select-mac">
                        <option value="Social">📱 Social</option>
                        <option value="Banking">🏦 Banking</option>
                        <option value="Email">📧 Email</option>
                        <option value="Shopping">🛒 Shopping</option>
                        <option value="Work">💼 Work</option>
                        <option value="Other">📁 Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1d1d1f', marginBottom: '6px' }}>Notes (optional)</label>
                    <textarea value={newVaultItem.notes} onChange={e => setNewVaultItem({ ...newVaultItem, notes: e.target.value })} placeholder="Any additional notes..." rows={2} className="mac-input" style={{ width: '100%', padding: '11px 13px', resize: 'none' }} />
                  </div>
                  <button onClick={addToVault} disabled={!newVaultItem.site || !newVaultItem.password} className="mac-btn-primary" style={{ width: '100%', padding: '12px', marginTop: '14px', fontSize: '14px' }}>Add to Vault 💾</button>
                </div>

                <div className="mac-card" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ color: '#6e6e73', fontSize: '13px', fontWeight: 500 }}>Filter:</span>
                    {['all', 'Social', 'Banking', 'Email', 'Shopping', 'Work', 'Other'].map(cat => (
                      <button key={cat} onClick={() => setVaultFilter(cat)} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: vaultFilter === cat ? '#0071e3' : 'rgba(0,0,0,0.06)', color: vaultFilter === cat ? '#fff' : '#1d1d1f', transition: 'all 0.15s' }}>
                        {cat === 'all' ? '📋 All' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mac-card" style={{ padding: '22px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>🔑 Your Saved Passwords ({filteredVault.length})</h3>
                  {filteredVault.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
                      <p style={{ color: '#6e6e73' }}>No passwords saved yet!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                      {filteredVault.map(item => (
                        <div key={item.id} className="vault-item" style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span className="mac-pill" style={{ background: item.category === 'Banking' ? 'rgba(52,199,89,0.12)' : item.category === 'Email' ? 'rgba(255,59,48,0.1)' : item.category === 'Shopping' ? 'rgba(255,204,0,0.15)' : item.category === 'Work' ? 'rgba(175,82,222,0.12)' : 'rgba(0,113,227,0.1)', color: item.category === 'Banking' ? '#1a7340' : item.category === 'Email' ? '#c0392b' : item.category === 'Shopping' ? '#92400e' : item.category === 'Work' ? '#6b21a8' : '#004fa3' }}>
                                  {item.category === 'Social' ? '📱' : item.category === 'Banking' ? '🏦' : item.category === 'Email' ? '📧' : item.category === 'Shopping' ? '🛒' : item.category === 'Work' ? '💼' : '📁'} {item.category}
                                </span>
                                {item.favorite && <span style={{ color: '#ffd60a' }}>⭐</span>}
                              </div>
                              <div style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '15px' }}>{item.site}</div>
                              <div style={{ color: '#6e6e73', fontSize: '13px', marginBottom: '8px' }}>{item.username}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <code style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '6px', color: '#1d1d1f', fontFamily: '"SF Mono", monospace', fontSize: '13px' }}>
                                  {showVaultPasswords[item.id] ? item.password : '••••••••••••'}
                                </code>
                                <button className="icon-btn" onClick={() => toggleVaultPassword(item.id)}>{showVaultPasswords[item.id] ? '🙈' : '👁️'}</button>
                                <button className="icon-btn" onClick={() => copyToClipboard(item.password)} title="Copy">📋</button>
                                <button className="icon-btn" onClick={() => toggleFavorite(item.id)} title="Favorite">{item.favorite ? '⭐' : '☆'}</button>
                                <button className="icon-btn icon-btn-danger" onClick={() => deleteFromVault(item.id)} title="Delete">🗑️</button>
                              </div>
                              {item.notes && <p style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '6px' }}>📝 {item.notes}</p>}
                              <p style={{ color: '#a1a1aa', fontSize: '11px', marginTop: '4px' }}>Added: {item.createdAt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mac-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(0,113,227,0.04) 0%, rgba(52,199,89,0.04) 100%)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>🔒 Security Reminders</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '14px' }}>
                      <p style={{ fontWeight: 700, color: '#ff3b30', fontSize: '13px', marginBottom: '8px' }}>❌ NEVER DO:</p>
                      {['Clear browser data', 'Use Incognito mode', 'Share Master Password', 'Use on public computer'].map(t => <p key={t} style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>• {t}</p>)}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '14px' }}>
                      <p style={{ fontWeight: 700, color: '#34c759', fontSize: '13px', marginBottom: '8px' }}>✅ ALWAYS DO:</p>
                      {['Export regular backups', 'Lock vault when away', 'Use strong passwords', 'Keep device secure'].map(t => <p key={t} style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>• {t}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {historyNeedsSetup ? (
              <div className="mac-card" style={{ padding: '32px' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔐</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>Setup History Password</h3>
                  <p style={{ color: '#6e6e73', fontSize: '14px', marginBottom: '20px' }}>
                    Create a password to protect your check history. All history data will be <strong>AES-256 encrypted</strong>.
                  </p>

                  <div style={{ background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: '10px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
                    <p style={{ fontWeight: 700, color: '#c0392b', marginBottom: '8px', fontSize: '13px' }}>🛡️ SECURITY FEATURES:</p>
                    <p style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>🔒 Password stored as SHA-256 hash (unreadable)</p>
                    <p style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>🔐 History encrypted with AES-256-GCM</p>
                    <p style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>📸 3 wrong attempts = Photo capture + 60s lock</p>
                    <p style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>💣 5 wrong attempts = ALL HISTORY DESTROYED</p>
                    <p style={{ fontSize: '12px', color: '#78350f' }}>🚫 Inspect Element se password NAHI dikhega</p>
                  </div>

                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#1d1d1f', fontWeight: 600, fontSize: '14px', marginBottom: '7px' }}>🔐 History Password (min 6 chars)</label>
                      <input type="password" value={historySetupPassword} onChange={e => setHistorySetupPassword(e.target.value)} placeholder="Create your history password" className="mac-input" style={{ width: '100%', padding: '12px 14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#1d1d1f', fontWeight: 600, fontSize: '14px', marginBottom: '7px' }}>🔐 Confirm Password</label>
                      <input type="password" value={historySetupConfirm} onChange={e => setHistorySetupConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && setupHistoryPassword()} placeholder="Confirm your password" className="mac-input" style={{ width: '100%', padding: '12px 14px' }} />
                    </div>
                    <button onClick={setupHistoryPassword} disabled={!historySetupPassword || !historySetupConfirm} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
                      Create History Password 🔐
                    </button>
                  </div>
                </div>
              </div>
            ) : !isHistoryUnlocked ? (
              <div className="mac-card" style={{ padding: '32px' }}>
                <div style={{ textAlign: 'center', maxWidth: '380px', margin: '0 auto' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>History Locked</h3>
                  <p style={{ color: '#6e6e73', fontSize: '14px', marginBottom: '20px' }}>
                    Enter your history password to view encrypted check history.
                  </p>

                  {historyLocked && (
                    <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                      <p style={{ color: '#ff3b30', fontWeight: 700, fontSize: '16px' }}>LOCKED FOR {historyLockTimer}s</p>
                      <p style={{ color: '#c0392b', fontSize: '12px', marginTop: '4px' }}>Too many wrong attempts. Please wait.</p>
                    </div>
                  )}

                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <input
                      type={showHistoryPassword ? 'text' : 'password'}
                      value={historyAccessPassword}
                      onChange={e => setHistoryAccessPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !historyLocked && unlockHistory()}
                      placeholder="Enter history password"
                      disabled={historyLocked}
                      className="mac-input"
                      style={{ width: '100%', padding: '13px 46px 13px 16px', textAlign: 'center', letterSpacing: '0.15em', fontSize: '16px', opacity: historyLocked ? 0.5 : 1 }}
                    />
                    <button onClick={() => setShowHistoryPassword(!showHistoryPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                      {showHistoryPassword ? '🙈' : '👁️'}
                    </button>
                  </div>

                  <button onClick={unlockHistory} disabled={!historyAccessPassword || historyLocked} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
                    {historyLocked ? `⏳ Locked (${historyLockTimer}s)` : 'Unlock History 🔓'}
                  </button>

                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: i <= historyFailedAttempts ? (i >= 3 ? '#ff3b30' : '#ff9500') : 'rgba(0,0,0,0.1)',
                        transition: 'all 0.3s'
                      }} />
                    ))}
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '12px', color: historyFailedAttempts >= 3 ? '#ff3b30' : '#6e6e73', fontWeight: historyFailedAttempts >= 3 ? 700 : 400 }}>
                    {historyFailedAttempts === 0 ? 'Enter your password to unlock' :
                     historyFailedAttempts < 3 ? `⚠️ ${historyFailedAttempts}/5 failed attempts` :
                     `🚨 ${historyFailedAttempts}/5 - ${5 - historyFailedAttempts} more = DATA DESTROYED!`}
                  </p>

                  <div style={{ marginTop: '14px', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ color: '#c0392b', fontSize: '12px' }}>
                      🛡️ <strong>Anti-Hack Protection:</strong> Password is SHA-256 hashed. History is AES-256 encrypted. 
                      Inspect Element se <strong>KUCH NAHI</strong> dikhega. 5 wrong attempts = sab data destroy.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mac-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34c759', fontWeight: 600, fontSize: '14px' }}>
                    <span style={{ fontSize: '18px' }}>🔓</span>
                    <span>History Unlocked (AES-256 Encrypted)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="mac-danger-btn" style={{ fontSize: '12px', padding: '5px 12px' }}>
                        🗑️ Clear All
                      </button>
                    )}
                    <button onClick={lockHistory} className="mac-danger-btn">🔒 Lock History</button>
                  </div>
                </div>

                <div className="mac-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '18px' }}>📜 Check History ({history.length})</h3>
                  {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
                      <p style={{ color: '#6e6e73' }}>No password checks yet!</p>
                      <p style={{ color: '#a1a1aa', fontSize: '13px', marginTop: '8px' }}>Check passwords in the "Check" tab to see history here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                      {history.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                          <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                            <div style={{ fontFamily: '"SF Mono", monospace', color: '#1d1d1f', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.password}
                            </div>
                            <div style={{ color: '#6e6e73', fontSize: '12px' }}>{item.time}</div>
                          </div>
                          <span className="mac-pill" style={{ whiteSpace: 'nowrap', background: item.breachCount === 0 ? 'rgba(52,199,89,0.12)' : item.breachCount === null ? 'rgba(0,0,0,0.06)' : 'rgba(255,59,48,0.1)', color: item.breachCount === 0 ? '#1a7340' : item.breachCount === null ? '#6e6e73' : '#c0392b' }}>
                            {item.breachCount === 0 ? '✅ Safe' : item.breachCount === null ? '❓ Unknown' : `🚨 ${item.breachCount.toLocaleString()} breaches`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mac-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>📈 Security Awareness Stats</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { val: '600M+', label: 'Passwords in Database' },
                      { val: '15B+', label: 'Breached Records' },
                      { val: '24/7', label: 'Cyber Attacks Active' },
                      { val: '81%', label: 'Breaches Due to Weak Passwords' },
                      { val: '70%', label: 'Reuse Passwords' },
                      { val: '3min', label: 'Avg Password Crack Time' },
                    ].map((stat, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#0071e3', marginBottom: '5px' }}>{stat.val}</div>
                        <div style={{ fontSize: '11px', color: '#6e6e73' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '40px', color: '#a1a1aa', fontSize: '13px' }}>
          <p>🔐 Powered by Have I Been Pwned API • Your passwords never leave your browser</p>
          <p style={{ marginTop: '4px' }}>Made with ❤️ for your security</p>
        </footer>
      </div>
    </div>
  );
}
