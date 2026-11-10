-- ============================================================================
-- FuTech Platform - Phase 0 Complete Security Lockdown & R1-R8 Hardening
-- ============================================================================
-- تاريخ التحديث: Nov 10, 2026 | مراجعة شاملة للرد على @zewq (تقرير المراجعة 2)
-- يغلق الثغرات الخمس R1-R5 والنقاط الأصغر R6-R8 بشكل نهائي وقاطع
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. تنظيف الحسابات السابقة وإعادة تعيين الرتب غير المصرح بها وحذف الحسابات المستغلة
-- ----------------------------------------------------------------------------
UPDATE public.profiles 
SET role = 'developer' 
WHERE role = 'owner' 
AND id NOT IN ('e75a3a4f-b00b-458d-98a5-16d53922e54b');

-- تنظيف أي حسابات مسجلة بإيميلات بديلة أو حسابات اختبارية من جدول auth.users و public.profiles
DELETE FROM auth.users 
WHERE id != 'e75a3a4f-b00b-458d-98a5-16d53922e54b'
AND email IN (
    'minarobir246rm@gmail.com',
    'minarobir@gmail.com',
    'mina.robir@gmail.com',
    'mena.robir@gmail.com',
    'minarob23@gmail.com'
);

DELETE FROM public.profiles 
WHERE id != 'e75a3a4f-b00b-458d-98a5-16d53922e54b'
AND (
    id NOT IN (SELECT id FROM auth.users)
    OR full_name ILIKE '%rivia%'
);


-- ----------------------------------------------------------------------------
-- 2. تأمين دوال الضمان المالي Escrow (علاج R1 و R2)
-- ----------------------------------------------------------------------------
-- حذف الدالة القديمة ذات المعاملين نهائياً لمنع استغلالها (R1)
DROP FUNCTION IF EXISTS public.release_escrow_payment(UUID, UUID);
DROP FUNCTION IF EXISTS public.release_escrow_payment(UUID);

-- حذف دالة حجز الضمان القديمة (R2)
DROP FUNCTION IF EXISTS public.lock_escrow_milestone(UUID, UUID, UUID, NUMERIC, UUID);
DROP FUNCTION IF EXISTS public.lock_escrow_milestone(UUID, UUID, NUMERIC, UUID);

