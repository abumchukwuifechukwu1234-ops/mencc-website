require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());

/* =========================================================
   DATABASE
   ========================================================= */

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


/* =========================================================
   HELPERS
   ========================================================= */

function generateOrderNumber() {
    const date = new Date();

    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let suffix = "";

    for (let i = 0; i < 5; i++) {
        suffix += characters[
            crypto.randomInt(0, characters.length)
        ];
    }

    return `MENCC-${year}${month}${day}-${suffix}`;
}


function normalizePhone(phone) {
    return String(phone || "").trim();
}


function normalizeEmail(email) {
    const value = String(email || "").trim();

    return value === "" ? null : value;
}


function normalizeText(value) {
    return String(value || "").trim();
}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS database_time"
        );

        res.json({
            success: true,
            message: "MENCC backend and database are connected.",
            databaseTime: result.rows[0].database_time
        });

    } catch (error) {
        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "MENCC backend is running, but database connection failed."
        });
    }
});


/* =========================================================
   CREATE ORDER
   ========================================================= */

app.post("/api/orders", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            customer,
            delivery,
            items
        } = req.body;


        /* -----------------------------------------------------
           BASIC VALIDATION
           ----------------------------------------------------- */

        if (!customer || typeof customer !== "object") {
            return res.status(400).json({
                success: false,
                message: "Customer details are required."
            });
        }


        if (!delivery || typeof delivery !== "object") {
            return res.status(400).json({
                success: false,
                message: "Delivery details are required."
            });
        }


        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product is required."
            });
        }


        const fullName =
            normalizeText(customer.fullName);

        const phone =
            normalizePhone(customer.phone);

        const email =
            normalizeEmail(customer.email);


        const deliveryType =
            normalizeText(delivery.type).toLowerCase();

        const area =
            normalizeText(delivery.area);

        const city =
            normalizeText(delivery.city);

        const address =
            normalizeText(delivery.address);

        const notes =
            normalizeText(delivery.notes);


        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name is required."
            });
        }


        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });
        }


        const allowedDeliveryTypes = [
            "home",
            "office",
            "business",
            "event"
        ];


        if (!allowedDeliveryTypes.includes(deliveryType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery type."
            });
        }


        if (!area) {
            return res.status(400).json({
                success: false,
                message: "Delivery area is required."
            });
        }


        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Delivery address is required."
            });
        }
       const allowedDeliveryTypes = [
  "home",
  "office",
  "business",
  "event"
];

if (!allowedDeliveryTypes.includes(deliveryType)) {
  return res.status(400).json({
    success: false,
    message:
      "Delivery type must be home, office, business, or event."
  });
}

        /* -----------------------------------------------------
           CLEAN PRODUCT ITEMS
           ----------------------------------------------------- */

        const requestedItems = items.map((item) => {

            const slug =
                normalizeText(item.slug).toLowerCase();

            const quantity =
                Number(item.quantity);

            return {
                slug,
                quantity
            };

        });


        for (const item of requestedItems) {

            if (!item.slug) {
                return res.status(400).json({
                    success: false,
                    message: "Every order item needs a product."
                });
            }


            if (
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Product quantities must be positive whole numbers."
                });
            }

        }
        /* -----------------------------------------------------
   GET PRODUCTS FROM DATABASE
----------------------------------------------------- */

const requestedSlugs = requestedItems.map(
    (item) => item.slug
);

const productsResult = await client.query(
    `
        SELECT
            id,
            slug,
            name,
            size_label,
            price_kobo
        FROM products
        WHERE slug = ANY($1::text[])
        AND is_available = true
    `,
    [requestedSlugs]
);

const products = productsResult.rows;
/* -----------------------------------------------------
   VERIFY REQUESTED PRODUCTS EXIST
----------------------------------------------------- */

if (products.length !== requestedItems.length) {
    throw new Error(
        "One or more requested products are unavailable."
    );
}
/* -----------------------------------------------------
   CREATE PRODUCT LOOKUP MAP
----------------------------------------------------- */

const productMap = new Map(
    products.map((product) => [
        product.slug,
        product
    ])
);
/* -----------------------------------------------------
   CALCULATE REAL ORDER TOTALS
----------------------------------------------------- */

let subtotalKobo = 0;

const calculatedItems = requestedItems.map((item) => {

    const product = productMap.get(item.slug);

    const unitPriceKobo = product.price_kobo;

    const lineTotalKobo =
        unitPriceKobo * item.quantity;

    subtotalKobo += lineTotalKobo;

    return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        quantity: item.quantity,
        unitPriceKobo,
        lineTotalKobo
    };

});
/* -----------------------------------------------------
   CALCULATE DELIVERY AND FINAL TOTAL
----------------------------------------------------- */

const deliveryFeeKobo = 0;

const totalKobo =
    subtotalKobo + deliveryFeeKobo;

    /* -----------------------------------------------------
   FIND OR CREATE CUSTOMER
----------------------------------------------------- */

let customerId;

const existingCustomerResult = await client.query(
    `
        SELECT id
        FROM customers
        WHERE phone = $1
        LIMIT 1
    `,
    [phone]
);

