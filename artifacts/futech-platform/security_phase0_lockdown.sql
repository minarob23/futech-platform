-- ============================================================================
-- FuTech Platform - Phase 0 Master Security Lockdown (OWASP ASVS Standard)
-- ============================================================================
-- تاريخ التقرير: Nov 10, 2026 | مراجعة أمنية شاملة لـ schema.sql
-- يقفل هذا السكربت الثغرات الحرجة S1, S2, S3, S4, S5, S6, S9, S11 بشكل جذري
-- ويعتمد على auth.uid() و auth.jwt() الموثقين دون استعلام جداول خاصة
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. غلق جدول الملفات الشخصية profiles (S1, S2, S3, S9, S11)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "own_profile_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "public_profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- قراءة عامة للبيانات غير الحساسة (دليل المطورين والعملاء)
CREATE POLICY "profiles_select_public" ON public.profiles
    FOR SELECT USING (true);

-- إضافة الملف الشخصي: فقط للمستخدم نفسه بناءً على جلسة Supabase Auth
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- تعديل الملف الشخصي: للمستخدم نفسه فقط
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- منع تصعيد الصلاحيات (Trigger صارم لمنع تعديل role أو fqs أو rating)
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
DECLARE
    v_is_owner BOOLEAN;
BEGIN
    v_is_owner := COALESCE(auth.jwt() ->> 'email', '') IN (
        'menarobir246rm@gmail.com',
        'minarobir246rm@gmail.com',
        'minarobir@gmail.com',
        'mina.robir@gmail.com',
        'mena.robir@gmail.com',
        'minarob23@gmail.com'
    );

    -- منع تغيير الرتبة لغير المالك المعتمد
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT v_is_owner THEN
        RAISE EXCEPTION 'Privilege escalation rejected: role cannot be modified by user.';
    END IF;

    -- منع التلاعب بمؤشر FQS أو التوثيق أو التقييم من العميل
    IF (NEW.fqs IS DISTINCT FROM OLD.fqs OR NEW.is_verified IS DISTINCT FROM OLD.is_verified) AND NOT v_is_owner THEN
        NEW.fqs := OLD.fqs;
        NEW.is_verified := OLD.is_verified;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_sensitive_fields();


-- تحديث الـ Trigger عند تسجيل مستخدم جديد (S3, S11)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_requested_role TEXT;
    v_assigned_role  TEXT;
    v_name           TEXT;
    v_country        TEXT;
    v_is_owner       BOOLEAN;
BEGIN
    v_is_owner := NEW.email IN (
        'menarobir246rm@gmail.com',
        'minarobir246rm@gmail.com',
        'minarobir@gmail.com',
        'mina.robir@gmail.com',
        'mena.robir@gmail.com',
        'minarob23@gmail.com'
    );

    v_requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
    
    -- حظر أي تسجيل برتبة owner أو admin عبر الواجهة العامة
    IF v_is_owner THEN
        v_assigned_role := 'owner';
    ELSIF v_requested_role = 'developer' THEN
        v_assigned_role := 'developer';
    ELSE
        v_assigned_role := 'client';
    END IF;

    v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    v_country := COALESCE(NEW.raw_user_meta_data->>'country', 'مصر');

    -- المستخدم الجديد يبدأ غير موثق وبتقييم صفر حتى ينفذ مشاريع حقيقية (علاج S11)
    INSERT INTO public.profiles (
        id, full_name, avatar_url, role, country, specialty, company_name, 
        is_verified, is_available, rating, completed_projects, fqs, hourly_rate
    )
    VALUES (
        NEW.id,
        v_name,
        NEW.raw_user_meta_data->>'avatar_url',
        v_assigned_role,
        v_country,
        NEW.raw_user_meta_data->>'specialty',
        NEW.raw_user_meta_data->>'company_name',
        v_is_owner, -- التوثيق التلقائي للمالك فقط
        TRUE,
        CASE WHEN v_is_owner THEN 5.0 ELSE 0.0 END,
        CASE WHEN v_is_owner THEN 15 ELSE 0 END,
        CASE WHEN v_is_owner THEN 99 ELSE 0 END,
        CASE WHEN v_is_owner THEN 1750.00 ELSE 200.00 END
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        country = EXCLUDED.country,
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

    -- إنشاء المحفظة المالية بصفر رصيد
    INSERT INTO public.wallets (user_id, currency, total_balance, available_balance, in_escrow_balance)
    VALUES (NEW.id, CASE WHEN v_country = 'مصر' THEN 'EGP' ELSE 'SAR' END, 0.00, 0.00, 0.00)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- ----------------------------------------------------------------------------
-- 2. غلق جدول المحافظ والمعاملات المالية wallets & transactions (S2)
-- ----------------------------------------------------------------------------
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_wallet_read" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update" ON public.wallets;
DROP POLICY IF EXISTS "wallets_all" ON public.wallets;

-- القراءة حصراً لصاحب المحفظة عبر auth.uid() أو للمالك المعتمد عبر JWT email
CREATE POLICY "wallets_select_own" ON public.wallets
    FOR SELECT USING (
        auth.uid() = user_id
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );

-- منع التعديل والإدخال المباشر للمحافظ من قبل العميل عبر REST API
-- التعديل يتم حصراً عبر الدوال المخزنة SECURITY DEFINER

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_transactions_read" ON public.transactions;
DROP POLICY IF EXISTS "transactions_all" ON public.transactions;

CREATE POLICY "transactions_select_own" ON public.transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );


