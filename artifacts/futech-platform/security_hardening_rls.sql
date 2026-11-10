-- ============================================================================
-- FuTech Platform - Security Hardening & Complete RLS Remediation (OWASP ASVS)
-- ============================================================================
-- تشغيل هذا السكربت يغلق تماماً ثغرات الـ Account Takeover والتعديل غير المصرح به
-- يمنع أي مستخدم عادي أو هكر عبر Burp Suite أو Anon Key من تعديل حسابات الآخرين
-- يعتمد على auth.jwt() الموثوق لتجنب خطأ الصلاحيات (permission denied for table users)
-- ============================================================================

-- 1. تفعيل حماية Row Level Security على جدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. إزالة أي سياسات سابقة
DROP POLICY IF EXISTS "public_profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "own_profile_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all" ON public.profiles;

-- 3. سياسة القراءة العامة للملفات الشخصية (لتمكين عرض دليل المطورين والمشاريع)
CREATE POLICY "public_profiles_read" ON public.profiles
    FOR SELECT
    USING (true);

-- 4. سياسة الإضافة: المستخدم يمكنه فقط إضافة ملفه الشخصي المطابق لمعرفه السحابي
CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. سياسة التعديل الصارمة:
-- - المستخدم يمكنه فقط تعديل ملفه الشخصي الخاص (auth.uid() = id)
-- - استخدام auth.jwt() ->> 'email' الآمن والمباشر بدون استعلام auth.users
CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6. Trigger حماية مشدد لمنع تغيير الرتبة (Role Escalation) في قاعدة البيانات
-- يمنع أي مستخدم عادي من رفع رتبته إلى owner أو admin عبر Burp Suite أو REST API
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- إذا تغيرت الرتبة وكان المستخدم لا يحمل إيميل المالك في التوكن JWT
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF COALESCE(auth.jwt() ->> 'email', '') NOT IN (
            'menarobir246rm@gmail.com',
            'minarobir246rm@gmail.com',
            'minarobir@gmail.com',
            'mina.robir@gmail.com',
            'mena.robir@gmail.com',
            'minarob23@gmail.com'
        ) THEN
            RAISE EXCEPTION 'Privilege escalation rejected: only verified platform owner can change roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_profile_role_escalation();

-- 7. تشديد أمان المحافظ المالية (Wallets)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_wallet_read" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update" ON public.wallets;
DROP POLICY IF EXISTS "wallets_all" ON public.wallets;

-- قراءة المحفظة حصراً لصاحبها أو المالك عبر JWT
CREATE POLICY "own_wallet_read" ON public.wallets
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com',
            'minarobir246rm@gmail.com',
            'minarobir@gmail.com',
            'mina.robir@gmail.com',
            'mena.robir@gmail.com',
            'minarob23@gmail.com'
        )
    );

-- منع أي تعديل مباشر للمحافظ عبر REST API
-- لا توجد سياسة UPDATE عامة للمحافظ = مرفوضة تلقائياً من PostgreSQL

-- 8. تنظيف الحسابات الوهمية وتجريدها من رتبة المالك
UPDATE public.profiles 
SET role = 'developer' 
WHERE role = 'owner' 
AND id NOT IN ('e75a3a4f-b00b-458d-98a5-16d53922e54b');

-- إنهاء
SELECT 'Security Hardening & Trigger Applied Successfully' as status;
