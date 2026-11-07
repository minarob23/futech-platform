/**
 * Web Push & Browser Notifications Engine for FuTech Platform
 * Provides native OS notifications, sound chimes, and background alerts
 * for incoming chat messages, project applications, and milestone updates.
 */

const PUSH_PREF_KEY = 'futech_browser_push_pref';

/**
 * Check if the browser supports native desktop/mobile notifications
 */
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get the current notification permission status ('granted' | 'denied' | 'default')
 */
export function getPushPermissionStatus(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      localStorage.setItem(PUSH_PREF_KEY, 'enabled');
      playNotificationChime();
      sendBrowserNotification('تم تفعيل إشعارات فوتيك بنجاح! 🔔', {
        body: 'ستتلقى الآن تنبيهات فورية للمحادثات والعروض والمراحل الهندسية.',
        tag: 'futech-welcome',
      });
      return true;
    } else {
      localStorage.setItem(PUSH_PREF_KEY, 'disabled');
      return false;
    }
  } catch (err) {
    console.error('[WebPush] Error requesting permission:', err);
    return false;
  }
}

/**
 * Play a gentle, high-tech notification chime using the Web Audio API
 * No external MP3 file dependency needed!
 */
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // Tone 1 (Teal note - 880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2 (Cyan note - 1320Hz / E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.06, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);
  } catch {
    // AudioContext blocked by browser autoplay policy until user gesture
  }
}

export interface NotificationOptionsCustom {
  body?: string;
  icon?: string;
  tag?: string;
  url?: string;
  sound?: boolean;
}

/**
 * Dispatch a native OS notification (desktop & mobile supported browsers)
 */
export function sendBrowserNotification(title: string, options: NotificationOptionsCustom = {}) {
  if (!isPushSupported()) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    if (options.sound !== false) {
      playNotificationChime();
    }

    const n = new Notification(title, {
      body: options.body || '',
      icon: options.icon || '/images/futech-logo.jpg',
      badge: '/favicon.svg',
      tag: options.tag || 'futech-' + Date.now(),
      dir: 'rtl',
      lang: 'ar',
    });

    n.onclick = () => {
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
      n.close();
    };

    return n;
  } catch (err) {
    console.warn('[WebPush] Failed to trigger notification:', err);
    return null;
  }
}
