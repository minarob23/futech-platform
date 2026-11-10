-- ============================================================
-- FuTech Platform - Supabase PostgreSQL Schema (المخطط الكامل والمحدث)
-- الإصدار: 2.3.0 | متوافق مع المنصة العربية لهندسة البرمجيات
-- ============================================================
-- كيفية التشغيل:
--   1. افتح لوحة تحكم Supabase ← SQL Editor
--   2. انسخ هذا الملف كاملاً والصقه
--   3. اضغط "Run" — سيتم إنشاء وترقية جميع الجداول والسياسات تلقائياً
--
-- ⚡ تنبيه هام لمنع أخطاء تقييد البريد (Email Rate Limit 429):
--   من لوحة تحكم Supabase ← Authentication ← Providers ← Email:
--   اجعل خيار "Confirm email" معطلاً (OFF).
--   هذا يتيح تسجيل وإنشاء الحسابات وتفعيلها فوراً دون انتظار رسائل التحقق أو استهلاك حصة الـ SMTP.
-- ============================================================


-- ============================================================
-- 0. الامتدادات المطلوبة
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. جدول الملفات الشخصية (Profiles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role                VARCHAR(20)  NOT NULL DEFAULT 'client'
                            CHECK (role IN ('client', 'developer', 'admin', 'owner', 'auditor')),
    full_name           TEXT         NOT NULL DEFAULT '',
    avatar_url          TEXT,
    bio                 TEXT,
    country             VARCHAR(50)  DEFAULT 'مصر',
    phone               VARCHAR(30),
    github_url          TEXT,
    skills              TEXT[],
    -- حقول المطورين
    specialty           TEXT,
    category            VARCHAR(50),
    hourly_rate         NUMERIC(10,2) DEFAULT 200.00,
    rating              NUMERIC(3,2) DEFAULT 0.0 CHECK (rating BETWEEN 0 AND 5),
    reviews_count       INT          DEFAULT 0,
    completed_projects  INT          DEFAULT 0,
    fqs                 INT          DEFAULT 0 CHECK (fqs BETWEEN 0 AND 100),
    fqs_breakdown       JSONB        DEFAULT '{}'::jsonb,
    is_verified         BOOLEAN      DEFAULT FALSE,
    is_available        BOOLEAN      DEFAULT TRUE,
    -- حقول العملاء
    company_name        TEXT,
    -- حقول مشتركة
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW()
);

-- ترقية الأعمدة والقيود في حال كان الجدول منشأ مسبقاً
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('client', 'developer', 'admin', 'owner', 'auditor'));

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'fqs') THEN
        ALTER TABLE public.profiles ADD COLUMN fqs INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'completed_projects') THEN
        ALTER TABLE public.profiles ADD COLUMN completed_projects INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'fqs_breakdown') THEN
        ALTER TABLE public.profiles ADD COLUMN fqs_breakdown JSONB DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'github_url') THEN
        ALTER TABLE public.profiles ADD COLUMN github_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE public.profiles ADD COLUMN skills TEXT[];
    END IF;
END $$;

-- تحديث تلقائي لـ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- تريجر إنشاء Profile ومحفظة تلقائياً عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_requested_role TEXT;
    v_assigned_role  TEXT;
    v_name           TEXT;
    v_country        TEXT;
    v_is_owner       BOOLEAN;
BEGIN
    -- ربط رتبة المالك بالـ UUID السحابي الثابت حصراً
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
        0.0,
        0,
        0,
        CASE WHEN v_is_owner THEN 1750.00 ELSE 200.00 END
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

    INSERT INTO public.wallets (user_id, currency, total_balance, available_balance, in_escrow_balance)
    VALUES (NEW.id, CASE WHEN v_country = 'السعودية' THEN 'SAR' ELSE 'EGP' END, 0.00, 0.00, 0.00)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger حماية مشدد لمنع تصعيد الرتب وتزييف الإحصائيات
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
DECLARE
    v_is_owner BOOLEAN;