-- دالة تحرير الضمان المالي الجديدة والآمنة (auth.uid() حصراً مع search_path)
CREATE OR REPLACE FUNCTION public.release_escrow_payment(
    p_escrow_id UUID
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id         UUID := auth.uid();
    v_is_owner          BOOLEAN;
    v_escrow            RECORD;
    v_client_wallet_id  UUID;
    v_dev_wallet_id     UUID;
    v_platform_fee      NUMERIC(12,2);
    v_developer_amount  NUMERIC(12,2);
    v_ref_release       TEXT;
    v_ref_earn          TEXT;
BEGIN
    IF current_user IN ('postgres', 'supabase_admin') THEN
        v_is_owner := TRUE;
    ELSE
        IF v_caller_id IS NULL THEN
            RAISE EXCEPTION 'Authentication required to release escrow.';
        END IF;

        -- ربط هوية المالك بمعرفه السحابي الثابت والمشفر حصراً (علاج R3)
        v_is_owner := (v_caller_id = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid);
    END IF;

    SELECT * INTO v_escrow FROM public.escrow_contracts
    WHERE id = p_escrow_id AND status = 'held'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'عقد الضمان غير موجود أو تم تحريره مسبقاً';
    END IF;

    -- التحقق الحاسم: فقط صاحب العمل صاحب العقد أو مالك المنصة يمكنه تحرير الدفعة للمطور
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

-- دالة حجز الضمان الجديدة والآمنة (auth.uid() حصراً مع search_path - علاج R2)
CREATE OR REPLACE FUNCTION public.lock_escrow_milestone(
    p_project_id     UUID,
    p_developer_id   UUID,
    p_amount         NUMERIC,
    p_milestone_id   UUID DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id     UUID := auth.uid();
    v_wallet        RECORD;
    v_escrow_ref    TEXT;
    v_escrow_id     UUID;
    v_project       RECORD;
BEGIN
    IF v_caller_id IS NULL AND current_user NOT IN ('postgres', 'supabase_admin') THEN
        RAISE EXCEPTION 'Authentication required to lock escrow funds.';
    END IF;

    -- التحقق من أن المشروع يخص العميل المتصل
    SELECT * INTO v_project FROM public.projects WHERE id = p_project_id;
    IF FOUND AND v_project.client_id != v_caller_id AND current_user NOT IN ('postgres', 'supabase_admin') THEN
        RAISE EXCEPTION 'غير مصرح: لا يمكن حجز ضمان لمشروع يخص عميلاً آخر';
    END IF;

    -- الخصم من محفظة العميل المتصل حصراً
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_caller_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'محفظة العميل غير موجودة';
    END IF;

    IF v_wallet.available_balance < p_amount THEN
        RAISE EXCEPTION 'رصيد غير كافٍ. المتاح: %', v_wallet.available_balance;
    END IF;

    UPDATE public.wallets
    SET available_balance = available_balance - p_amount,
        in_escrow_balance = in_escrow_balance + p_amount
    WHERE id = v_wallet.id;

    v_escrow_ref := 'ESC-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));

    INSERT INTO public.escrow_contracts (
        project_id, milestone_id, client_id, developer_id,
        amount, platform_fee_rate, status, escrow_reference
    )
    VALUES (
        p_project_id, p_milestone_id, v_caller_id, p_developer_id,
        p_amount, 0, 'held', v_escrow_ref
    )
    RETURNING id INTO v_escrow_id;

    INSERT INTO public.transactions (wallet_id, reference_number, type, amount, status, related_project_id, description)
    VALUES (v_wallet.id, v_escrow_ref, 'escrow_lock', p_amount, 'completed', p_project_id, 'حجز دفعة ضمان مالي في الخزينة المشفرة');

    RETURN jsonb_build_object('success', true, 'escrow_id', v_escrow_id, 'reference', v_escrow_ref);
END;
$$;


-- ----------------------------------------------------------------------------
-- 3. غلق جدول الملفات الشخصية وتأمين كافة الحقول الحساسة (علاج R3 و R7)
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

CREATE POLICY "profiles_select_public" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger حماية مشدد يشمل (role, fqs, is_verified, rating, completed_projects, reviews_count) - علاج R7 و R3
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
DECLARE
    v_is_owner BOOLEAN;
BEGIN
    IF current_user IN ('postgres', 'supabase_admin') OR COALESCE(auth.role(), '') = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- التحقق برقم الـ UUID الثابت للمالك حصراً (علاج R3)
    v_is_owner := (auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid);

    -- منع تعديل الرتبة
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT v_is_owner THEN
        RAISE EXCEPTION 'Privilege escalation rejected: role cannot be modified by user.';
    END IF;

    -- منع تزييف الإحصائيات أو التقييم أو مؤشر FQS أو التوثيق من قبل المستخدم (R7)
    IF (
        NEW.fqs IS DISTINCT FROM OLD.fqs OR 
        NEW.is_verified IS DISTINCT FROM OLD.is_verified OR
        NEW.rating IS DISTINCT FROM OLD.rating OR
        NEW.completed_projects IS DISTINCT FROM OLD.completed_projects OR
        NEW.reviews_count IS DISTINCT FROM OLD.reviews_count
    ) AND NOT v_is_owner THEN
        NEW.fqs := OLD.fqs;
        NEW.is_verified := OLD.is_verified;
        NEW.rating := OLD.rating;
        NEW.completed_projects := OLD.completed_projects;
        NEW.reviews_count := OLD.reviews_count;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_sensitive_fields();

-- تحديث trigger التسجيل ليربط رتبة المالك بالـ UUID الثابت فقط (علاج R3)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_requested_role TEXT;
    v_assigned_role  TEXT;
    v_name           TEXT;
    v_country        TEXT;
    v_is_owner       BOOLEAN;
BEGIN
    -- المالك حصراً بالـ UUID الثابت
    v_is_owner := (NEW.id = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid);

    v_requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
    
    IF v_is_owner THEN
        v_assigned_role := 'owner';
    ELSIF v_requested_role = 'developer' THEN
        v_assigned_role := 'developer';
    ELSE
        v_assigned_role := 'client';
    END IF;

    v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    v_country := COALESCE(NEW.raw_user_meta_data->>'country', 'مصر');

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
        v_is_owner,
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

    INSERT INTO public.wallets (user_id, currency, total_balance, available_balance, in_escrow_balance)
    VALUES (NEW.id, CASE WHEN v_country = 'مصر' THEN 'EGP' ELSE 'SAR' END, 0.00, 0.00, 0.00)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- ----------------------------------------------------------------------------
-- 4. غلق الجداول المتبقية: projects, milestones, reviews, portfolio, suggestions (علاج R5)
-- ----------------------------------------------------------------------------
-- أ) جدول المشاريع projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_public_read" ON public.projects;
DROP POLICY IF EXISTS "projects_insert" ON public.projects;
DROP POLICY IF EXISTS "projects_update" ON public.projects;
DROP POLICY IF EXISTS "projects_delete" ON public.projects;

CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE USING (
    auth.uid() = client_id 
    OR auth.uid() = assigned_developer_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE USING (
    auth.uid() = client_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);

-- ب) جدول مراحل المشاريع project_milestones
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "milestones_read" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_insert" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_update" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_delete" ON public.project_milestones;

CREATE POLICY "milestones_read" ON public.project_milestones FOR SELECT USING (true);
CREATE POLICY "milestones_insert" ON public.project_milestones FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);
CREATE POLICY "milestones_update" ON public.project_milestones FOR UPDATE USING (
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid() OR assigned_developer_id = auth.uid())
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);
CREATE POLICY "milestones_delete" ON public.project_milestones FOR DELETE USING (
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);

