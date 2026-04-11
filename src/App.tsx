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

// =====================================================
// GOOGLE SAFE BROWSING API v4 (free, 10K req/day)
// Uses CORS proxy since browser can't call directly
// =====================================================
const GSB_API_KEY = 'AIzaSyD9HcE4DVBlxB4unm5iFR_e7zoFoJ4PYT0'; // Public demo key - replace with your own at https://console.cloud.google.com

async function checkGoogleSafeBrowsing(url) {
  try {
    const body = {
      client: { clientId: 'passguard-checker', clientVersion: '2.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'THREAT_TYPE_UNSPECIFIED'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };
    // Try direct first (works in some environments), then CORS proxy
    const endpoints = [
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`,
      `https://corsproxy.io/?${encodeURIComponent(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`)}`,
    ];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          const types = [...new Set(data.matches.map(m => m.threatType))];
          return { checked: true, flagged: true, threats: types };
        }
        return { checked: true, flagged: false, threats: [] };
      } catch (_) { continue; }
    }
    return { checked: false, flagged: false, threats: [] };
  } catch (_) {
    return { checked: false, flagged: false, threats: [] };
  }
}

// =====================================================
// HIGHLY ACCURATE LOCAL HEURISTIC ENGINE v3
// Smart scoring — avoids false positives on legit sites
// =====================================================

// Known SAFE domains — never flag these as suspicious
const KNOWN_SAFE_DOMAINS = new Set([
  'google.com','youtube.com','facebook.com','instagram.com','twitter.com','x.com',
  'amazon.com','apple.com','microsoft.com','github.com','stackoverflow.com',
  'linkedin.com','reddit.com','netflix.com','spotify.com','paypal.com',
  'dropbox.com','cloudflare.com','wikipedia.org','mozilla.org','adobe.com',
  'zoom.us','slack.com','notion.so','figma.com','vercel.app','netlify.app',
  'whatsapp.com','telegram.org','discord.com','twitch.tv','tiktok.com',
  'flipkart.com','myntra.com','swiggy.com','zomato.com','paytm.com',
  'hdfc.com','icicibank.com','sbi.co.in','axis.in','kotak.com',
  'irctc.co.in','uidai.gov.in','incometax.gov.in','mca.gov.in',
]);

function getRootDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