BEGIN
    IF current_user IN ('postgres', 'supabase_admin') OR COALESCE(auth.role(), '') = 'service_role' THEN
        RETURN NEW;
    END IF;

    v_is_owner := (auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid);

    -- منع تعديل الرتبة
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT v_is_owner THEN
        RAISE EXCEPTION 'Privilege escalation rejected: role cannot be modified by user.';
    END IF;

    -- منع تزييف التقييمات والإحصائيات
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
    EXECUTE FUNCTION public.protect_profile_sensitive_fields();-- ============================================================
-- 2. جدول المشاريع (Projects)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_developer_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title                   TEXT NOT NULL,
    description             TEXT,
    category                VARCHAR(50),
    budget                  NUMERIC(12,2) NOT NULL CHECK (budget > 0),
    currency                VARCHAR(10) DEFAULT 'SAR',
    status                  VARCHAR(30) DEFAULT 'open'
                                CHECK (status IN ('open','in_progress','review','completed','disputed','cancelled')),
    escrow_status           VARCHAR(30) DEFAULT 'unfunded'
                                CHECK (escrow_status IN ('unfunded','funded_in_escrow','partially_released','released','refunded')),
    deadline                TEXT,
    milestones              TEXT[],
    git_repo_url            TEXT,
    docker_file_url         TEXT,
    security_scan_passed    BOOLEAN DEFAULT FALSE,
    tags                    TEXT[],
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'milestones') THEN
        ALTER TABLE public.projects ADD COLUMN milestones TEXT[];
    END IF;
END $$;

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================
-- 3. جدول المراحل المالية للمشروع (Project Milestones)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id              UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title                   TEXT NOT NULL,
    description             TEXT,
    amount                  NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    status                  VARCHAR(30) DEFAULT 'pending'
                                CHECK (status IN ('pending','in_escrow','submitted','released','disputed','refunded')),
    order_index             INT DEFAULT 1,
    deliverables_url        TEXT,
    submitted_at            TIMESTAMPTZ,
    released_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 4. جدول المحافظ المالية (Wallets)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wallets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    currency            VARCHAR(10) DEFAULT 'SAR',
    total_balance       NUMERIC(12,2) DEFAULT 0.00 CHECK (total_balance >= 0),
    in_escrow_balance   NUMERIC(12,2) DEFAULT 0.00 CHECK (in_escrow_balance >= 0),
    available_balance   NUMERIC(12,2) DEFAULT 0.00 CHECK (available_balance >= 0),
    lifetime_earned     NUMERIC(12,2) DEFAULT 0.00,
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS wallets_updated_at ON public.wallets;
CREATE TRIGGER wallets_updated_at
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_profile_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.wallets (user_id, currency)
    VALUES (NEW.id, CASE WHEN NEW.country = 'مصر' THEN 'EGP' ELSE 'SAR' END)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_create_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_create_wallet
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();


-- ============================================================
-- 5. جدول المعاملات المالية (Transactions Ledger)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id           UUID NOT NULL REFERENCES public.wallets(id) ON DELETE RESTRICT,
    reference_number    VARCHAR(80) UNIQUE NOT NULL,
    type                VARCHAR(30) NOT NULL
                            CHECK (type IN ('deposit','escrow_lock','escrow_release','withdrawal','platform_fee','refund')),
    amount              NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    vat_amount          NUMERIC(12,2) DEFAULT 0.00,
    status              VARCHAR(20) DEFAULT 'completed'
                            CHECK (status IN ('pending','completed','failed','under_review')),
    gateway             VARCHAR(50),
    gateway_reference   TEXT,
    related_project_id  UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    description         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON public.transactions(wallet_id, created_at DESC);


-- ============================================================
-- 6. جدول عقود الضمان المالي (Escrow Contracts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.escrow_contracts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number    VARCHAR(80) UNIQUE NOT NULL DEFAULT 'ESC-' || UPPER(SUBSTRING(gen_random_uuid()::text,1,8)),
    project_id          UUID NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
    milestone_id        UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
    client_id           UUID NOT NULL REFERENCES public.profiles(id),
    developer_id        UUID NOT NULL REFERENCES public.profiles(id),
    amount              NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    platform_fee        NUMERIC(12,2) DEFAULT 0.00,
    platform_fee_rate   NUMERIC(5,2)  DEFAULT 5.00,
    status              VARCHAR(30) DEFAULT 'held'
                            CHECK (status IN ('held','released','refunded','disputed')),
    locked_at           TIMESTAMPTZ DEFAULT NOW(),
    released_at         TIMESTAMPTZ
);


