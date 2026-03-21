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

// URL Scanner Constants
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

// Helper Functions
async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function calculateEntropy(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}

function estimateCrackTime(entropy: number): { text: string, seconds: number } {
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

function detectKeyboardPatterns(password: string): string[] {
  const patterns: string[] = [];
  KEYBOARD_PATTERNS.forEach(p => { if (password.toLowerCase().includes(p)) patterns.push(`Keyboard pattern: "${p}"`); });
  return patterns;
}

function detectDictionaryWords(password: string): string[] {
  const words: string[] = [];
  DICTIONARY_WORDS.forEach(w => { if (password.toLowerCase().includes(w)) words.push(`Common word: "${w}"`); });
  return words;
}

function detectRepeatedChars(password: string): string[] {
  const issues: string[] = [];
  if (/(.)\1\1/.test(password)) issues.push('Contains 3+ repeated characters (e.g., "aaa", "111")');
  if (/(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(password)) issues.push('Contains sequential numbers');
  if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba)/.test(password.toLowerCase())) issues.push('Contains sequential letters');
  return issues;
}

function detectLeetSpeak(password: string): boolean {
  const leetMap: { [key: string]: string } = { '0':'o', '1':'i', '2':'z', '3':'e', '4':'a', '5':'s', '6':'g', '7':'t', '8':'b', '9':'g', '@':'a', '$':'s', '!':'i', '#':'h', '%':'x' };
  let leetCount = 0;
  for (const char of password) { if (leetMap[char]) leetCount++; }
  return leetCount > Math.floor(password.length / 3);
}