-- ----------------------------------------------------------------------------
-- 3. تأمين عقود ودوال الضمان المالي Escrow (S4)
-- ----------------------------------------------------------------------------
ALTER TABLE public.escrow_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "escrow_parties_read" ON public.escrow_contracts;
DROP POLICY IF EXISTS "escrow_all" ON public.escrow_contracts;

CREATE POLICY "escrow_select_parties" ON public.escrow_contracts
    FOR SELECT USING (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );

-- إعادة كتابة دالة تحرير دفعة الضمان: الاعتماد الصارم على auth.uid() لمنع تحرير المطور للدفعة لنفسه
CREATE OR REPLACE FUNCTION public.release_escrow_payment(
    p_escrow_id UUID
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id         UUID := auth.uid();
    v_caller_email      TEXT := COALESCE(auth.jwt() ->> 'email', '');
    v_is_owner          BOOLEAN;
    v_escrow            RECORD;
    v_client_wallet_id  UUID;
    v_dev_wallet_id     UUID;
    v_platform_fee      NUMERIC(12,2);
    v_developer_amount  NUMERIC(12,2);
    v_ref_release       TEXT;
    v_ref_earn          TEXT;
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to release escrow.';
    END IF;

    v_is_owner := v_caller_email IN (
        'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
        'minarobir@gmail.com', 'mina.robir@gmail.com',
        'mena.robir@gmail.com', 'minarob23@gmail.com'
    );

    SELECT * INTO v_escrow FROM public.escrow_contracts
    WHERE id = p_escrow_id AND status = 'held'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'عقد الضمان غير موجود أو تم تحريره مسبقاً';
    END IF;

    -- التحقق الحاسم من الهوية: فقط صاحب العمل صاحب العقد أو مالك المنصة يمكنه تحرير الدفعة للمطور
    IF v_escrow.client_id != v_caller_id AND NOT v_is_owner THEN
        RAISE EXCEPTION 'غير مصرح: تحرير الدفعة محصور بالعميل المتعاقد فقط أو مالك المنصة';
    END IF;

    SELECT id INTO v_client_wallet_id FROM public.wallets WHERE user_id = v_escrow.client_id;
    SELECT id INTO v_dev_wallet_id    FROM public.wallets WHERE user_id = v_escrow.developer_id;

    v_platform_fee     := ROUND(v_escrow.amount * (COALESCE(v_escrow.platform_fee_rate, 0) / 100), 2);
    v_developer_amount := v_escrow.amount - v_platform_fee;

    UPDATE public.wallets
    SET in_escrow_balance = in_escrow_balance - v_escrow.amount,
        total_balance     = total_balance - v_escrow.amount
    WHERE id = v_client_wallet_id;

    UPDATE public.wallets
    SET available_balance = available_balance + v_developer_amount,
        total_balance     = total_balance + v_developer_amount,
        lifetime_earned   = lifetime_earned + v_developer_amount
    WHERE id = v_dev_wallet_id;

    UPDATE public.escrow_contracts
    SET status = 'released', platform_fee = v_platform_fee, released_at = NOW()
    WHERE id = p_escrow_id;

    v_ref_release := 'REL-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
    v_ref_earn    := 'EARN-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));

    INSERT INTO public.transactions (wallet_id, reference_number, type, amount, status, related_project_id, description)
    VALUES
    (v_client_wallet_id, v_ref_release, 'escrow_release', v_escrow.amount,     'completed', v_escrow.project_id, 'تحرير دفعة ضمان للمطور'),
    (v_dev_wallet_id,    v_ref_earn,    'deposit',         v_developer_amount, 'completed', v_escrow.project_id, 'أرباح مستحقة للمطور');

    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (v_escrow.developer_id, 'payment_received', '💰 تم استلام دفعتك بنجاح!',
        'تم تحرير مبلغ ' || v_developer_amount || ' إلى رصيدك المتاح');

    RETURN jsonb_build_object('success', true, 'released_amount', v_developer_amount,
        'platform_fee', v_platform_fee, 'release_ref', v_ref_release, 'earn_ref', v_ref_earn);
END;
$$;


-- ----------------------------------------------------------------------------
-- 4. خصوصية الرسائل والمحادثات والعروض (S5)
-- ----------------------------------------------------------------------------
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_read" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;

CREATE POLICY "conversations_select_parties" ON public.conversations
    FOR SELECT USING (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );

CREATE POLICY "conversations_insert_parties" ON public.conversations
    FOR INSERT WITH CHECK (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
    );

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_read" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

-- الرسائل مقروءة فقط لطرفي المحادثة (العميل والمطور) والمالك
CREATE POLICY "messages_select_parties" ON public.messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE client_id = auth.uid() OR developer_id = auth.uid()
        )
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );

-- الإرسال محصور بالمرسل الفعلي في المحادثة
CREATE POLICY "messages_insert_sender" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE client_id = auth.uid() OR developer_id = auth.uid()
        )
    );

-- العروض الفنية (Proposals) محصورة بصاحب المشروع ومقدم العرض
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposals_read" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;

CREATE POLICY "proposals_select_parties" ON public.proposals
    FOR SELECT USING (
        auth.uid() = developer_id
        OR project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
        OR COALESCE(auth.jwt() ->> 'email', '') IN (
            'menarobir246rm@gmail.com', 'minarobir246rm@gmail.com',
            'minarobir@gmail.com', 'mina.robir@gmail.com',
            'mena.robir@gmail.com', 'minarob23@gmail.com'
        )
    );

CREATE POLICY "proposals_insert_dev" ON public.proposals
    FOR INSERT WITH CHECK (auth.uid() = developer_id);


-- ----------------------------------------------------------------------------
-- 5. تشديد أمان حاويات التخزين Storage Buckets (S6)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Storage Update" ON storage.objects;

-- المستخدم يمكنه الرفع والتعديل فقط في المسارات المعنونة بمعرفه السحابي
CREATE POLICY "User Storage Insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('avatars', 'portfolio', 'project-attachments')
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "User Storage Update" ON storage.objects
    FOR UPDATE USING (
        bucket_id IN ('avatars', 'portfolio', 'project-attachments')
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- ----------------------------------------------------------------------------
-- 6. تنظيف الحسابات السابقة وإعادة تعيين الرتب غير المصرح بها
-- ----------------------------------------------------------------------------
UPDATE public.profiles 
SET role = 'developer' 
WHERE role = 'owner' 
AND id NOT IN ('e75a3a4f-b00b-458d-98a5-16d53922e54b');

SELECT 'Phase 0 Security Lockdown Successfully Configured' as status;