-- ============================================================
-- 7. جدول الفواتير الضريبية الإلكترونية (ZATCA e-Invoices)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.zatca_invoices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number      VARCHAR(50) UNIQUE NOT NULL,
    transaction_id      UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    escrow_id           UUID REFERENCES public.escrow_contracts(id) ON DELETE SET NULL,
    seller_name         TEXT NOT NULL DEFAULT 'شركة تقنيات المستقبل البرمجية المحدودة (FuTech Platform)',
    seller_vat_id       VARCHAR(50) NOT NULL DEFAULT '310984729100003',
    buyer_name          TEXT NOT NULL,
    buyer_vat_id        VARCHAR(50),
    subtotal            NUMERIC(12,2) NOT NULL,
    vat_rate            NUMERIC(5,2) DEFAULT 15.00,
    vat_amount          NUMERIC(12,2) NOT NULL,
    grand_total         NUMERIC(12,2) NOT NULL,
    qr_code_payload     TEXT NOT NULL,
    zatca_uuid          UUID DEFAULT gen_random_uuid(),
    is_simplified       BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 8. جدول طلبات سحب الأرباح (Payout Requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    method          VARCHAR(30) NOT NULL
                        CHECK (method IN ('sarie_iban','instapay','stcpay','vodafone_cash')),
    account_details JSONB NOT NULL,
    status          VARCHAR(30) DEFAULT 'pending'
                        CHECK (status IN ('pending','processing','completed','rejected')),
    rejection_note  TEXT,
    processed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 9. جدول التقييمات والمراجعات (Reviews)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    reviewer_id     UUID NOT NULL REFERENCES public.profiles(id),
    developer_id    UUID NOT NULL REFERENCES public.profiles(id),
    rating          NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    tags            TEXT[],
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.update_developer_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.profiles
    SET
        rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE developer_id = NEW.developer_id),
        reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE developer_id = NEW.developer_id)
    WHERE id = NEW.developer_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_review_update_rating ON public.reviews;
CREATE TRIGGER on_review_update_rating
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_developer_rating();


-- ============================================================
-- 10. جدول المحادثات والرسائل (Chat & Messaging)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES public.profiles(id),
    developer_id    UUID NOT NULL REFERENCES public.profiles(id),
    last_message    TEXT,
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, client_id, developer_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES public.profiles(id),
    content         TEXT NOT NULL,
    type            VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text','file','image','system')),
    file_url        TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);


-- ============================================================
-- 11. جدول التقديمات على المشاريع (Proposals)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proposals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    developer_id    UUID NOT NULL REFERENCES public.profiles(id),
    cover_letter    TEXT,
    proposed_budget NUMERIC(12,2),
    proposed_days   INT,
    status          VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending','accepted','rejected','withdrawn')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, developer_id)
);


-- ============================================================
-- 12. جدول معرض الأعمال (Portfolio Items)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    category        VARCHAR(50),
    tech_stack      TEXT[],
    image_url       TEXT,
    video_url       TEXT,
    live_url        TEXT,
    github_url      TEXT,
    is_featured     BOOLEAN DEFAULT FALSE,
    views_count     INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 13. جدول الإشعارات (Notifications)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT,
    link        TEXT,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);