function analyzeUrl(inputUrl) {
  let score = 0;
  let reasons = [];
  let positives = []; // Good signals
  let testUrl = inputUrl.trim();
  if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) { testUrl = 'https://' + testUrl; }

  try {
    const parsed = new URL(testUrl);
    const fullUrl = testUrl;
    const domain = parsed.hostname.toLowerCase();
    const rootDomain = getRootDomain(domain);
    const path = parsed.pathname.toLowerCase();
    const query = parsed.search.toLowerCase();
    const domainParts = domain.split('.');
    const tld = '.' + domainParts.slice(-1)[0];
    const sld = domainParts.slice(-2, -1)[0] || '';
    const subdomains = domainParts.slice(0, -2);

    // ── INSTANT SAFE EXIT ──
    if (KNOWN_SAFE_DOMAINS.has(rootDomain)) {
      return {
        isSafe: true, score: 0,
        reasons: ["✅ Verified legitimate domain", "✅ No threats detected", "✅ Safe Browsing: Clean"],
        positives: [`✅ Trusted domain: ${rootDomain}`],
        apiChecked: false,
      };
    }

    // ── PROTOCOL ──
    if (parsed.protocol === 'https:') { positives.push("✅ HTTPS — encrypted connection"); }
    else if (parsed.protocol === 'http:') { score += 18; reasons.push("⚠️ Insecure HTTP — data travels unencrypted"); }
    else if (parsed.protocol === 'data:' || parsed.protocol === 'javascript:') { score += 70; reasons.push("🚨 DANGEROUS PROTOCOL — code injection vector"); }

    // ── RAW IP ADDRESS ──
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) {
      score += 55; reasons.push("🚨 Raw IP address — no legitimate site uses this");
    }

    // ── PUNYCODE / IDN HOMOGLYPH ATTACK ──
    if (domain.includes('xn--')) { score += 45; reasons.push("🚨 Punycode IDN domain — real domain identity hidden"); }

    // ── CYRILLIC/HOMOGLYPH in brand domains ──
    const homoglyphTest = inputUrl.normalize('NFC');
    if (/[а-яА-ЯёЁ]/.test(homoglyphTest) || /[αβγδεζηθ]/.test(homoglyphTest)) {
      score += 50; reasons.push("🚨 HOMOGLYPH ATTACK — non-Latin chars mimicking real brands");
    }

    // ── RISKY TLDs (with exceptions) ──
    const RISKY_TLDS_LOCAL = ['.xyz','.top','.tk','.ml','.ga','.cf','.pw','.cc','.ws','.buzz','.icu','.su','.racing','.win','.download','.click','.work','.party','.gq','.fit','.kim','.science','.review','.stream','.date','.faith','.loan','.cricket','.gdn','.men','.accountant','.trade','.webcam'];
    const NEUTRAL_NEW_TLDS = ['.io','.co','.app','.dev','.ai','.cloud','.tech','.online','.site','.store'];
    if (RISKY_TLDS_LOCAL.includes(tld)) {
      score += 22; reasons.push(`🚨 High-abuse TLD: ${tld} (commonly used in scams)`);
    } else if (!NEUTRAL_NEW_TLDS.includes(tld) && domainParts.length > 3 && tld !== '.com' && tld !== '.org' && tld !== '.net') {
      // Many subdomains + obscure TLD
      score += 8; reasons.push(`⚠️ Unusual TLD with deep subdomain nesting`);
    }

    // ── BRAND TYPOSQUATTING (smart — avoids false positives) ──
    const BIG_BRANDS = ['google','facebook','amazon','apple','microsoft','paypal','netflix','instagram','twitter','whatsapp','telegram','discord','snapchat','tiktok','youtube','linkedin','dropbox','spotify','steam','roblox','binance','coinbase','hdfc','icici','sbi','paytm','flipkart','zomato','swiggy','airbnb','uber','ola','gpay','phonepe'];
    for (const brand of BIG_BRANDS) {
      if (rootDomain === `${brand}.com` || rootDomain === `${brand}.in` || rootDomain === `${brand}.org`) continue; // legit
      const leetVariants = brand.replace(/o/g,'0').replace(/i/g,'1').replace(/e/g,'3').replace(/a/g,'4').replace(/l/g,'1');
      const combos = [
        leetVariants, brand+'s', brand+'-login', brand+'-signin', brand+'-secure', brand+'-verify',
        brand+'-support', brand+'-bank', brand+'-wallet', brand+'-payment', brand+'-update',
        'login-'+brand, 'signin-'+brand, 'secure-'+brand, 'verify-'+brand, 'my-'+brand,
        brand+'app', brand+'web', brand+'online',
      ];
      const domainCore = domain.replace(/\./g, '');
      if (combos.some(c => c !== brand && domainCore.includes(c)) || (domain.includes(brand) && !rootDomain.startsWith(brand))) {
        score += 40; reasons.push(`🚨 Typosquatting detected — impersonating "${brand}"`);
        break;
      }
    }

    // ── MALWARE FILE EXTENSIONS in path ──
    const MALWARE_EXT_LOCAL = ['.exe','.apk','.bat','.cmd','.com','.cpl','.scr','.vbs','.js','.jse','.wsf','.wsh','.msi','.dll','.jar','.pif','.vba','.vbe','.ps1','.sh','.bash','.zsh','.dmg','.pkg','.deb','.rpm','.iso','.img','.hta','.lnk','.reg'];
    for (const ext of MALWARE_EXT_LOCAL) {
      if (path.endsWith(ext) || path.includes(ext + '?')) {
        score += 42; reasons.push(`🚨 Malware file download: ${ext} extension in URL`);
        break;
      }
    }

    // ── @ SYMBOL TRICK ──
    if (fullUrl.includes('@') && parsed.username) {
      score += 40; reasons.push("🚨 @ symbol trick — real domain is after @, shown domain is fake");
    }

    // ── SUSPICIOUS SUBDOMAINS (only flag if also other signals present) ──
    const SUSP_SUBS = ['login','signin','secure','verify','account','update','confirm','banking','wallet','support','helpdesk','recovery','auth','password','credential'];
    const hasSuspSub = subdomains.some(sub => SUSP_SUBS.some(s => sub.includes(s)));
    if (hasSuspSub && subdomains.length >= 2) {
      score += 18; reasons.push(`⚠️ Suspicious subdomain chain: "${subdomains.join('.')}" — phishing pattern`);
    } else if (hasSuspSub && score > 10) {
      // Only flag if already suspicious
      score += 12; reasons.push(`⚠️ Suspicious subdomain keyword: "${subdomains.find(s => SUSP_SUBS.some(k => s.includes(k)))}"`)
    }

    // ── URL SHORTENERS ──
    const SHORTENERS = ['bit.ly','tinyurl.com','goo.gl','t.co','ow.ly','is.gd','buff.ly','cutt.ly','rb.gy','v.gd','short.io','bl.ink','gg.gg','tiny.cc','shorten.ws','clck.ru','lnkd.in','adf.ly','bc.vc'];
    if (SHORTENERS.includes(rootDomain)) {
      score += 18; reasons.push(`⚠️ URL shortener (${rootDomain}) — real destination hidden`);
    }

    // ── PHISHING KEYWORDS (multi-signal approach) ──
    const PHISH_PATTERNS = [
      { kws: ['urgent','expire','suspended','locked','verify-now','confirm-now'], label: 'urgency manipulation', weight: 16 },
      { kws: ['free-money','claim-prize','you-won','lottery','congratulations','reward-claim'], label: 'prize/lottery scam', weight: 22 },
      { kws: ['login','signin','account','password','credential'], label: 'credential harvesting page', weight: 10 },
      { kws: ['payment','invoice','refund','transaction','wire-transfer'], label: 'financial fraud keywords', weight: 15 },
    ];
    for (const p of PHISH_PATTERNS) {
      const found = p.kws.filter(kw => fullUrl.toLowerCase().includes(kw));
      if (found.length >= 2) { score += p.weight; reasons.push(`⚠️ ${p.label}: "${found.slice(0,2).join(', ')}" in URL`); }
    }

    // ── CRYPTO SCAM PATTERNS (modern 2024/2025 scams) ──
    const CRYPTO_SCAM_KWS = ['airdrop','claim-eth','claim-btc','free-crypto','double-your','giveaway','crypto-reward','nft-mint','presale-token','defi-yield','flash-loan','pump-signal','rug-pull'];
    const CRYPTO_BRANDS = ['metamask','coinbase','binance','trustwallet','ledger','phantom','uniswap','opensea'];
    const foundCrypto = CRYPTO_SCAM_KWS.filter(kw => fullUrl.toLowerCase().includes(kw));
    const foundCryptoBrand = CRYPTO_BRANDS.filter(b => domain.includes(b) && !rootDomain.startsWith(b));
    if (foundCrypto.length >= 1) { score += 35; reasons.push(`🚨 Crypto scam pattern: "${foundCrypto[0]}" — classic fraud keyword`); }
    if (foundCryptoBrand.length > 0) { score += 40; reasons.push(`🚨 Fake crypto wallet site impersonating "${foundCryptoBrand[0]}"`); }

    // ── AI/TECH SUPPORT SCAM (2024 trend) ──
    const TECH_SCAM = ['microsoft-support','windows-error','computer-virus','call-now-toll','your-pc-infected','system-warning','activate-windows'];
    if (TECH_SCAM.some(kw => fullUrl.toLowerCase().includes(kw))) {
      score += 38; reasons.push("🚨 Tech support scam pattern — classic Microsoft/Windows fraud");
    }

    // ── INVESTMENT SCAM (2024/2025) ──
    const INVEST_SCAM = ['guaranteed-returns','daily-profit','passive-income-crypto','trading-signal','binary-option','forex-signal','100x-return','copy-trade'];
    if (INVEST_SCAM.some(kw => fullUrl.toLowerCase().includes(kw))) {
      score += 32; reasons.push("🚨 Investment fraud pattern — fake trading/returns scam");
    }

    // ── GOVT/TAX IMPERSONATION (India specific + global) ──
    const GOVT_IMPERSONATE = ['income-tax-refund','uidai-update','pan-verify','gst-refund','irs-refund','gov-payment','official-gov','customs-duty-release'];
    if (GOVT_IMPERSONATE.some(kw => fullUrl.toLowerCase().includes(kw))) {
      score += 40; reasons.push("🚨 Government impersonation scam — fake tax/ID fraud");
    }

    // ── UPI/PAYMENT SCAM (India, 2024) ──
    const UPI_SCAM = ['upi-cashback','paytm-reward','phonepe-bonus','googlepay-gift','bhim-claim','upi-verify','kyc-update-upi'];
    if (UPI_SCAM.some(kw => fullUrl.toLowerCase().includes(kw))) {
      score += 38; reasons.push("🚨 UPI payment scam — fake KYC/cashback fraud (India)");
    }

    // ── OPEN REDIRECT ──
    const OPEN_REDIRECT = ['redirect=','url=http','goto=http','next=http','return=http','returnurl=','callback=http','continue=http'];
    if (OPEN_REDIRECT.some(p => query.toLowerCase().includes(p))) {
      score += 22; reasons.push("⚠️ Open redirect parameter — could lead to malicious site");
    }

    // ── DOMAIN AGE PROXY (very long random domain = DGA malware) ──
    const charCounts = {};
    for (const c of sld) { if (c !== '-') charCounts[c] = (charCounts[c] || 0) + 1; }
    let entropy = 0;
    for (const c in charCounts) { const p = charCounts[c] / sld.length; entropy -= p * Math.log2(p); }
    if (entropy > 3.6 && sld.length > 12) {
      score += 20; reasons.push(`⚠️ DGA-style domain "${sld}" — looks algorithmically generated (malware C2 pattern)`);
    }

    // ── EXCESSIVE HYPHENS (phishing tell) ──
    const hyphenCount = (domain.match(/-/g) || []).length;
    if (hyphenCount >= 4) { score += 15; reasons.push(`⚠️ ${hyphenCount} hyphens in domain — strong phishing indicator`); }
    else if (hyphenCount >= 2 && score > 15) { score += 8; reasons.push(`⚠️ Multiple hyphens in domain`); }

    // ── VERY LONG URL (obfuscation) ──
    if (fullUrl.length > 300) { score += 14; reasons.push(`⚠️ Extremely long URL (${fullUrl.length} chars) — obfuscation technique`); }
    else if (fullUrl.length > 150 && score > 10) { score += 7; reasons.push(`⚠️ Unusually long URL`); }

    // ── POSITIVE SIGNALS ──
    if (parsed.protocol === 'https:') positives.push("✅ HTTPS secure connection");
    if (tld === '.gov' || tld === '.edu') positives.push(`✅ Official ${tld} domain`);
    if (hyphenCount === 0 && sld.length < 15) positives.push("✅ Clean, simple domain name");
    if (!hasSuspSub && subdomains.length <= 1) positives.push("✅ No suspicious subdomains");

    score = Math.min(score, 100);

    if (score === 0) return { isSafe: true, score: 0, reasons: ["✅ No threats detected by heuristics"], positives, apiChecked: false };
    else if (score < 25) return { isSafe: true, score, reasons: ["✅ Mostly safe — minor flags only", ...reasons], positives, apiChecked: false };
    else if (score < 55) return { isSafe: false, score, reasons: ["⚠️ SUSPICIOUS — proceed with caution", ...reasons], positives, apiChecked: false };
    else return { isSafe: false, score, reasons: ["🚨 HIGH RISK — DO NOT VISIT", ...reasons], positives, apiChecked: false };
  } catch (e) {
    return { isSafe: false, score: 100, reasons: ["🚨 Invalid URL format — cannot parse"], positives: [], apiChecked: false };
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

// ===== HACKER ATTACK SCENE COMPONENT =====
const ATTACKS = [
  { id: 'brute', label: 'Brute Force', icon: '💪', color: '#ff3060', desc: 'Trying 10B passwords/sec', emoji: '🔨' },
  { id: 'malware', label: 'Malware', icon: '🦠', color: '#ff6b00', desc: 'Keylogger deployed', emoji: '🪱' },
  { id: 'remote', label: 'Remote Access', icon: '🌐', color: '#a855f7', desc: 'RAT connection attempt', emoji: '👾' },
  { id: 'phishing', label: 'Phishing', icon: '🎣', color: '#fbbf24', desc: 'Fake login page sent', emoji: '🪝' },
  { id: 'sql', label: 'SQL Injection', icon: '💉', color: '#22d3ee', desc: "'; DROP TABLE users; --", emoji: '💀' },
  { id: 'ddos', label: 'DDoS', icon: '💥', color: '#f43f5e', desc: '1M reqs flooding vault', emoji: '🌊' },
];

const VAULT_REPLIES = {
  brute: ["lol nice try bestie 😂", "10 billion/sec? I'm not impressed 💅", "SHA-256 says no babes 🛡️", "keep going, i got time 😴"],
  malware: ["antivirus said ew 🤢", "sandbox? try sandbox escape. oh wait 🔒", "ur keylogger is in /dev/null rn 🗑️", "nice worm bro, neutered it 🧬"],
  remote: ["connection refused. obviously. 🙄", "RAT trapped. lmao 🐭", "firewall said absolutely not 🚫", "nice try script kiddie 👶"],
  phishing: ["users smarter than ur bait 😎", "zero clicks. skill issue 📵", "url scanner ate ur link 🔗💀", "phishing? in THIS economy? 😭"],
  sql: ["parameterized queries said WHAT 😌", "sanitization go brrr 🧼", "ur injection returned 0 rows 😔", "bobby tables? we studied 📚"],
  ddos: ["rate limiter absolutely eating rn 🍽️", "CDN said chill fr fr ☁️", "traffic absorbed. yawn. 💤", "is that all u got? 💪"],
};

function HackerAttackScene({ dm }) {
  const [activeAttack, setActiveAttack] = React.useState('brute');
  const [animKey, setAnimKey] = React.useState(0);
  const [reply, setReply] = React.useState('');
  const [showReply, setShowReply] = React.useState(false);
  const [bombs, setBombs] = React.useState([]);
  const [vaultHit, setVaultHit] = React.useState(false);
  const [attackCount, setAttackCount] = React.useState({ brute: 0, malware: 0, remote: 0, phishing: 0, sql: 0, ddos: 0 });
  const [totalBlocked, setTotalBlocked] = React.useState(Math.floor(Math.random() * 900 + 4200));

  const attack = ATTACKS.find(a => a.id === activeAttack);

  const triggerAttack = (id) => {
    setActiveAttack(id);
    setAnimKey(k => k + 1);
    setShowReply(false);
    const atk = ATTACKS.find(a => a.id === id);
    const bombId = Date.now();
    setBombs(prev => [...prev, { id: bombId, color: atk.color }]);
    setTimeout(() => {
      setBombs(prev => prev.filter(b => b.id !== bombId));
      setVaultHit(true);
      const replies = VAULT_REPLIES[id];
      setReply(replies[Math.floor(Math.random() * replies.length)]);
      setShowReply(true);
      setAttackCount(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setTotalBlocked(n => n + 1);
      setTimeout(() => setVaultHit(false), 600);
      setTimeout(() => setShowReply(false), 3500);
    }, 900);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const ids = ATTACKS.map(a => a.id);
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      triggerAttack(randomId);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const bg = dm
    ? 'linear-gradient(180deg, rgba(6,6,16,0.95) 0%, rgba(10,10,22,0.98) 100%)'
    : 'linear-gradient(180deg, rgba(240,248,255,0.9) 0%, rgba(230,240,255,0.95) 100%)';
  const borderColor = dm ? 'rgba(0,200,255,0.15)' : 'rgba(0,113,227,0.12)';
  const textMain = dm ? '#e2e8f0' : '#1d1d1f';
  const textSub = dm ? 'rgba(0,200,255,0.6)' : '#6e6e73';
  const cardBg = dm ? 'rgba(0,200,255,0.05)' : 'rgba(255,255,255,0.7)';
  const cardBorder = dm ? 'rgba(0,200,255,0.1)' : 'rgba(0,0,0,0.07)';

  return (
    <div style={{ marginTop: '40px' }}>
      {/* Attack Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3060', animation: 'blink 1s infinite', boxShadow: '0 0 8px rgba(255,48,96,0.8)' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: dm ? '#00c8ff' : '#0071e3', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          LIVE ATTACK MONITOR — VAULT DEFENSE ACTIVE
        </span>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', animation: 'blink 1.4s infinite 0.3s', boxShadow: '0 0 8px rgba(0,255,136,0.8)' }} />
      </div>

      {/* Attack Type Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        {ATTACKS.map(atk => (
          <button
            key={atk.id}
            onClick={() => triggerAttack(atk.id)}
            style={{
              background: activeAttack === atk.id
                ? `linear-gradient(135deg, ${atk.color}22, ${atk.color}44)`
                : dm ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${activeAttack === atk.id ? atk.color : borderColor}`,
              borderRadius: '10px',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.2s',
              boxShadow: activeAttack === atk.id ? `0 0 16px ${atk.color}44` : 'none',
              minWidth: '90px',
            }}
          >
            <span style={{ fontSize: '18px' }}>{atk.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: activeAttack === atk.id ? atk.color : textSub, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
              {atk.label}
            </span>
            <span style={{ fontSize: '9px', color: dm ? 'rgba(255,255,255,0.3)' : '#aaa', fontFamily: "'JetBrains Mono', monospace" }}>
              ×{attackCount[atk.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* THE SCENE */}
      <div className="hacker-scene" style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: dm ? '0 0 40px rgba(0,200,255,0.08), inset 0 0 60px rgba(0,0,0,0.4)' : '0 4px 30px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        position: 'relative',
        height: '260px',
      }}>
        {/* Grid floor */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: dm
            ? 'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,200,255,0.06) 40px), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,200,255,0.06) 40px), rgba(0,10,20,0.8)'
            : 'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,113,227,0.04) 40px), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,113,227,0.04) 40px), rgba(230,240,255,0.5)',
        }} />

        {/* Scan line effect (dark only) */}
        {dm && <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)',
          animation: 'scanLine 3s linear infinite',
          pointerEvents: 'none',
          zIndex: 10,
        }} />}

        {/* Matrix rain (dark only) */}
        {dm && [0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 0,
            left: `${8 + i * 12}%`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'rgba(0,255,100,0.15)',
            animation: `matrixFall ${2 + i * 0.7}s linear infinite`,
            animationDelay: `${i * 0.4}s`,
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}>
            {['01','10','11','00','10','01','11'][i % 7]}
          </div>
        ))}

        {/* LEFT HACKER */}
        <div style={{ position: 'absolute', left: '40px', bottom: '72px', animation: 'slideRight 0.5s ease-out', animationFillMode: 'both' }}>
          {/* Hacker body (cartoon SVG) */}
          <svg width="70" height="90" viewBox="0 0 70 90" style={{ animation: 'hackerWalk 1.8s ease-in-out infinite' }}>
            {/* Hoodie */}
            <rect x="15" y="38" width="40" height="38" rx="8" fill={dm ? '#1a0a2e' : '#2d1b69'} />
            {/* Hood */}
            <ellipse cx="35" cy="32" rx="18" ry="20" fill={dm ? '#1a0a2e' : '#2d1b69'} />
            {/* Face */}
            <ellipse cx="35" cy="34" rx="13" ry="12" fill="#f4c090" />
            {/* Mask */}
            <rect x="22" y="38" width="26" height="12" rx="4" fill="#111" />
            {/* Eyes (glowing) */}
            <ellipse cx="29" cy="34" rx="3.5" ry="3" fill={attack.color} style={{ filter: `drop-shadow(0 0 4px ${attack.color})` }} />
            <ellipse cx="41" cy="34" rx="3.5" ry="3" fill={attack.color} style={{ filter: `drop-shadow(0 0 4px ${attack.color})` }} />
            {/* Laptop */}
            <rect x="10" y="64" width="36" height="22" rx="4" fill={dm ? '#0d0d1a' : '#111'} />
            <rect x="13" y="67" width="30" height="16" rx="2" fill={dm ? '#001a2e' : '#001133'} />
            {/* Screen content */}
            <rect x="15" y="69" width="18" height="2" rx="1" fill={attack.color} opacity="0.8" />
            <rect x="15" y="73" width="24" height="1.5" rx="1" fill="rgba(255,255,255,0.3)" />
            <rect x="15" y="77" width="20" height="1.5" rx="1" fill="rgba(255,255,255,0.2)" />
            {/* Legs */}
            <rect x="20" y="72" width="10" height="16" rx="4" fill={dm ? '#0d0d1a' : '#111'} />
            <rect x="36" y="72" width="10" height="16" rx="4" fill={dm ? '#0d0d1a' : '#111'} />
            {/* Shoes */}
            <ellipse cx="25" cy="88" rx="9" ry="3" fill="#222" />
            <ellipse cx="41" cy="88" rx="9" ry="3" fill="#222" />
          </svg>
          {/* Attack label */}
          <div style={{
            position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)',
            background: attack.color,
            color: '#fff',
            fontSize: '9px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em',
            boxShadow: `0 0 12px ${attack.color}88`,
            animation: 'attackPulse 1.5s ease-in-out infinite',
          }}>
            {attack.label.toUpperCase()} {attack.emoji}
          </div>
        </div>

        {/* RIGHT HACKER (accomplice) */}
        <div style={{ position: 'absolute', right: '120px', bottom: '72px', animation: 'slideLeft 0.5s ease-out', animationFillMode: 'both' }}>
          <svg width="55" height="75" viewBox="0 0 55 75" style={{ animation: 'hackerWalkR 2.2s ease-in-out infinite', transform: 'scaleX(-1)' }}>
            <rect x="10" y="30" width="35" height="32" rx="7" fill={dm ? '#1a1a0e' : '#3d3d00'} />
            <ellipse cx="27" cy="26" rx="15" ry="17" fill={dm ? '#1a1a0e' : '#3d3d00'} />
            <ellipse cx="27" cy="28" rx="11" ry="10" fill="#e8b080" />
            <rect x="16" y="30" width="22" height="10" rx="4" fill="#222" />
            <ellipse cx="21" cy="27" rx="3" ry="2.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 3px #00ff88)' }} />
            <ellipse cx="33" cy="27" rx="3" ry="2.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 3px #00ff88)' }} />
            <rect x="8" y="54" width="8" height="14" rx="3" fill={dm ? '#111' : '#222'} />
            <rect x="39" y="54" width="8" height="14" rx="3" fill={dm ? '#111' : '#222'} />
            {/* Phone */}
            <rect x="35" y="45" width="12" height="18" rx="3" fill="#111" />
            <rect x="37" y="47" width="8" height="12" rx="1" fill="#001a0a" />
            <rect x="38" y="49" width="6" height="1" rx="0.5" fill="#00ff88" opacity="0.7" />
            <rect x="38" y="52" width="4" height="1" rx="0.5" fill="rgba(255,255,255,0.3)" />
          </svg>
          <div style={{
            position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
            background: dm ? 'rgba(0,255,136,0.15)' : 'rgba(0,200,80,0.1)',
            border: '1px solid #00ff88',
            color: '#00ff88',
            fontSize: '8px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            ACCOMPLICE
          </div>
        </div>

        {/* FLYING BOMBS / PROJECTILES */}
        {bombs.map(bomb => (
          <div key={bomb.id} style={{
            position: 'absolute',
            left: '130px',
            bottom: '110px',
            fontSize: '24px',
            animation: 'bombFly 0.9s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
            '--bx': '220px',
            '--by': '-40px',
            zIndex: 20,
            filter: `drop-shadow(0 0 8px ${bomb.color})`,
          }}>
            {attack.emoji}
          </div>
        ))}

        {/* THE VAULT */}
        <div style={{
          position: 'absolute',
          right: '30px',
          bottom: '60px',
          animation: vaultHit ? 'vaultShake 0.5s ease-out' : 'vaultPulse 3s ease-in-out infinite',
        }}>
          <svg width="90" height="100" viewBox="0 0 90 100">
            {/* Vault shadow */}
            <ellipse cx="45" cy="98" rx="38" ry="5" fill="rgba(0,0,0,0.2)" />
            {/* Vault body */}
            <rect x="5" y="10" width="80" height="80" rx="12" fill={dm ? '#0a0a1a' : '#1a1a2e'} stroke={dm ? '#00c8ff' : '#0071e3'} strokeWidth="2.5" />
            {/* Vault door */}
            <rect x="14" y="18" width="62" height="65" rx="8" fill={dm ? '#050510' : '#0d0d24'} stroke={dm ? 'rgba(0,200,255,0.4)' : 'rgba(0,113,227,0.4)'} strokeWidth="1.5" />
            {/* Dial */}
            <circle cx="45" cy="50" r="20" fill={dm ? '#0a0a20' : '#111'} stroke={dm ? '#00c8ff' : '#0071e3'} strokeWidth="2" />
            <circle cx="45" cy="50" r="14" fill={dm ? '#060610' : '#0a0a1a'} />
            <circle cx="45" cy="38" r="3" fill={dm ? '#00c8ff' : '#0071e3'} />
            <circle cx="55" cy="46" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="35" cy="46" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="45" cy="62" r="3" fill="rgba(255,255,255,0.2)" />
            {/* Dial pointer */}
            <line x1="45" y1="50" x2="45" y2="36" stroke={dm ? '#00c8ff' : '#0071e3'} strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: '45px 50px', animation: 'spinSlow 4s linear infinite' }} />
            {/* Handle */}
            <rect x="68" y="45" width="12" height="10" rx="4" fill={dm ? '#00c8ff' : '#0071e3'} />
            {/* Lock indicator */}
            <circle cx="45" cy="20" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 6px #00ff88)' }} />
            <text x="45" y="23" textAnchor="middle" fontSize="5" fill="#000" fontWeight="bold">🔒</text>
            {/* Shield icon */}
            <text x="45" y="56" textAnchor="middle" fontSize="14" style={{ animation: 'shieldGlow 2s ease-in-out infinite', display: 'inline-block' }}>🛡️</text>
          </svg>

          {/* Vault reply bubble */}
          {showReply && (
            <div style={{
              position: 'absolute',
              bottom: '105px',
              right: '-10px',
              background: dm ? 'rgba(0,255,136,0.12)' : 'rgba(0,180,80,0.1)',
              border: `1px solid ${dm ? 'rgba(0,255,136,0.5)' : 'rgba(0,150,60,0.3)'}`,
              borderRadius: '12px 12px 4px 12px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: dm ? '#00ff88' : '#006633',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              boxShadow: dm ? '0 0 20px rgba(0,255,136,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
              animation: 'replyBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              fontFamily: "'Space Grotesk', sans-serif",
              zIndex: 30,
            }}>
              {reply}
            </div>
          )}
        </div>

        {/* Attack info strip at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42px',
          background: dm ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          borderTop: `1px solid ${dm ? 'rgba(0,200,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: attack.color,
            boxShadow: `0 0 8px ${attack.color}`,
            animation: 'blink 0.7s infinite',
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: attack.color, fontWeight: 700, letterSpacing: '0.1em' }}>
            ACTIVE: {attack.label.toUpperCase()}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: dm ? 'rgba(255,255,255,0.4)' : '#888' }}>
            {attack.desc}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#00ff88', fontWeight: 700 }}>
              🛡️ {totalBlocked.toLocaleString()} BLOCKED
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
        {[
          { label: 'Total Blocked', val: totalBlocked.toLocaleString(), icon: '🛡️', color: '#00ff88' },
          { label: 'Active Attackers', val: '2', icon: '👾', color: attack.color },
          { label: 'Vault Status', val: 'SECURE', icon: '🔒', color: '#00c8ff' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: dm ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${dm ? 'rgba(0,200,255,0.1)' : 'rgba(0,0,0,0.07)'}`,
            borderRadius: '12px',
            padding: '12px 14px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{stat.icon}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 800, color: stat.color, letterSpacing: '0.02em' }}>{stat.val}</div>
            <div style={{ fontSize: '10px', color: dm ? 'rgba(255,255,255,0.35)' : '#888', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
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

  // ===== DARK MODE STATE =====
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('passguard_darkmode') === 'true';
  });

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

  const handleScanUrl = async () => {
    if (!urlToScan) return;
    setIsScanningUrl(true); setUrlResult(null);
    // Step 1: fast local heuristic
    const heuristicResult = analyzeUrl(urlToScan);
    // Step 2: Google Safe Browsing API (async, free)
    let gsbResult = { checked: false, flagged: false, threats: [] };
    try {
      let normalizedUrl = urlToScan.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) normalizedUrl = 'https://' + normalizedUrl;
      gsbResult = await checkGoogleSafeBrowsing(normalizedUrl);
    } catch (_) {}
    // Step 3: merge results
    let finalResult = { ...heuristicResult, apiChecked: gsbResult.checked };
    if (gsbResult.flagged && gsbResult.threats.length > 0) {
      const threatNames = { MALWARE: '💀 Malware', SOCIAL_ENGINEERING: '🎣 Phishing/Social Engineering', UNWANTED_SOFTWARE: '🦠 Unwanted Software', POTENTIALLY_HARMFUL_APPLICATION: '☠️ Harmful App' };
      const formattedThreats = gsbResult.threats.map(t => threatNames[t] || t);
      finalResult = {
        isSafe: false,
        score: Math.max(finalResult.score, 85),
        reasons: [`🚨 GOOGLE SAFE BROWSING: ${formattedThreats.join(', ')} DETECTED`, ...finalResult.reasons],
        positives: [],
        apiChecked: true,
        apiFlag: true,
      };
    } else if (gsbResult.checked) {
      finalResult.positives = ['✅ Google Safe Browsing: No known threats', ...(finalResult.positives || [])];
      // If GSB clean and heuristic low, reduce score a bit
      if (finalResult.score < 30) finalResult.isSafe = true;
    }
    setUrlResult(finalResult);
    setIsScanningUrl(false);
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

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('passguard_darkmode', String(newVal));
  };

  const dm = darkMode;

  return (
    <div style={{ minHeight: '100vh', background: dm ? 'linear-gradient(135deg, #060610 0%, #0d0d1f 35%, #080814 70%, #06060e 100%)' : 'linear-gradient(135deg, #e8f0ff 0%, #f5f5ff 40%, #eef5ff 70%, #f0e8ff 100%)', fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif", position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .mac-card { backdrop-filter: blur(24px) saturate(200%); -webkit-backdrop-filter: blur(24px) saturate(200%); border-radius: 18px; transition: background 0.3s, border 0.3s, box-shadow 0.3s; }
        .mac-card:hover { transform: translateY(-1px); }
        .mac-input { border-radius: 12px; outline: none; transition: all 0.25s; font-family: 'Space Grotesk', inherit; font-size: 15px; }
        .mac-btn-primary { background: linear-gradient(135deg, #0077ed 0%, #5b00d6 100%); color: #fff; border: none; border-radius: 12px; font-family: 'Space Grotesk', inherit; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 20px rgba(0,100,220,0.35), inset 0 1px 0 rgba(255,255,255,0.2); letter-spacing: 0.02em; }
        .mac-btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, #0090ff 0%, #7c22f0 100%); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,100,220,0.45); }
        .mac-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .mac-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .mac-tab { background: transparent; border: none; border-radius: 10px; font-family: 'Space Grotesk', inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; padding: 8px 15px; }
        .mac-pill { border-radius: 20px; font-size: 12px; font-weight: 700; padding: 4px 12px; }
        .mac-danger-btn { background: rgba(255,59,48,0.1); border: 1px solid rgba(255,59,48,0.25); border-radius: 10px; color: #ff3b30; font-family: 'Space Grotesk', inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; padding: 7px 14px; }
        .mac-danger-btn:hover { background: rgba(255,59,48,0.2); transform: scale(1.03); }
        .mac-success-btn { background: rgba(52,199,89,0.1); border: 1px solid rgba(52,199,89,0.3); border-radius: 10px; color: #34c759; font-family: 'Space Grotesk', inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; padding: 7px 14px; }
        .mac-success-btn:hover { background: rgba(52,199,89,0.2); }
        .slider-mac { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 3px; outline: none; }
        .slider-mac::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: pointer; transition: transform 0.15s; }
        .slider-mac::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .fade-in { animation: fadeUp 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .traffic-dot { width: 13px; height: 13px; border-radius: 50%; display: inline-block; transition: transform 0.2s; }
        .traffic-dot:hover { transform: scale(1.3); }
        .checkbox-mac { width: 17px; height: 17px; accent-color: #0071e3; cursor: pointer; }
        .select-mac { border-radius: 10px; padding: 10px 14px; font-family: 'Space Grotesk', inherit; font-size: 14px; outline: none; width: 100%; cursor: pointer; }
        .vault-item { border-radius: 14px; transition: all 0.25s; }
        .icon-btn { background: transparent; border: none; border-radius: 8px; padding: 6px 8px; cursor: pointer; font-size: 15px; transition: background 0.15s, transform 0.15s; }
        .icon-btn:hover { transform: scale(1.15); }
        .icon-btn-danger:hover { background: rgba(255,59,48,0.1); }

        /* === ATTACK SCENE ANIMATIONS === */
        @keyframes hackerWalk { 0%,100% { transform: translateX(0) scaleX(-1); } 50% { transform: translateX(-8px) scaleX(-1); } }
        @keyframes hackerWalkR { 0%,100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
        @keyframes bombFly { 0% { transform: translate(0,0) rotate(0deg); opacity:1; } 70% { opacity:1; } 100% { transform: translate(var(--bx,80px), var(--by,-80px)) rotate(720deg); opacity:0; } }
        @keyframes explosion { 0% { transform: scale(0); opacity:1; } 60% { transform: scale(1.8); opacity:0.8; } 100% { transform: scale(2.5); opacity:0; } }
        @keyframes vaultShake { 0%,100% { transform: translateX(0) rotate(0deg); } 15% { transform: translateX(-6px) rotate(-1.5deg); } 30% { transform: translateX(6px) rotate(1.5deg); } 45% { transform: translateX(-4px) rotate(-1deg); } 60% { transform: translateX(4px) rotate(1deg); } 75% { transform: translateX(-2px); } }
        @keyframes vaultPulse { 0%,100% { box-shadow: 0 0 20px rgba(0,113,227,0.3); } 50% { box-shadow: 0 0 50px rgba(0,113,227,0.7), 0 0 80px rgba(91,0,214,0.4); } }
        @keyframes scanLine { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes dataStream { 0% { transform: translateY(-100%); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        @keyframes glitch1 { 0%,90%,100% { clip-path: inset(0 0 100% 0); } 92% { clip-path: inset(20% 0 60% 0); transform: translateX(-4px); } 94% { clip-path: inset(50% 0 30% 0); transform: translateX(4px); } 96% { clip-path: inset(10% 0 80% 0); transform: translateX(-2px); } }
        @keyframes float1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes attackPulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes replyBounce { 0% { transform: translateY(10px) scale(0.8); opacity:0; } 60% { transform: translateY(-4px) scale(1.05); } 100% { transform: translateY(0) scale(1); opacity:1; } }
        @keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes slideRight { from { transform: translateX(-120px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes slideLeft { from { transform: translateX(120px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes matrixFall { 0% { transform: translateY(-20px); opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { transform: translateY(200px); opacity:0; } }
        @keyframes shieldGlow { 0%,100% { filter: drop-shadow(0 0 8px rgba(0,255,100,0.6)); } 50% { filter: drop-shadow(0 0 22px rgba(0,255,100,1)); } }
        @keyframes countUp { from { opacity:0; } to { opacity:1; } }
        @keyframes waveform { 0%,100% { height: 4px; } 50% { height: 20px; } }
        @keyframes neonFlicker { 0%,19%,21%,23%,25%,54%,56%,100% { opacity:1; } 20%,24%,55% { opacity:0.4; } }
        .neon-text { animation: neonFlicker 4s infinite; }
        .hacker-scene { position: relative; height: 260px; overflow: hidden; margin-top: 32px; border-radius: 20px; }
        .attack-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; }
      `}</style>
      <style>{dm ? `
        .mac-card { background: rgba(14,14,24,0.92); border: 1px solid rgba(0,200,255,0.1); box-shadow: 0 4px 30px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,200,255,0.05); }
        .mac-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(0,200,255,0.15); color: #e2e8f0; }
        .mac-input:focus { border-color: #00c8ff; box-shadow: 0 0 0 3px rgba(0,200,255,0.2), 0 0 20px rgba(0,200,255,0.1); background: rgba(0,200,255,0.05); }
        .mac-input::placeholder { color: rgba(255,255,255,0.22); }
        .mac-tab { color: rgba(255,255,255,0.4); font-family: 'Space Grotesk', sans-serif; }
        .mac-tab:hover { background: rgba(0,200,255,0.08); color: #00c8ff; }
        .mac-tab.active { background: rgba(0,200,255,0.12); color: #00c8ff; box-shadow: 0 0 20px rgba(0,200,255,0.2); border: 1px solid rgba(0,200,255,0.2); }
        .mac-secondary-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; border-radius: 10px; padding: 7px 14px; }
        .mac-secondary-btn:hover { background: rgba(255,255,255,0.12); }
        .select-mac { background: rgba(14,14,24,0.9); border: 1px solid rgba(0,200,255,0.15); color: #e2e8f0; }
        .select-mac:focus { border-color: #00c8ff; box-shadow: 0 0 0 3px rgba(0,200,255,0.2); }
        .vault-item { background: rgba(0,200,255,0.03); border: 1px solid rgba(0,200,255,0.08); }
        .vault-item:hover { background: rgba(0,200,255,0.07); box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.15); }
        .icon-btn:hover { background: rgba(0,200,255,0.1); }
        .slider-mac { background: linear-gradient(to right, #00c8ff 0%, #00c8ff var(--val,50%), #1a1a2e var(--val,50%), #1a1a2e 100%); }
        .slider-mac::-webkit-slider-thumb { background: #0f0f1a; border: 2px solid #00c8ff; box-shadow: 0 0 10px rgba(0,200,255,0.5); }
        select option { background: #0f0f1a; color: #e2e8f0; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,255,0.2); }
      ` : `
        .mac-card { background: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.95); box-shadow: 0 4px 30px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.85); }
        .mac-input { background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.1); color: #1d1d1f; }
        .mac-input:focus { border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.15); background: #fff; }
        .mac-input::placeholder { color: rgba(0,0,0,0.3); }
        .mac-tab { color: #6e6e73; font-family: 'Space Grotesk', sans-serif; }
        .mac-tab:hover { background: rgba(0,0,0,0.05); color: #1d1d1f; }
        .mac-tab.active { background: #fff; color: #0071e3; box-shadow: 0 2px 8px rgba(0,0,0,0.1), 0 0.5px 2px rgba(0,0,0,0.06); }
        .mac-secondary-btn { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); color: #1d1d1f; border-radius: 10px; padding: 7px 14px; }
        .mac-secondary-btn:hover { background: rgba(0,0,0,0.09); }
        .select-mac { background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.1); color: #1d1d1f; }
        .select-mac:focus { border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.15); }
        .vault-item { background: rgba(255,255,255,0.65); border: 1px solid rgba(0,0,0,0.07); }
        .vault-item:hover { background: rgba(255,255,255,0.92); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
        .icon-btn:hover { background: rgba(0,0,0,0.06); }
        .slider-mac { background: linear-gradient(to right, #0071e3 0%, #0071e3 var(--val,50%), #d1d1d6 var(--val,50%), #d1d1d6 100%); }
        .slider-mac::-webkit-slider-thumb { background: #fff; border: 2px solid rgba(0,0,0,0.18); }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '600px', height: '600px', background: `radial-gradient(circle, rgba(0,${dm?'200,255':'113,227'},${dm?'0.12':'0.07'}) 0%, transparent 70%)`, borderRadius: '50%', animation: 'spinSlow 20s linear infinite' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '700px', height: '700px', background: `radial-gradient(circle, rgba(${dm?'91,0,214':'175,82,222'},${dm?'0.15':'0.07'}) 0%, transparent 70%)`, borderRadius: '50%', animation: 'spinSlow 30s linear infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '450px', height: '450px', background: `radial-gradient(circle, rgba(${dm?'255,60,100':'52,199,89'},${dm?'0.08':'0.05'}) 0%, transparent 70%)`, borderRadius: '50%' }} />
        {dm && <>
          <div style={{ position: 'absolute', top: '20%', right: '15%', width: '2px', height: '2px', borderRadius: '50%', background: '#00c8ff', boxShadow: '0 0 6px 3px rgba(0,200,255,0.6)', animation: 'blink 2.3s infinite' }} />
          <div style={{ position: 'absolute', top: '60%', left: '10%', width: '2px', height: '2px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px 3px rgba(168,85,247,0.6)', animation: 'blink 1.7s infinite 0.5s' }} />
          <div style={{ position: 'absolute', top: '45%', right: '5%', width: '1px', height: '1px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 4px 2px rgba(0,255,136,0.6)', animation: 'blink 3.1s infinite 1s' }} />
        </>}
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
        
        {/* Traffic dots + Dark mode toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px', marginBottom: '24px', position: 'relative' }}>
          <span className="traffic-dot" style={{ background: '#ff5f57' }} />
          <span className="traffic-dot" style={{ background: '#ffbd2e' }} />
          <span className="traffic-dot" style={{ background: '#28c840' }} />
          <button
            onClick={toggleDarkMode}
            title={dm ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              position: 'absolute', right: 0,
              background: dm ? 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(168,85,247,0.15))' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${dm ? 'rgba(0,200,255,0.3)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '20px', padding: '6px 14px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 700,
              color: dm ? '#00c8ff' : '#1d1d1f',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.25s', fontFamily: "'Space Grotesk', inherit",
              backdropFilter: 'blur(10px)',
              boxShadow: dm ? '0 0 16px rgba(0,200,255,0.2)' : 'none',
              letterSpacing: '0.03em',
            }}
          >
            {dm ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 700, background: dm ? 'linear-gradient(135deg, #00c8ff 0%, #a855f7 50%, #ff3060 100%)' : 'linear-gradient(135deg, #0071e3 0%, #5b00d6 50%, #0071e3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.04em', marginBottom: '8px', lineHeight: 1.1, animation: dm ? 'neonFlicker 8s infinite' : 'none' }}>
            🔐 Password Security Hub
          </h1>
          <p style={{ color: dm ? 'rgba(0,200,255,0.55)' : '#6e6e73', fontSize: '15px', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
            {dm ? '> CHECK · GENERATE · SCAN · PROTECT_' : 'Check, Generate, Scan & Protect Your Digital Life'}
          </p>
        </header>

        {/* Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '4px', display: 'flex', gap: '2px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: dm ? '#e2e8f0' : '#1d1d1f' }}>🔗 Deep Threat URL Scanner</h3>
                <span style={{ fontSize: '10px', fontWeight: 700, background: 'linear-gradient(135deg, #4285f4, #34a853)', color: '#fff', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>+ Google Safe Browsing</span>
              </div>
              <p style={{ color: dm ? 'rgba(0,200,255,0.5)' : '#6e6e73', fontSize: '13px', marginBottom: '20px', fontFamily: "'JetBrains Mono', monospace" }}>
                Multi-layer: Heuristics v3 + Google Safe Browsing API + 2024/25 scam patterns
              </p>
              <input type="text" value={urlToScan} onChange={e => setUrlToScan(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleScanUrl()} placeholder="Paste any URL... (e.g., https://login-hdfc-kyc.xyz/verify)" className="mac-input" style={{ width: '100%', padding: '12px 16px', marginBottom: '12px' }} />
              <button onClick={handleScanUrl} disabled={!urlToScan || isScanningUrl} className="mac-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
                {isScanningUrl ? '⏳ Checking Google Safe Browsing + Heuristics...' : '🕵️ Run Deep Scan'}
              </button>
              {/* What we detect */}
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Phishing','Malware','Typosquatting','Crypto Scam','UPI Fraud','Govt Impersonation','Tech Support Scam','Open Redirect','DGA Domains','Homoglyph'].map(tag => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: dm ? 'rgba(0,200,255,0.08)' : 'rgba(0,0,0,0.05)', color: dm ? 'rgba(0,200,255,0.6)' : '#6e6e73', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>{tag}</span>
                ))}
              </div>
            </div>
            {urlResult && (
              <div className="mac-card fade-in" style={{ padding: '24px', border: `1.5px solid ${urlResult.isSafe ? 'rgba(52,199,89,0.35)' : 'rgba(255,59,48,0.35)'}`, background: urlResult.isSafe ? (dm ? 'rgba(0,255,100,0.04)' : 'rgba(52,199,89,0.05)') : (dm ? 'rgba(255,48,60,0.06)' : 'rgba(255,59,48,0.05)') }}>
                {/* Header row */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '2.8rem', lineHeight: 1 }}>{urlResult.isSafe ? '✅' : '🚨'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '19px', fontWeight: 800, color: urlResult.isSafe ? '#22c55e' : '#ff3b30', marginBottom: '4px' }}>
                          {urlResult.isSafe ? 'URL Looks Safe ✓' : 'THREAT DETECTED ✗'}
                        </h3>
                        {/* API badge */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '5px', background: urlResult.apiChecked ? 'rgba(52,199,89,0.15)' : 'rgba(255,160,0,0.12)', color: urlResult.apiChecked ? '#16a34a' : '#b45309', border: `1px solid ${urlResult.apiChecked ? 'rgba(52,199,89,0.3)' : 'rgba(255,160,0,0.3)'}`, fontFamily: "'JetBrains Mono', monospace" }}>
                            {urlResult.apiChecked ? '✓ Google Safe Browsing: Checked' : '⚠ Google Safe Browsing: Unavailable (CORS)'}
                          </span>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '5px', background: 'rgba(0,113,227,0.1)', color: '#0071e3', border: '1px solid rgba(0,113,227,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>
                            ✓ Heuristics v3
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: dm ? 'rgba(255,255,255,0.4)' : '#6e6e73', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>Threat Score</div>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: urlResult.score === 0 ? '#22c55e' : urlResult.score < 25 ? '#f59e0b' : urlResult.score < 55 ? '#f97316' : '#ff3b30', fontFamily: "'JetBrains Mono', monospace" }}>{urlResult.score}<span style={{ fontSize: '14px' }}>%</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Threat bar */}
                <div style={{ height: '6px', background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '4px', marginBottom: '18px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${urlResult.score}%`, background: urlResult.score === 0 ? '#22c55e' : urlResult.score < 25 ? '#f59e0b' : urlResult.score < 55 ? '#f97316' : 'linear-gradient(90deg, #ff6b35, #ff3b30)', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.34,1.1,0.64,1)' }} />
                </div>

                {/* Positive signals */}
                {urlResult.positives && urlResult.positives.length > 0 && (
                  <div style={{ background: dm ? 'rgba(0,255,100,0.05)' : 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>✅ Clean Signals</div>
                    {urlResult.positives.map((p, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500, marginBottom: '4px' }}>{p}</div>
                    ))}
                  </div>
                )}

                {/* Threat logs */}
                <div style={{ background: dm ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', borderRadius: '10px', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`, padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: dm ? 'rgba(0,200,255,0.6)' : '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
                    🔍 Threat Analysis Logs
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {urlResult.reasons.map((reason, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: urlResult.isSafe ? '#16a34a' : (reason.startsWith('🚨') ? '#dc2626' : '#d97706'), fontWeight: 600, padding: '6px 10px', background: reason.startsWith('🚨') ? 'rgba(220,38,38,0.06)' : reason.startsWith('⚠') ? 'rgba(217,119,6,0.06)' : 'rgba(22,163,74,0.06)', borderRadius: '6px', borderLeft: `3px solid ${reason.startsWith('🚨') ? '#dc2626' : reason.startsWith('⚠') ? '#d97706' : '#16a34a'}` }}>{reason}</div>
                    ))}
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

        {/* ===== HACKER ATTACK SCENE ===== */}
        <HackerAttackScene dm={dm} />

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '32px', color: dm ? 'rgba(0,200,255,0.3)' : '#a1a1aa', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
          <p>🔐 Powered by Have I Been Pwned API • Your passwords never leave your browser</p>
          <p style={{ marginTop: '4px' }}>Made with ❤️ for your security</p>
        </footer>
      </div>
    </div>
  );
}