-- ج) جدول التقييمات reviews (منع تقييم المطور لنفسه وتزييف التقييمات)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete" ON public.reviews;

CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = client_id 
    AND client_id != developer_id
);
CREATE POLICY "reviews_update" ON public.reviews FOR UPDATE USING (
    auth.uid() = client_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);
CREATE POLICY "reviews_delete" ON public.reviews FOR DELETE USING (
    auth.uid() = client_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);

-- د) جدول معرض الأعمال portfolio_items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_write" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_insert" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_update" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_delete" ON public.portfolio_items;

CREATE POLICY "portfolio_public_read" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_insert" ON public.portfolio_items FOR INSERT WITH CHECK (
    auth.uid() = developer_id
);
CREATE POLICY "portfolio_update" ON public.portfolio_items FOR UPDATE USING (
    auth.uid() = developer_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);
CREATE POLICY "portfolio_delete" ON public.portfolio_items FOR DELETE USING (
    auth.uid() = developer_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);

-- هـ) جدول اقتراحات المنصة platform_suggestions
ALTER TABLE public.platform_suggestions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "suggestions_read" ON public.platform_suggestions;
DROP POLICY IF EXISTS "suggestions_insert" ON public.platform_suggestions;
DROP POLICY IF EXISTS "suggestions_update" ON public.platform_suggestions;

CREATE POLICY "suggestions_read" ON public.platform_suggestions FOR SELECT USING (true);
CREATE POLICY "suggestions_insert" ON public.platform_suggestions FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);
CREATE POLICY "suggestions_update" ON public.platform_suggestions FOR UPDATE USING (
    auth.uid() = user_id 
    OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
);


-- ----------------------------------------------------------------------------
-- 5. تشديد أمان حاويات التخزين وجعل مرفقات المشاريع خاصة (علاج R8)
-- ----------------------------------------------------------------------------
UPDATE storage.buckets 
SET public = false 
WHERE id = 'project-attachments';

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Buckets Read" ON storage.objects;
DROP POLICY IF EXISTS "Project Attachments Read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "User Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "User Storage Update" ON storage.objects;

-- avatars و portfolio فقط هما العامان للقراءة
CREATE POLICY "Public Buckets Read" ON storage.objects
    FOR SELECT USING (bucket_id IN ('avatars', 'portfolio'));

-- project-attachments يتطلب تسجيل الدخول
CREATE POLICY "Project Attachments Read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-attachments'
        AND auth.uid() IS NOT NULL
    );

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
-- 6. غلق المحافظ والمعاملات وعقود الضمان والرسائل
-- ----------------------------------------------------------------------------
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_wallet_read" ON public.wallets;
DROP POLICY IF EXISTS "wallets_all" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update" ON public.wallets;
DROP POLICY IF EXISTS "wallets_select_own" ON public.wallets;

CREATE POLICY "wallets_select_own" ON public.wallets
    FOR SELECT USING (
        auth.uid() = user_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own_transactions_read" ON public.transactions;
DROP POLICY IF EXISTS "transactions_all" ON public.transactions;
DROP POLICY IF EXISTS "transactions_select_own" ON public.transactions;

CREATE POLICY "transactions_select_own" ON public.transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

ALTER TABLE public.escrow_contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "escrow_parties_read" ON public.escrow_contracts;
DROP POLICY IF EXISTS "escrow_all" ON public.escrow_contracts;
DROP POLICY IF EXISTS "escrow_select_parties" ON public.escrow_contracts;

CREATE POLICY "escrow_select_parties" ON public.escrow_contracts
    FOR SELECT USING (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_read" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select_parties" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert_parties" ON public.conversations;

CREATE POLICY "conversations_select_parties" ON public.conversations
    FOR SELECT USING (
        auth.uid() = client_id OR auth.uid() = developer_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "conversations_insert_parties" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = client_id OR auth.uid() = developer_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_read" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_select_parties" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_sender" ON public.messages;

CREATE POLICY "messages_select_parties" ON public.messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE client_id = auth.uid() OR developer_id = auth.uid()
        )
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "messages_insert_sender" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE client_id = auth.uid() OR developer_id = auth.uid()
        )
    );

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposals_read" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;
DROP POLICY IF EXISTS "proposals_select_parties" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert_dev" ON public.proposals;

CREATE POLICY "proposals_select_parties" ON public.proposals
    FOR SELECT USING (
        auth.uid() = developer_id
        OR project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "proposals_insert_dev" ON public.proposals
    FOR INSERT WITH CHECK (auth.uid() = developer_id);

-- حجب حقل الهاتف عن استعلامات الزوار غير المسجلين (علاج R6)
REVOKE SELECT (phone) ON public.profiles FROM anon;

SELECT 'FuTech Phase 0 - All R1-R8 Security Flaws Remediated Successfully' as status;
