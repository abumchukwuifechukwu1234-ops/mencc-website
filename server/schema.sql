-- =========================================================
-- MENCC DATABASE SCHEMA
-- =========================================================

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    size_label VARCHAR(30) NOT NULL,
    description TEXT,
    price_kobo BIGINT NOT NULL CHECK (price_kobo >= 0),
    image_path VARCHAR(255),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,

    customer_id BIGINT REFERENCES customers(id),

    delivery_type VARCHAR(30) NOT NULL
        CHECK (delivery_type IN ('home', 'office', 'business', 'event')),

    city VARCHAR(100),
    area VARCHAR(100),
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,

    subtotal_kobo BIGINT NOT NULL CHECK (subtotal_kobo >= 0),
    delivery_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (delivery_fee_kobo >= 0),
    total_kobo BIGINT NOT NULL CHECK (total_kobo >= 0),

    order_status VARCHAR(30) NOT NULL DEFAULT 'RECEIVED'
        CHECK (
            order_status IN (
                'RECEIVED',
                'CONFIRMED',
                'PREPARING',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELLED'
            )
        ),

    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (
            payment_status IN (
                'PENDING',
                'PROCESSING',
                'PAID',
                'FAILED',
                'REFUNDED'
            )
        ),

    payment_method VARCHAR(30),
    payment_reference VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id BIGINT NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    product_id BIGINT NOT NULL
        REFERENCES products(id),

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    unit_price_kobo BIGINT NOT NULL CHECK (unit_price_kobo >= 0),

    line_total_kobo BIGINT NOT NULL CHECK (line_total_kobo >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id BIGINT NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(255),
    amount_kobo BIGINT NOT NULL CHECK (amount_kobo >= 0),

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'PAID',
                'FAILED',
                'REFUNDED'
            )
        ),

    raw_response JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- MENCC PRODUCTS
-- Prices stored in kobo:
-- ₦400  = 40000
-- ₦700  = 70000
-- ₦5,000 = 500000
-- =========================================================

INSERT INTO products
    (slug, name, size_label, description, price_kobo, image_path)
VALUES
    (
        '50cl',
        'MENCC 50cl',
        '50cl',
        'MENCC Premium Water — 50cl.',
        40000,
        'assets/08-50cl-cinematic-hero.jpg'
    ),
    (
        '75cl',
        'MENCC 75cl',
        '75cl',
        'MENCC Premium Water — 75cl.',
        70000,
        'assets/09-75cl-cinematic-hero.jpg'
    ),
    (
        '19l',
        'MENCC 19L',
        '19L',
        'MENCC Premium Water — 19L.',
        500000,
        'assets/07-19l-home-space.jpg'
    )
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_orders_customer_id
    ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_order_number
    ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_orders_order_status
    ON orders(order_status);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON payments(order_id);