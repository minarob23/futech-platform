# دليل ربط وتسجيل الدخول بحساب Google (OAuth 2.0) لمنصة فوتيك

هذا الدليل يوضح بالخطوات الدقيقة كيفية تفعيل وتسجيل الدخول عبر **Google OAuth 2.0** لمنصة **فوتيك (FuTech)** ليعمل بسلاسة في بيئة التطوير المحلية (`localhost:3000`) وبيئة الإنتاج السحابية على **Vercel**.

---

## 🏗️ كيف تعمل دورة تسجيل الدخول مع Supabase؟

```
[ المستخدم ] ──(1. اضغط تسجيل بجوجل)──> [ تطبيق فوتيك React ]
                                                │
                                    (2. redirectTo: window.location.origin)
                                                ▼
[ Google Accounts ] <──(3. مصادقة الحساب)── [ خادم Supabase Auth ]
        │
  (4. Redirect إلى Callback الخاص بـ Supabase)
        ▼
[ https://mluwwbxpsmxzpmjzetto.supabase.co/auth/v1/callback ]
        │
  (5. إنشاء / تحديث الجلسة وتوجيه المتصفح)
        ▼
[ رابط منصتك: localhost:3000 أو your-app.vercel.app ]
```

---

## 1️⃣ الخطوة الأولى: إعداد Google Cloud Console

1. افتح [Google Cloud Console](https://console.cloud.google.com/).
2. أنشئ مشروعاً جديداً أو اختر مشروعك الحالي (مثلاً: `FuTech-Platform`).
3. انتقل إلى **APIs & Services** > **OAuth consent screen** (شاشة موافقة OAuth):
   - اختر **External** (خارجي) ثم اضغط **Create**.
   - **App name**: `FuTech Platform` أو `فوتيك`
   - **User support email**: بريدك الإلكتروني (مثل: `mena.magdy2005@gmail.com`)
   - **Developer contact information**: بريدك الإلكتروني.
   - في قسم **Scopes**: تأكد من وجود `userinfo.email`, `userinfo.profile`, `openid`.
   - اضغط **Save and Continue** حتى الانتهاء.

4. انتقل إلى **Credentials** > **Create Credentials** > **OAuth client ID**:
   - **Application type**: اختر **Web application**.
   - **Name**: `FuTech Web Client`.
   - **Authorized JavaScript origins (الأصول المصرح بها)**:
     - `http://localhost:3000`
     - `http://localhost:5173`
     - `https://mluwwbxpsmxzpmjzetto.supabase.co`
     - `https://<your-project-name>.vercel.app` (رابط Vercel عند الرفع)
   - **Authorized redirect URIs (روابط إعادة التوجيه المصرح بها - بالغ الأهمية ⚠️)**:
     - أضف الرابط التالي بدقة متناهية:
     ```
     https://mluwwbxpsmxzpmjzetto.supabase.co/auth/v1/callback
     ```
   - اضغط **Create**.
   - سيظهر لك مربع يحتوي على:
     - **Client ID** (معرف العميل)
     - **Client Secret** (المفتاح السري للعميل)
     *(احتفظ بهما للخطوة التالية)*.

---

## 2️⃣ الخطوة الثانية: ربط المفاتيح في لوحة تحكم Supabase

1. افتح مشروعك في [Supabase Dashboard](https://supabase.com/dashboard/project/mluwwbxpsmxzpmjzetto).
2. من القائمة الجانبية، ادخل إلى **Authentication** > **Providers**.
3. ابحث عن **Google** واضغط لتوسيعه:
   - فعّل المفتاح: **Enable Google provider: ON**.
   - في خانة **Client ID**: الصق المعرّف من Google Cloud.
   - في خانة **Client Secret**: الصق المفتاح السري من Google Cloud.
   - اضغط **Save**.

4. من القائمة الجانبية ادخل إلى **Authentication** > **URL Configuration**:
   - **Site URL**:
     - محلياً: `http://localhost:3000`
     - في الإنتاج: `https://<your-app>.vercel.app`
   - **Redirect URLs (روابط إعادة التوجيه الإضافية)**: أضف الروابط التالية:
     - `http://localhost:3000/**`
     - `http://localhost:5173/**`
     - `https://*.vercel.app/**`
     - `https://<your-custom-domain>.com/**` (إذا كان لديك دومين مخصص)
   - اضغط **Save**.

---

## 3️⃣ الخطوة الثالثة: التحقق البرمجي التلقائي في المنصة

كود الواجهة في [`AuthContext.tsx`](file:///d:/futech-platform/artifacts/futech-platform/src/lib/AuthContext.tsx) مبرمج ومجهز ديناميكياً 100%:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
});
```

### ماذا يحدث عند الضغط على زر "تسجيل الدخول عبر Google"؟
1. يكتشف الكود تلقائياً ما إذا كنت على `localhost:3000` أو على رابط Vercel الفعلي، فيرسل الرابط كـ `redirectTo`.
2. يتم تخزين الرتبة المطلوبة (مطور / صاحب مشروع) مؤقتاً في `sessionStorage`.
3. فور العودة الناجحة، يُسحب الاسم والصورة الشخصية من حساب Google الحقيقي (`user_metadata.avatar_url` و `full_name`).
4. إذا كان الحساب يطابق بريد المالك (`mena.magdy2005@gmail.com`) أو هوية مينا مجدي، يُمنح تلقائياً صلاحيات **مالك المنصة 👑** وتظهر صورته الشخصية الحقيقية من Google في شريط التنقل ولوحة التحكم.

---

## 4️⃣ حل المشاكل الشائعة (Troubleshooting)

| المشكلة | السبب المحتمل | الحل |
| :--- | :--- | :--- |
| `redirect_uri_mismatch` | لم يتم إضافة رابط Supabase callback في Google Cloud | تأكد من إضافة `https://mluwwbxpsmxzpmjzetto.supabase.co/auth/v1/callback` داخل **Authorized redirect URIs** في Google Cloud Console |
| شاشة بيضاء أو عودة لصفحة خطأ | عدم تطابق Site URL في Supabase | أضف رابط الموقع إلى **Redirect URLs** في Supabase (مثلاً `http://localhost:3000/**` و `https://*.vercel.app/**`) |
| `Access blocked: App has not completed verification` | التطبيق ما زال في وضع التجربة (Testing mode) | في صفحة **OAuth consent screen**، أضف بريدك في قائمة **Test Users** أو اضغط **Publish App** ليكون عاماً لجميع المستخدمين |
