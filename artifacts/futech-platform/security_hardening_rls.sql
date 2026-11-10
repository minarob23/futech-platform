-- ============================================================================
-- FuTech Platform - Security Hardening & Complete RLS Remediation (OWASP ASVS)
-- ============================================================================
-- تشغيل هذا السكربت يغلق تماماً ثغرات الـ Account Takeover والتعديل غير المصرح به
-- يمنع أي مستخدم عادي أو هكر عبر Burp Suite أو Anon Key من تعديل حسابات الآخرين
-- ============================================================================

-- 1. تفعيل حماية Row Level Security على جدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. إزالة أي سياسات مفتوحة سابقاً
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
-- - منع رفع الصلاحيات (Privilege Escalation): لا يمكن لأي مستخدم عادي تحويل رتبته إلى owner أو admin
CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND (
            -- الرتبة لا تتغير، أو تكون نفس الرتبة الحالية
            role = (SELECT role FROM public.profiles WHERE id = auth.uid())
            OR (
                -- أو يكون المستخدم هو مالك المنصة المعتمد في جدول auth.users
                EXISTS (
                    SELECT 1 FROM auth.users 
                    WHERE id = auth.uid() 
                    AND email IN (
                        'menarobir246rm@gmail.com',
                        'minarobir246rm@gmail.com',
                        'minarobir@gmail.com',
                        'mina.robir@gmail.com',
                        'mena.robir@gmail.com',
                        'minarob23@gmail.com'
                    )
                )
            )
        )
    );

-- 6. تشديد أمان المحافظ المالية (Wallets)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_wallet_read" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update" ON public.wallets;
DROP POLICY IF EXISTS "wallets_all" ON public.wallets;

-- قراءة المحفظة حصراً لصاحبها أو المالك
CREATE POLICY "own_wallet_read" ON public.wallets
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email IN (
                'menarobir246rm@gmail.com',
                'minarobir246rm@gmail.com',
                'minarobir@gmail.com',
                'mina.robir@gmail.com',
                'mena.robir@gmail.com',
                'minarob23@gmail.com'
            )
        )
    );

-- منع أي مستخدم من تعديل رصيد محفظته مباشرة عبر REST API (التعديل يتم عبر الدوال السحابية المؤمنة فقط)
-- لا توجد سياسة UPDATE عامة للمحافظ = مرفوضة تلقائياً من PostgreSQL

-- 7. تنظيف أي حسابات وهمية ادعت صلاحية المالك سابقاً
UPDATE public.profiles 
SET role = 'developer' 
WHERE role = 'owner' 
AND id NOT IN ('e75a3a4f-b00b-458d-98a5-16d53922e54b');

-- إنهاء
SELECT 'Security Hardening Applied Successfully' as status;