-- ============================================================
-- 14. جدول مقترحات تطوير المنصة (Platform Suggestions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platform_suggestions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name     TEXT NOT NULL DEFAULT 'مستخدم مبدع',
    author_role     TEXT DEFAULT 'عضو المنصة',
    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(50) NOT NULL DEFAULT 'ميزة برمجية',
    status          VARCHAR(30) NOT NULL DEFAULT 'قيد الدراسة'
                        CHECK (status IN ('قيد الدراسة', 'مجدول للتطوير', 'قيد التنفيذ', 'تم الإطلاق')),
    upvotes         INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================

-- ============================================================
-- 15. الإجراءات المخزنة الآمنة للضمان المالي (Escrow Functions)
-- ============================================================

DROP FUNCTION IF EXISTS public.release_escrow_payment(UUID, UUID);
DROP FUNCTION IF EXISTS public.release_escrow_payment(UUID);
DROP FUNCTION IF EXISTS public.lock_escrow_milestone(UUID, UUID, UUID, NUMERIC, UUID);
DROP FUNCTION IF EXISTS public.lock_escrow_milestone(UUID, UUID, NUMERIC, UUID);

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
        v_is_owner := (v_caller_id = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid);
    END IF;

    SELECT * INTO v_escrow FROM public.escrow_contracts
    WHERE id = p_escrow_id AND status = 'held'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'عقد الضمان غير موجود أو تم تحريره مسبقاً';
    END IF;

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
BEGIN
    IF current_user NOT IN ('postgres', 'supabase_admin') THEN
        IF v_caller_id IS NULL THEN
            RAISE EXCEPTION 'Authentication required to lock escrow.';
        END IF;
    END IF;

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

-- ============================================================
-- 16. سياسات الأمان الشاملة والمشددة (Hardened Row Level Security)
-- ============================================================

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_contracts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_suggestions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "profiles_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
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

-- حماية خصوصية أرقام الهواتف من الزوار غير المسجلين
REVOKE SELECT (phone) ON public.profiles FROM anon;

-- 2. Projects
DROP POLICY IF EXISTS "projects_public_read" ON public.projects;
DROP POLICY IF EXISTS "projects_insert" ON public.projects;
DROP POLICY IF EXISTS "projects_update" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_authenticated" ON public.projects;
DROP POLICY IF EXISTS "projects_update_parties" ON public.projects;

CREATE POLICY "projects_public_read" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "projects_insert_authenticated" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = client_id);

CREATE POLICY "projects_update_parties" ON public.projects
    FOR UPDATE USING (
        auth.uid() = client_id 
        OR auth.uid() = assigned_developer_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 3. Milestones
DROP POLICY IF EXISTS "milestones_read" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_insert" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_update" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_insert_client" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones_update_parties" ON public.project_milestones;

CREATE POLICY "milestones_read" ON public.project_milestones
    FOR SELECT USING (true);

CREATE POLICY "milestones_insert_client" ON public.project_milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND client_id = auth.uid()
        )
    );

CREATE POLICY "milestones_update_parties" ON public.project_milestones
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id 
            AND (client_id = auth.uid() OR assigned_developer_id = auth.uid())
        )
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 4. Wallets
DROP POLICY IF EXISTS "own_wallet_read" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_read_owner" ON public.wallets;

CREATE POLICY "wallets_read_owner" ON public.wallets
    FOR SELECT USING (
        auth.uid() = user_id 
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 5. Transactions
DROP POLICY IF EXISTS "own_transactions_read" ON public.transactions;
DROP POLICY IF EXISTS "transactions_read_owner" ON public.transactions;

CREATE POLICY "transactions_read_owner" ON public.transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 6. Escrow Contracts
DROP POLICY IF EXISTS "escrow_parties_read" ON public.escrow_contracts;
DROP POLICY IF EXISTS "escrow_read_parties" ON public.escrow_contracts;

CREATE POLICY "escrow_read_parties" ON public.escrow_contracts
    FOR SELECT USING (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 7. Conversations
DROP POLICY IF EXISTS "conversations_parties" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;

CREATE POLICY "conversations_select" ON public.conversations
    FOR SELECT USING (
        auth.uid() = client_id 
        OR auth.uid() = developer_id
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "conversations_insert" ON public.conversations
    FOR INSERT WITH CHECK (
        auth.uid() = client_id OR auth.uid() = developer_id
    );

-- 8. Messages
DROP POLICY IF EXISTS "messages_read" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_select_parties" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_sender" ON public.messages;

CREATE POLICY "messages_select_parties" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id 
            AND (c.client_id = auth.uid() OR c.developer_id = auth.uid())
        )
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "messages_insert_sender" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id 
        AND EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id 
            AND (c.client_id = auth.uid() OR c.developer_id = auth.uid())
        )
    );