if (existingCustomerResult.rows.length > 0) {

    customerId =
        existingCustomerResult.rows[0].id;

} else {

    const newCustomerResult = await client.query(
        `
            INSERT INTO customers (
                full_name,
                phone,
                email
            )
            VALUES ($1, $2, $3)
            RETURNING id
        `,
        [
            fullName,
            phone,
            email || null
        ]
    );

    customerId =
        newCustomerResult.rows[0].id;

}
        await client.query("BEGIN");
        /* -----------------------------------------------------
           START TRANSACTION
           ----------------------------------------------------- */

        await client.query("BEGIN");


        /* -----------------------------------------------------
           GET PRODUCTS FROM DATABASE
           
           IMPORTANT:
           We DO NOT trust prices sent by the browser.
           The database is the source of truth.
           ----------------------------------------------------- */

        const slugs = [
            ...new Set(
                requestedItems.map(item => item.slug)
            )
        ];


        const productResult = await client.query(
            `
            SELECT
                id,
                slug,
                name,
                size_label,
                price_kobo,
                is_available
            FROM products
            WHERE slug = ANY($1::text[])
            `,
            [slugs]
        );


        if (
            productResult.rows.length !== slugs.length
        ) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "One or more selected products do not exist."
            });

        }


        const productsBySlug = new Map();

        productResult.rows.forEach(product => {
            productsBySlug.set(
                product.slug,
                product
            );
        });


        /* -----------------------------------------------------
           CHECK AVAILABILITY + CALCULATE TOTAL
           ----------------------------------------------------- */

        let subtotalKobo = 0;

        const orderItems = [];


        for (const requestedItem of requestedItems) {

            const product =
                productsBySlug.get(
                    requestedItem.slug
                );


            if (!product.is_available) {

                await client.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} is currently unavailable.`
                });

            }


            const lineTotal =
                Number(product.price_kobo) *
                requestedItem.quantity;


            subtotalKobo += lineTotal;


            orderItems.push({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                sizeLabel: product.size_label,
                quantity: requestedItem.quantity,
                unitPriceKobo:
                    Number(product.price_kobo),
                lineTotalKobo: lineTotal
            });

        }


        /*
         * Delivery fees are not configured yet.
         * Therefore production order creation currently
         * records a zero delivery fee.
         */
        const deliveryFeeKobo = 0;

        const totalKobo =
            subtotalKobo + deliveryFeeKobo;


        /* -----------------------------------------------------
           CUSTOMER
           
           Reuse an existing customer when the phone matches.
           ----------------------------------------------------- */

        let customerId;


        const existingCustomer =
            await client.query(
                `
                SELECT id
                FROM customers
                WHERE phone = $1
                ORDER BY id ASC
                LIMIT 1
                `,
                [phone]
            );


        if (existingCustomer.rows.length > 0) {

            customerId =
                existingCustomer.rows[0].id;


            await client.query(
                `
                UPDATE customers
                SET
                    full_name = $1,
                    email = $2,
                    updated_at = NOW()
                WHERE id = $3
                `,
                [
                    fullName,
                    email,
                    customerId
                ]
            );

        } else {

            const customerResult =
                await client.query(
                    `
                    INSERT INTO customers
                        (
                            full_name,
                            phone,
                            email
                        )
                    VALUES
                        ($1, $2, $3)
                    RETURNING id
                    `,
                    [
                        fullName,
                        phone,
                        email
                    ]
                );


            customerId =
                customerResult.rows[0].id;

        }


        /* -----------------------------------------------------
           UNIQUE MENCC ORDER NUMBER
           ----------------------------------------------------- */

        let orderNumber;
        let orderId;


        for (let attempt = 0; attempt < 5; attempt++) {

            orderNumber =
                generateOrderNumber();


            try {

                const orderResult =
                    await client.query(
                        `
                        INSERT INTO orders
                            (
                                order_number,
                                customer_id,
                                delivery_type,
                                city,
                                area,
                                delivery_address,
                                delivery_notes,
                                subtotal_kobo,
                                delivery_fee_kobo,
                                total_kobo,
                                order_status,
                                payment_status
                            )
                        VALUES
                            (
                                $1,
                                $2,
                                $3,
                                $4,
                                $5,
                                $6,
                                $7,
                                $8,
                                $9,
                                $10,
                                'RECEIVED',
                                'PENDING'
                            )
                        RETURNING
                            id,
                            order_number,
                            order_status,
                            payment_status,
                            total_kobo,
                            created_at
                        `,
                        [
                            orderNumber,
                            customerId,
                            deliveryType,
                            city || null,
                            area,
                            address,
                            notes || null,
                            subtotalKobo,
                            deliveryFeeKobo,
                            totalKobo
                        ]
                    );


                orderId =
                    orderResult.rows[0].id;

                break;


            } catch (error) {

                /*
                 * PostgreSQL unique constraint collision.
                 * Generate another customer-facing order number.
                 */
                if (
                    error.code !== "23505" ||
                    attempt === 4
                ) {
                    throw error;
                }

            }

        }


        /* -----------------------------------------------------
           ORDER ITEMS
           ----------------------------------------------------- */

        for (const item of orderItems) {

            await client.query(
                `
                INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        unit_price_kobo,
                        line_total_kobo
                    )
                VALUES
                    ($1, $2, $3, $4, $5)
                `,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.unitPriceKobo,
                    item.lineTotalKobo
                ]
            );

        }


        /* -----------------------------------------------------
           COMMIT
           ----------------------------------------------------- */

        await client.query("COMMIT");


        /* -----------------------------------------------------
           RESPONSE
           ----------------------------------------------------- */

        res.status(201).json({
            success: true,

            order: {
                id: orderId,
                orderNumber,
                status: "RECEIVED",
                paymentStatus: "PENDING",
                subtotalKobo,
                deliveryFeeKobo,
                totalKobo
            }
        });


    } catch (error) {

        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError
            );
        }


        console.error(
            "Create order error:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Unable to create MENCC order."
        });


    } finally {

        client.release();

    }

});


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, () => {

    console.log(
        `MENCC server running at http://localhost:${PORT}`
    );

});