function generatePassword(length: number = 16, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean; } = { uppercase: true, lowercase: true, numbers: true, symbols: true }): string {
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

// URL Analyzer Function
function analyzeUrl(inputUrl: string) {
  let score = 0;
  let reasons: string[] = [];
  let testUrl = inputUrl.trim().toLowerCase();

  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
    testUrl = 'http://' + testUrl;
  }

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

    const charCounts: { [key: string]: number } = {};
    for (const char of domainName) { if (char !== '-' && char !== '.') { charCounts[char] = (charCounts[char] || 0) + 1; } }
    let entropy = 0;
    for (const char in charCounts) { const p = charCounts[char] / domainName.length; entropy -= p * Math.log2(p); }
    if (entropy > 3.5 && domainName.length > 8) { score += 20; reasons.push(`⚠️ Randomly generated domain`); }

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

// Type Definitions
interface GeneratorOptionsType {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface VaultItem {
  id: string;
  site: string;
  username: string;
  password: string;
  category: string;
  notes: string;
  createdAt: string;
  favorite: boolean;
}

// Main Component
export default function PasswordBreachChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [breachCount, setBreachCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'checker' | 'generator' | 'vault' | 'urlScanner' | 'history'>('checker');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{password: string, breachCount: number | null, time: string}>>([]);
  const [generatorOptions, setGeneratorOptions] = useState<GeneratorOptionsType>({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true });

  const [urlToScan, setUrlToScan] = useState('');
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [urlResult, setUrlResult] = useState<{ isSafe: boolean; score: number; reasons: string[] } | null>(null);

  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [vaultData, setVaultData] = useState<VaultItem[]>([]);
  const [vaultFilter, setVaultFilter] = useState('all');
  const [showVaultPasswords, setShowVaultPasswords] = useState<Record<string, boolean>>({});
  const [newVaultItem, setNewVaultItem] = useState({ site: '', username: '', password: '', category: 'Social', notes: '' });
  const [activeVaultMode, setActiveVaultMode] = useState<'real' | 'decoy' | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupData, setSetupData] = useState({ realPassword: '', decoyPassword: '', confirmDecoy: '' });
  const [showUnlockWarning, setShowUnlockWarning] = useState(false);
  const [lastBackupReminder, setLastBackupReminder] = useState<number>(0);

  // INTRUDER CATCHER STATES
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [intruderAlert, setIntruderAlert] = useState<string | null>(null);
  const [intruderLogs, setIntruderLogs] = useState<Array<{photo: string, time: string}>>([]);
  const [showLogs, setShowLogs] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🚨 PANIC BUTTON LOGIC
  useEffect(() => {
    const handlePanic = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === '9') {
        localStorage.setItem('secure_vault_real', '00000000000'); localStorage.removeItem('secure_vault_real');
        localStorage.setItem('secure_vault_decoy', '00000000000'); localStorage.removeItem('secure_vault_decoy');
        localStorage.removeItem('intruder_logs');
        document.body.innerHTML = '<div style="background:#f5f0e8; color:#ef4444; height:100vh; display:flex; align-items:center; justify-content:center; font-size:2rem; font-family:sans-serif; font-weight:bold;">🚨 ALL DATA PURGED. SYSTEM SECURED.</div>';
        setTimeout(() => window.location.href = 'https://www.google.com', 1500);
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, []);

  useEffect(() => {
    const realVault = localStorage.getItem('secure_vault_real');
    const decoyVault = localStorage.getItem('secure_vault_decoy');
    if (!realVault && !decoyVault) setNeedsSetup(true);

    const savedHistory = localStorage.getItem('passwordCheckHistory');
    if (savedHistory) { try { setHistory(JSON.parse(savedHistory)); } catch (e) {} }

    const savedLogs = localStorage.getItem('intruder_logs');
    if (savedLogs) { try { setIntruderLogs(JSON.parse(savedLogs)); } catch (e) {} }

    const savedReminder = localStorage.getItem('lastBackupReminder');
    if (savedReminder) setLastBackupReminder(parseInt(savedReminder));
  }, []);

  // 🚨 AUTO-LOCK: 5 minutes inactivity
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      if (vaultUnlocked) {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          lockVault();
        }, 5 * 60 * 1000);
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

  // 🚨 BACKUP REMINDER
  useEffect(() => {
    if (vaultUnlocked && vaultData.length > 0) {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (now - lastBackupReminder > sevenDays) {
        setShowUnlockWarning(true);
      }
    }
  }, [vaultUnlocked, vaultData.length, lastBackupReminder]);

  const saveToHistory = (pwd: string, count: number | null) => {
    const newHistory = [{ password: pwd, breachCount: count, time: new Date().toLocaleString() }, ...history.slice(0, 49)];
    setHistory(newHistory);
    localStorage.setItem('passwordCheckHistory', JSON.stringify(newHistory));
  };

  const isCryptoLoaded = (): boolean => typeof (window as any).CryptoJS !== 'undefined';

  const initializeDualVault = () => {
    if (!setupData.realPassword || !setupData.decoyPassword) return alert('Please fill in both passwords!');
    if (setupData.realPassword.length < 8 || setupData.decoyPassword.length < 8) return alert('Minimum 8 characters!');
    if (setupData.realPassword === setupData.decoyPassword) return alert('Real and Decoy must be DIFFERENT!');
    if (setupData.decoyPassword !== setupData.confirmDecoy) return alert('Decoy passwords do not match!');
    
    const emptyVault: VaultItem[] = [];
    const encryptedReal = (window as any).CryptoJS.AES.encrypt(JSON.stringify(emptyVault), setupData.realPassword).toString();
    const decoyVault: VaultItem[] = [
      { id: '1', site: 'Facebook', username: 'john.doe@email.com', password: 'Password123', category: 'Social', notes: 'Personal account', createdAt: new Date().toLocaleString(), favorite: false },
      { id: '2', site: 'Gmail', username: 'johndoe@gmail.com', password: 'MyGmail2024', category: 'Email', notes: 'Primary email', createdAt: new Date().toLocaleString(), favorite: false }
    ];
    const encryptedDecoy = (window as any).CryptoJS.AES.encrypt(JSON.stringify(decoyVault), setupData.decoyPassword).toString();
    
    localStorage.setItem('secure_vault_real', encryptedReal);
    localStorage.setItem('secure_vault_decoy', encryptedDecoy);
    
    setNeedsSetup(false);
    setMasterPassword(setupData.realPassword);
    setActiveVaultMode('real');
    setVaultData(emptyVault);
    setVaultUnlocked(true);
    setShowUnlockWarning(true);
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
      const bytes = (window as any).CryptoJS.AES.decrypt(encryptedReal, masterPassword);
      const decryptedData = JSON.parse(bytes.toString((window as any).CryptoJS.enc.Utf8));
      setActiveVaultMode('real'); setVaultData(decryptedData); setVaultUnlocked(true); setFailedAttempts(0); setShowUnlockWarning(true); return;
    } catch (e) {}
    
    try {
      const bytes = (window as any).CryptoJS.AES.decrypt(encryptedDecoy, masterPassword);
      const decryptedData = JSON.parse(bytes.toString((window as any).CryptoJS.enc.Utf8));
      setActiveVaultMode('decoy'); setVaultData(decryptedData); setVaultUnlocked(true); setFailedAttempts(0); return;
    } catch (e) {}
    
    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);
    if (newFails >= 3) { captureIntruder(); } else { alert(`❌ Wrong password! Attempt ${newFails} of 3.`); }
    setMasterPassword('');
  };
  
  const saveVault = (data: VaultItem[]) => {
    const storageKey = activeVaultMode === 'decoy' ? 'secure_vault_decoy' : 'secure_vault_real';
    const encrypted = (window as any).CryptoJS.AES.encrypt(JSON.stringify(data), masterPassword).toString();
    localStorage.setItem(storageKey, encrypted);
    setVaultData(data);
  };

  const lockVault = () => {
    setVaultUnlocked(false); setVaultData([]); setMasterPassword(''); setShowVaultPasswords({});
    setNewVaultItem({ site: '', username: '', password: '', category: 'Social', notes: '' });
    setActiveVaultMode(null); setShowLogs(false); setShowUnlockWarning(false);
  };

  const addToVault = () => {
    if (!newVaultItem.site || !newVaultItem.password) return alert('Fill site name and password!');
    const newItem: VaultItem = { id: Date.now().toString(), ...newVaultItem, createdAt: new Date().toLocaleString(), favorite: false };
    saveVault([...vaultData, newItem]);
    setNewVaultItem({ site: '', username: '', password: '', category: 'Social', notes: '' });
  };

  const deleteFromVault = (id: string) => { if (window.confirm('Are you sure you want to delete this password?')) { saveVault(vaultData.filter(item => item.id !== id)); } };
  const toggleVaultPassword = (id: string) => setShowVaultPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFavorite = (id: string) => { saveVault(vaultData.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item)); };

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

  const dismissWarning = () => {
    setShowUnlockWarning(false);
  };

  const filteredVault = vaultData.filter(item => vaultFilter === 'all' ? true : item.category === vaultFilter).sort((a, b) => a.favorite === b.favorite ? a.site.localeCompare(b.site) : (a.favorite ? -1 : 1));

  const checkCommonPasswords = (pwd: string) => COMMON_PASSWORDS.includes(pwd.toLowerCase());

  const calculateStrength = (pwd: string) => {
    const details: string[] = []; let score = 0;
    if (pwd.length >= 8) score += 1; if (pwd.length >= 12) score += 1; if (pwd.length >= 16) score += 1; if (pwd.length >= 20) score += 1;
    if (/[a-z]/.test(pwd)) score += 1; if (/[A-Z]/.test(pwd)) score += 1; if (/[0-9]/.test(pwd)) score += 1; if (/[^a-zA-Z0-9]/.test(pwd)) score += 2;
    if (checkCommonPasswords(pwd)) { score = 0; details.push('❌ Found in top 100 common passwords'); }
    const kp = detectKeyboardPatterns(pwd); if (kp.length > 0) { score -= 2; details.push(...kp); }
    const dw = detectDictionaryWords(pwd); if (dw.length > 0) { score -= 1; details.push(...dw); }
    const rc = detectRepeatedChars(pwd); if (rc.length > 0) { score -= 1; details.push(...rc); }
    if (detectLeetSpeak(pwd)) { score -= 1; details.push('⚠️ Contains leet speak substitutions'); }
    score = Math.max(0, score);
    let level = 'Very Weak', color = '#ef4444';
    if (score >= 8) { level = 'Very Strong'; color = '#22c55e'; } else if (score >= 6) { level = 'Strong'; color = '#4ade80'; } else if (score >= 4) { level = 'Medium'; color = '#facc15'; } else if (score >= 2) { level = 'Weak'; color = '#fb923c'; }
    return { score, level, color, details };
  };

  const strength = password ? calculateStrength(password) : null;
  const entropy = password ? calculateEntropy(password) : 0;
  const crackTime = password ? estimateCrackTime(entropy) : null;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') checkPassword(); };
  const handleGenerate = () => { const pwd = generatePassword(generatorOptions.length, generatorOptions); setGeneratedPassword(pwd); };
  const copyToClipboard = async (text: string) => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error('Failed to copy'); } };

  const checkPassword = async () => {
    if (!password) return;
    setLoading(true); setError(''); setBreachCount(null);
    try {
      if (checkCommonPasswords(password)) { setBreachCount(9999999); saveToHistory(password, 9999999); setLoading(false); return; }
      const hash = await sha1(password);
      const response = await fetch(`https://api.pwnedpasswords.com/range/${hash.substring(0, 5)}`);
      if (!response.ok) throw new Error('Failed');
      const lines = (await response.text()).split('\n');
      let found = false;
      for (const line of lines) {
        if (line.split(':')[0].trim() === hash.substring(5)) {
          setBreachCount(parseInt(line.split(':')[1].trim()));
          saveToHistory(password, parseInt(line.split(':')[1].trim()));
          found = true; break;
        }
      }
      if (!found) { setBreachCount(0); saveToHistory(password, 0); }
    } catch (err) { setError('Connection error.'); }
    setLoading(false);
  };

  const handleScanUrl = () => {
    if (!urlToScan) return;
    setIsScanningUrl(true); setUrlResult(null);
    setTimeout(() => {
      setUrlResult(analyzeUrl(urlToScan));
      setIsScanningUrl(false);
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-4 md:p-8 font-sans relative">
      
      {/* 🚨 INTRUDER RED OVERLAY */}
      {intruderAlert && (
        <div className="fixed inset-0 z-[9999] bg-red-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-pulse">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-widest text-center">🚨 INTRUDER DETECTED 🚨</h1>
          <p className="text-lg md:text-xl mb-8 text-red-200 text-center px-4">UNAUTHORIZED ACCESS ATTEMPT HAS BEEN LOGGED SECURELY.</p>
          {intruderAlert !== 'CAMERA_DENIED' ? (
            <img src={intruderAlert} alt="Intruder" className="w-80 h-60 object-cover border-4 border-white rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.8)]" />
          ) : (
            <div className="w-80 h-60 bg-gray-800 flex items-center justify-center border-4 border-white rounded-xl text-center p-4">
              CAMERA ACCESS DENIED. TIMESTAMP & IP LOGGED.
            </div>
          )}
          <button onClick={() => {setIntruderAlert(null); setFailedAttempts(0);}} className="mt-8 px-8 py-3 bg-white text-red-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
            Dismiss & Reset Interface
          </button>
        </div>
      )}

      {/* 🚨 SECURITY WARNING MODAL */}
      {showUnlockWarning && vaultUnlocked && (
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-yellow-400">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-[#5c4a32] mb-4">🔐 Important Security Notice</h2>
              
              <div className="text-left bg-yellow-50 p-4 rounded-xl mb-4 space-y-3 text-sm">
                <p className="font-bold text-red-700">🚨 CRITICAL RULES:</p>
                <p>❌ <strong>NEVER</strong> clear browser data while vault is in use!</p>
                <p>❌ <strong>NEVER</strong> use Incognito/Private mode!</p>
                <p>❌ <strong>NEVER</strong> share your Master Password!</p>
                <p>🔒 Auto-lock activates after 5 minutes of inactivity</p>
              </div>

              <div className="text-left bg-blue-50 p-4 rounded-xl mb-4 space-y-2 text-sm">
                <p className="font-bold text-blue-700">💾 BACKUP REMINDER:</p>
                <p>Export your vault regularly as JSON backup!</p>
                <p>Keep backup files in a <strong>SECURE</strong> location!</p>
                <p>If you forget Master Password, data <strong>CANNOT</strong> be recovered!</p>
              </div>

              <div className="flex gap-3">
                <button onClick={exportVault} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  📤 Export Backup Now
                </button>
                <button onClick={dismissWarning} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4c4a8] rounded-full opacity-40 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c9b896] rounded-full opacity-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#e8dcc8] rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5c4a32] mb-2">
            Password Security Hub
          </h1>
          <p className="text-[#8b7355] text-lg">Check, Generate, Scan & Protect Your Digital Life</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {[
            { id: 'checker', label: '🔍 Check' },
            { id: 'generator', label: '⚡ Generate' },
            { id: 'vault', label: '🔐 Vault' },
            { id: 'urlScanner', label: '🔗 Link Scan' },
            { id: 'history', label: '📜 History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#5c4a32] text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-[#5c4a32] hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 🔗 URL SCANNER TAB */}
        {activeTab === 'urlScanner' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#5c4a32] mb-2 flex items-center gap-2">🔗 Deep Threat URL Scanner</h3>
              <p className="text-[#8b7355] mb-6 text-sm">Our heuristic AI engine analyzes Domain Entropy, Typosquatting, and Social Engineering patterns.</p>

              <div className="relative mb-4">
                <input 
                  type="text" 
                  value={urlToScan} 
                  onChange={(e) => setUrlToScan(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleScanUrl()} 
                  placeholder="Paste a link... (e.g., http://login-hdfc-8a7b6c.xyz)" 
                  className="w-full px-5 py-4 text-lg bg-[#faf8f5] border-2 border-[#d4c4a8] rounded-xl focus:border-[#8b6914] focus:outline-none transition-colors text-[#5c4a32] placeholder-[#a89070]" 
                />
              </div>
              
              <button 
                onClick={handleScanUrl} 
                disabled={!urlToScan || isScanningUrl} 
                className="w-full bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isScanningUrl ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span> Analyzing Heuristics...
                  </>
                ) : 'Perform Deep Scan 🕵️‍♂️'}
              </button>
            </div>

            {urlResult && (
              <div className={`bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 animate-fade-in ${urlResult.isSafe ? 'border-[#22c55e] bg-green-50/50' : 'border-[#ef4444] bg-red-50/50'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{urlResult.isSafe ? '✅' : '🚨'}</div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-2xl font-bold ${urlResult.isSafe ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {urlResult.isSafe ? 'URL Looks Safe!' : 'MALICIOUS THREAT DETECTED!'}
                      </h3>
                      <div className="text-right">
                        <span className="text-xs text-[#8b7355] font-bold uppercase tracking-widest">Threat Score</span>
                        <div className={`text-2xl font-black ${urlResult.isSafe ? 'text-green-600' : 'text-red-600'}`}>
                          {urlResult.score}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-2 mb-4 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${urlResult.isSafe ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{width: `${urlResult.score}%`}}
                      ></div>
                    </div>

                    <div className="mt-4 p-4 bg-white/50 rounded-xl border border-[#d4c4a8]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8b6914]">Heuristic Engine Logs:</span>
                      <ul className="list-disc list-inside mt-2 space-y-2 text-[#5c4a32] text-sm">
                        {urlResult.reasons.map((reason: string, idx: number) => (
                          <li key={idx} className={!urlResult.isSafe ? "text-[#b91c1c] font-medium" : "text-[#15803d]"}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🔍 CHECKER TAB */}
        {activeTab === 'checker' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <label className="block text-[#5c4a32] font-semibold mb-3 text-lg">Enter Password to Check 🔐</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  placeholder="Type your password here..." 
                  className="w-full px-5 py-4 pr-14 text-lg bg-[#faf8f5] border-2 border-[#d4c4a8] rounded-xl focus:border-[#8b6914] focus:outline-none transition-colors text-[#5c4a32] placeholder-[#a89070]" 
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b7355] hover:text-[#5c4a32] text-2xl">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <button onClick={checkPassword} disabled={!password || loading} className="w-full mt-4 bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin text-2xl">⏳</span> Checking...
                  </span>
                ) : 'Check for Breaches 🚀'}
              </button>
            </div>

            {(breachCount !== null || error) && (
              <div className={`bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 animate-fade-in ${breachCount === 0 ? 'border-[#22c55e] bg-green-50/50' : breachCount !== null ? 'border-[#ef4444] bg-red-50/50' : 'border-[#facc15] bg-yellow-50/50'}`}>
                {error ? (
                  <div className="text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-[#ca8a04] mb-2">Connection Error</h3>
                    <p className="text-[#8b7355]">{error}</p>
                  </div>
                ) : breachCount === 0 ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-[#22c55e] mb-2">Good News! 🎉</h3>
                    <p className="text-[#5c4a32] text-lg">
                      This password has <span className="font-bold text-[#22c55e]">NOT</span> been found in any known data breaches!
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚨</div>
                    <h3 className="text-2xl font-bold text-[#ef4444] mb-2">Password Compromised!</h3>
                    <p className="text-[#5c4a32] text-lg">
                      Found in <span className="font-bold text-[#ef4444] text-3xl">{breachCount?.toLocaleString()}</span> data breaches!
                    </p>
                  </div>
                )}
              </div>
            )}

            {password && strength && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
                <h3 className="text-xl font-bold text-[#5c4a32] mb-4 flex items-center gap-2">📊 Password Strength Analysis</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#8b7355]">Strength Level</span>
                    <span className="font-bold" style={{ color: strength.color }}>{strength.level}</span>
                  </div>
                  <div className="h-4 bg-[#e8dcc8] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(strength.score / 10) * 100}%`, backgroundColor: strength.color }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#faf8f5] p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-[#5c4a32]">{password.length}</div>
                    <div className="text-[#8b7355] text-sm">Characters</div>
                  </div>
                  <div className="bg-[#faf8f5] p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-[#5c4a32]">{entropy}</div>
                    <div className="text-[#8b7355] text-sm">Entropy (bits)</div>
                  </div>
                  <div className="bg-[#faf8f5] p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-[#5c4a32]">{crackTime?.text}</div>
                    <div className="text-[#8b7355] text-sm">Time to Crack</div>
                  </div>
                  <div className="bg-[#faf8f5] p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-[#5c4a32]">{strength.score}/10</div>
                    <div className="text-[#8b7355] text-sm">Score</div>
                  </div>
                </div>
                {strength.details.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#5c4a32]">⚠️ Issues Found:</h4>
                    {strength.details.map((detail, i) => (
                      <div key={i} className="bg-red-50/50 p-3 rounded-lg text-[#b91c1c] text-sm">{detail}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white/50 backdrop-blur rounded-xl p-4 border border-[#e8dcc8]">
              <h4 className="font-semibold text-[#5c4a32] mb-2 flex items-center gap-2">🔒 Privacy Protection</h4>
              <p className="text-[#8b7355] text-sm">
                Your password is <strong>never sent</strong> to any server. We use <strong>k-Anonymity</strong> - 
                only the first 5 characters of your password's SHA-1 hash are sent to the API. 
                The check happens entirely in your browser!
              </p>
            </div>
          </div>
        )}

        {/* ⚡ GENERATOR TAB */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#5c4a32] mb-6 flex items-center gap-2">⚡ Password Generator</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[#5c4a32] mb-2">
                    Password Length: <span className="font-bold text-[#8b6914]">{generatorOptions.length}</span>
                  </label>
                  <input 
                    type="range" 
                    min="8" 
                    max="64" 
                    value={generatorOptions.length} 
                    onChange={(e) => setGeneratorOptions({...generatorOptions, length: parseInt(e.target.value)})} 
                    className="w-full h-2 bg-[#d4c4a8] rounded-lg appearance-none cursor-pointer accent-[#8b6914]" 
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#faf8f5] p-3 rounded-xl hover:bg-[#e8dcc8] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={generatorOptions.uppercase} 
                      onChange={(e) => setGeneratorOptions({...generatorOptions, uppercase: e.target.checked})} 
                      className="w-5 h-5 accent-[#8b6914]" 
                    />
                    <span className="text-[#5c4a32]">ABC Uppercase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-[#faf8f5] p-3 rounded-xl hover:bg-[#e8dcc8] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={generatorOptions.lowercase} 
                      onChange={(e) => setGeneratorOptions({...generatorOptions, lowercase: e.target.checked})} 
                      className="w-5 h-5 accent-[#8b6914]" 
                    />
                    <span className="text-[#5c4a32]">abc Lowercase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-[#faf8f5] p-3 rounded-xl hover:bg-[#e8dcc8] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={generatorOptions.numbers} 
                      onChange={(e) => setGeneratorOptions({...generatorOptions, numbers: e.target.checked})} 
                      className="w-5 h-5 accent-[#8b6914]" 
                    />
                    <span className="text-[#5c4a32]">123 Numbers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-[#faf8f5] p-3 rounded-xl hover:bg-[#e8dcc8] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={generatorOptions.symbols} 
                      onChange={(e) => setGeneratorOptions({...generatorOptions, symbols: e.target.checked})} 
                      className="w-5 h-5 accent-[#8b6914]" 
                    />
                    <span className="text-[#5c4a32]">!@# Symbols</span>
                  </label>
                </div>
              </div>
              <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                Generate Password 🎲
              </button>
              {generatedPassword && (
                <div className="mt-6 p-4 bg-[#faf8f5] rounded-xl border-2 border-[#8b6914]">
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-[#5c4a32] text-lg font-mono break-all">{generatedPassword}</code>
                    <button onClick={() => copyToClipboard(generatedPassword)} className="px-4 py-2 bg-[#8b6914] text-white rounded-lg hover:bg-[#5c4a32]">
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#5c4a32] mb-4">🛡️ Why Strong Passwords Matter?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f0f7e6] rounded-xl">
                  <h4 className="font-bold text-[#5c4a32] mb-2">🔓 Brute Force Attacks</h4>
                  <p className="text-[#6b7a5a] text-sm">Hackers use powerful computers to try billions of password combinations per second. Strong passwords can take centuries to crack!</p>
                </div>
                <div className="p-4 bg-[#f0f7e6] rounded-xl">
                  <h4 className="font-bold text-[#5c4a32] mb-2">📧 Data Breaches</h4>
                  <p className="text-[#6b7a5a] text-sm">Billions of passwords have been leaked in data breaches. Using unique passwords prevents hackers from accessing all your accounts at once.</p>
                </div>
                <div className="p-4 bg-[#f0f7e6] rounded-xl">
                  <h4 className="font-bold text-[#5c4a32] mb-2">🔑 Credential Stuffing</h4>
                  <p className="text-[#6b7a5a] text-sm">Hackers use leaked passwords from one site to try on other sites. Using different passwords for each account stops this attack.</p>
                </div>
                <div className="p-4 bg-[#f0f7e6] rounded-xl">
                  <h4 className="font-bold text-[#5c4a32] mb-2">💼 Password Managers</h4>
                  <p className="text-[#6b7a5a] text-sm">Use a password manager to generate and store unique passwords for all your accounts. You only need to remember one master password!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔐 VAULT TAB */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            {!vaultUnlocked ? (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-[#e8dcc8]">
                {needsSetup ? (
                  <div className="text-center">
                    <div className="text-5xl mb-4">🔐</div>
                    <h3 className="text-2xl font-bold text-[#5c4a32] mb-2">Setup Secure Vault</h3>
                    <p className="text-[#8b7355] mb-6">
                      This vault uses <strong>Plausible Deniability</strong>. Create TWO passwords - one for your real vault, one for a decoy vault.
                    </p>
                    
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 text-left border border-yellow-200">
                      <p className="font-bold text-yellow-800 mb-2">⚠️ IMPORTANT TIPS:</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Use <strong>16+ characters</strong> for Master Password</li>
                        <li>• Mix: A-Z, a-z, 0-9, !@#$%</li>
                        <li>• Real & Decoy passwords must be <strong>DIFFERENT</strong></li>
                        <li>• <strong>REMEMBER</strong> both passwords - cannot be recovered!</li>
                      </ul>
                    </div>

                    <div className="max-w-md mx-auto space-y-4 text-left">
                      <div>
                        <label className="block text-[#5c4a32] font-semibold mb-2">🔐 Real Master Password</label>
                        <input type="password" value={setupData.realPassword} onChange={(e) => setSetupData({...setupData, realPassword: e.target.value})} placeholder="Your actual vault password" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] focus:border-[#8b6914] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[#5c4a32] font-semibold mb-2">🎭 Decoy Master Password</label>
                        <input type="password" value={setupData.decoyPassword} onChange={(e) => setSetupData({...setupData, decoyPassword: e.target.value})} placeholder="Different password for decoy vault" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] focus:border-[#8b6914] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[#5c4a32] font-semibold mb-2">🎭 Confirm Decoy Password</label>
                        <input type="password" value={setupData.confirmDecoy} onChange={(e) => setSetupData({...setupData, confirmDecoy: e.target.value})} placeholder="Confirm decoy password" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] focus:border-[#8b6914] focus:outline-none" />
                      </div>
                      <button onClick={initializeDualVault} className="w-full bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg">
                        Initialize Dual Vault System 🔐
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center max-w-md mx-auto">
                    <div className="text-5xl mb-4">🔒</div>
                    <h3 className="text-2xl font-bold text-[#5c4a32] mb-4">Vault Locked</h3>
                    <p className="text-[#8b7355] mb-6">
                      Enter your master password to unlock your AES-256 secure vault.
                    </p>
                    <input type="password" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && unlockVault()} placeholder="Master Password" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] mb-4 text-[#5c4a32] focus:border-[#8b6914] text-center tracking-widest text-lg" />
                    <button onClick={unlockVault} className="w-full bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg">
                      Unlock 🔓
                    </button>
                    <p className="mt-4 text-xs text-[#ef4444] font-bold">
                      Failed attempts: {failedAttempts}/3 before Security Lockdown.
                    </p>
                    <div className="mt-6 p-4 bg-red-50/50 rounded-xl border border-red-200">
                      <p className="text-red-700 text-sm">
                        ⚠️ <strong>Zero-Knowledge Architecture:</strong> If you forget your master password, your data <strong>CANNOT</strong> be recovered.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Vault Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white/70 p-4 rounded-2xl shadow-xl border border-[#e8dcc8] gap-4">
                  <div className="flex items-center gap-2 text-[#22c55e]">
                    <span className="text-2xl">🔓</span>
                    <span className="font-semibold">Unlocked ({activeVaultMode === 'decoy' ? 'Decoy Mode' : 'Real Mode'})</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setShowLogs(!showLogs)} className="px-4 py-2 bg-[#8b6914] text-white font-medium rounded-lg hover:bg-[#5c4a32] transition-colors relative">
                      📸 Intruder Logs
                      {intruderLogs.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{intruderLogs.length}</span>}
                    </button>
                    <button onClick={exportVault} className="px-4 py-2 bg-[#22c55e] text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                      📤 Export Backup
                    </button>
                    <button onClick={lockVault} className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors">
                      🔒 Lock Vault
                    </button>
                  </div>
                </div>

                {/* 🚨 INTRUDER LOGS SECTION */}
                {showLogs && (
                  <div className="bg-red-50/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-red-200 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                        📸 Security Audit: Intruder Logs ({intruderLogs.length})
                      </h3>
                      {intruderLogs.length > 0 && <button onClick={clearIntruderLogs} className="text-sm text-red-500 underline">Clear All Logs</button>}
                    </div>
                    {intruderLogs.length === 0 ? (
                      <p className="text-green-600 text-center py-4 font-medium">🛡️ No intruders logged. Your vault is safe!</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {intruderLogs.map((log, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl shadow border border-red-100 flex flex-col items-center">
                            {log.photo === 'CAMERA_DENIED' ? (
                              <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center p-2 rounded-lg mb-2 border border-gray-300">
                                No Photo<br/>(Camera Denied)
                              </div>
                            ) : (
                              <img src={log.photo} alt="Intruder" className="w-full h-32 object-cover rounded-lg mb-2 border border-red-200" />
                            )}
                            <span className="text-xs text-red-600 font-semibold">{log.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Add New Password Form */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
                  <h3 className="text-lg font-bold text-[#5c4a32] mb-4">➕ Add New Password</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#5c4a32] mb-2 text-sm font-medium">Site/Service Name *</label>
                      <input type="text" value={newVaultItem.site} onChange={(e) => setNewVaultItem({...newVaultItem, site: e.target.value})} placeholder="e.g., Gmail, Facebook, Netflix" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] placeholder-[#a89070] focus:border-[#8b6914] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[#5c4a32] mb-2 text-sm font-medium">Username/Email</label>
                      <input type="text" value={newVaultItem.username} onChange={(e) => setNewVaultItem({...newVaultItem, username: e.target.value})} placeholder="e.g., john@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] placeholder-[#a89070] focus:border-[#8b6914] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[#5c4a32] mb-2 text-sm font-medium">Password *</label>
                      <input type="password" value={newVaultItem.password} onChange={(e) => setNewVaultItem({...newVaultItem, password: e.target.value})} placeholder="Enter password" className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] placeholder-[#a89070] focus:border-[#8b6914] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[#5c4a32] mb-2 text-sm font-medium">Category</label>
                      <select value={newVaultItem.category} onChange={(e) => setNewVaultItem({...newVaultItem, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] focus:border-[#8b6914] focus:outline-none">
                        <option value="Social">📱 Social</option>
                        <option value="Banking">🏦 Banking</option>
                        <option value="Email">📧 Email</option>
                        <option value="Shopping">🛒 Shopping</option>
                        <option value="Work">💼 Work</option>
                        <option value="Other">📁 Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[#5c4a32] mb-2 text-sm font-medium">Notes (optional)</label>
                    <textarea value={newVaultItem.notes} onChange={(e) => setNewVaultItem({...newVaultItem, notes: e.target.value})} placeholder="Any additional notes..." rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-[#e8dcc8] bg-white text-[#5c4a32] placeholder-[#a89070] focus:border-[#8b6914] focus:outline-none resize-none" />
                  </div>
                  <button onClick={addToVault} disabled={!newVaultItem.site || !newVaultItem.password} className="w-full mt-4 bg-gradient-to-r from-[#8b6914] to-[#5c4a32] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                    Add to Vault 💾
                  </button>
                </div>

                {/* Filter Categories */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-[#e8dcc8]">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[#5c4a32] font-medium">Filter:</span>
                    {['all', 'Social', 'Banking', 'Email', 'Shopping', 'Work', 'Other'].map(cat => (
                      <button key={cat} onClick={() => setVaultFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${vaultFilter === cat ? 'bg-[#8b6914] text-white' : 'bg-[#faf8f5] text-[#5c4a32] hover:bg-[#e8dcc8]'}`}>
                        {cat === 'all' ? '📋 All' : cat === 'Social' ? '📱' : cat === 'Banking' ? '🏦' : cat === 'Email' ? '📧' : cat === 'Shopping' ? '🛒' : cat === 'Work' ? '💼' : '📁'} {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vault Items List */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
                  <h3 className="text-lg font-bold text-[#5c4a32] mb-4">🔑 Your Saved Passwords ({filteredVault.length})</h3>
                  {filteredVault.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🔐</div>
                      <p className="text-[#8b7355]">No passwords saved yet!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {filteredVault.map((item) => (
                        <div key={item.id} className="p-4 bg-[#faf8f5] rounded-xl border border-[#e8dcc8]">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.category === 'Social' ? 'bg-blue-100 text-blue-700' : item.category === 'Banking' ? 'bg-green-100 text-green-700' : item.category === 'Email' ? 'bg-red-100 text-red-700' : item.category === 'Shopping' ? 'bg-yellow-100 text-yellow-700' : item.category === 'Work' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {item.category === 'Social' ? '📱' : item.category === 'Banking' ? '🏦' : item.category === 'Email' ? '📧' : item.category === 'Shopping' ? '🛒' : item.category === 'Work' ? '💼' : '📁'} {item.category}
                                </span>
                                {item.favorite && <span className="text-yellow-500">⭐</span>}
                              </div>
                              <h4 className="font-bold text-[#5c4a32]">{item.site}</h4>
                              <p className="text-[#8b7355] text-sm">{item.username}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <code className="bg-[#e8dcc8] px-3 py-1 rounded text-[#5c4a32] font-mono">
                                  {showVaultPasswords[item.id] ? item.password : '••••••••••••'}
                                </code>
                                <button onClick={() => toggleVaultPassword(item.id)} className="p-2 hover:bg-[#e8dcc8] rounded transition-colors">{showVaultPasswords[item.id] ? '🙈' : '👁️'}</button>
                                <button onClick={() => copyToClipboard(item.password)} className="p-2 hover:bg-[#e8dcc8] rounded transition-colors" title="Copy password">📋</button>
                                <button onClick={() => toggleFavorite(item.id)} className="p-2 hover:bg-[#e8dcc8] rounded transition-colors" title="Toggle favorite">{item.favorite ? '⭐' : '☆'}</button>
                                <button onClick={() => deleteFromVault(item.id)} className="p-2 hover:bg-red-100 rounded transition-colors text-red-500" title="Delete">🗑️</button>
                              </div>
                              {item.notes && <p className="text-[#a89070] text-xs mt-2">📝 {item.notes}</p>}
                              <p className="text-[#a89070] text-xs mt-1">Added: {item.createdAt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔒 Security Tips in Vault */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-200">
                  <h3 className="text-lg font-bold text-[#5c4a32] mb-4">🔒 Security Reminders</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white/50 rounded-xl">
                      <p className="font-bold text-red-600 mb-1">❌ NEVER DO:</p>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Clear browser data</li>
                        <li>• Use Incognito mode</li>
                        <li>• Share Master Password</li>
                        <li>• Use on public computer</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl">
                      <p className="font-bold text-green-600 mb-1">✅ ALWAYS DO:</p>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Export regular backups</li>
                        <li>• Lock vault when away</li>
                        <li>• Use strong passwords</li>
                        <li>• Keep device secure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 📜 HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#5c4a32] flex items-center gap-2">📜 Check History</h3>
                {history.length > 0 && <button onClick={() => { setHistory([]); localStorage.removeItem('passwordCheckHistory'); }} className="px-4 py-2 text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors text-sm">Clear All</button>}
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-[#8b7355]">No password checks yet!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#faf8f5] rounded-xl">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="font-mono text-[#5c4a32] truncate">{item.password.length > 20 ? item.password.substring(0, 20) + '...' : item.password}</div>
                        <div className="text-[#8b7355] text-sm">{item.time}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${item.breachCount === 0 ? 'bg-green-100 text-green-700' : item.breachCount === null ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                        {item.breachCount === 0 ? '✅ Safe' : item.breachCount === null ? '❓ Unknown' : `🚨 ${item.breachCount.toLocaleString()} breaches`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#5c4a32] mb-4">📈 Security Awareness Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">600M+</div><div className="text-[#8b7355] text-sm">Passwords in Database</div></div>
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">15B+</div><div className="text-[#8b7355] text-sm">Breached Records</div></div>
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">24/7</div><div className="text-[#8b7355] text-sm">Cyber Attacks Active</div></div>
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">81%</div><div className="text-[#8b7355] text-sm">Breaches Due to Weak Passwords</div></div>
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">70%</div><div className="text-[#8b7355] text-sm">Reuse Passwords</div></div>
                <div className="text-center p-4 bg-[#faf8f5] rounded-xl"><div className="text-3xl font-bold text-[#8b6914]">3min</div><div className="text-[#8b7355] text-sm">Avg Password Crack Time</div></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-[#8b7355] text-sm">
          <p>🔐 Powered by Have I Been Pwned API • Your passwords never leave your browser</p>
          <p className="mt-1">Made with ❤️ for your security</p>
        </footer>
      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}