-- 9. Proposals
DROP POLICY IF EXISTS "proposals_read" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;
DROP POLICY IF EXISTS "proposals_update" ON public.proposals;
DROP POLICY IF EXISTS "proposals_select_parties" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert_dev" ON public.proposals;
DROP POLICY IF EXISTS "proposals_update_parties" ON public.proposals;

CREATE POLICY "proposals_select_parties" ON public.proposals
    FOR SELECT USING (
        auth.uid() = developer_id
        OR auth.uid() = (SELECT client_id FROM public.projects WHERE id = project_id)
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

CREATE POLICY "proposals_insert_dev" ON public.proposals
    FOR INSERT WITH CHECK (
        auth.uid() = developer_id
    );

CREATE POLICY "proposals_update_parties" ON public.proposals
    FOR UPDATE USING (
        auth.uid() = developer_id
        OR auth.uid() = (SELECT client_id FROM public.projects WHERE id = project_id)
        OR auth.uid() = 'e75a3a4f-b00b-458d-98a5-16d53922e54b'::uuid
    );

-- 10. Portfolio Items
DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_manage_own" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_items_read" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_items_insert" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_items_update" ON public.portfolio_items;
DROP POLICY IF EXISTS "portfolio_items_delete" ON public.portfolio_items;

CREATE POLICY "portfolio_items_read" ON public.portfolio_items
    FOR SELECT USING (true);

CREATE POLICY "portfolio_items_insert" ON public.portfolio_items
    FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "portfolio_items_update" ON public.portfolio_items
    FOR UPDATE USING (auth.uid() = developer_id);

CREATE POLICY "portfolio_items_delete" ON public.portfolio_items
    FOR DELETE USING (auth.uid() = developer_id);

-- 11. Notifications
DROP POLICY IF EXISTS "own_notifications_read" ON public.notifications;
DROP POLICY IF EXISTS "notifications_read_own" ON public.notifications;

CREATE POLICY "notifications_read_own" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- 12. Reviews
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_client" ON public.reviews;

CREATE POLICY "reviews_public_read" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "reviews_insert_client" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND auth.uid() = client_id 
        AND client_id != developer_id
    );

-- 13. Platform Suggestions
DROP POLICY IF EXISTS "suggestions_public_read" ON public.platform_suggestions;
DROP POLICY IF EXISTS "suggestions_insert_auth" ON public.platform_suggestions;

CREATE POLICY "suggestions_public_read" ON public.platform_suggestions
    FOR SELECT USING (true);

CREATE POLICY "suggestions_insert_auth" ON public.platform_suggestions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 17. تهيئة حساب المالك ومطور المنصة: مينا روبير مجدى فوزى
-- ============================================================
INSERT INTO public.profiles (
    id, full_name, role, specialty, category, country, hourly_rate, 
    rating, reviews_count, completed_projects, fqs, is_verified, is_available, bio
)
VALUES (
    'e75a3a4f-b00b-458d-98a5-16d53922e54b',
    'مينا روبير مجدى فوزى',
    'owner',
    'مهندس برمجيات وتطوير شامل',
    'fullstack',
    'مصر',
    1750.00,
    5.0,
    18,
    15,
    100,
    TRUE,
    TRUE,
    'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = 'owner',
    country = 'مصر',
    hourly_rate = 1750.00,
    specialty = EXCLUDED.specialty,
    bio = EXCLUDED.bio;

INSERT INTO public.wallets (user_id, currency, total_balance, available_balance, in_escrow_balance)
VALUES ('e75a3a4f-b00b-458d-98a5-16d53922e54b', 'EGP', 0.00, 0.00, 0.00)
ON CONFLICT (user_id) DO UPDATE SET currency = 'EGP';

-- ============================================================
-- انتهى المخطط الأمني الموحد والمحصن بنجاح ✅ - FuTech Phase 0
-- ============================================================
