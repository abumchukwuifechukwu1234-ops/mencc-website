require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================================
   MIDDLEWARE
   ========================================================= */

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

function normalizeText(value) {

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();

}


/* =========================================================
   GENERATE MENCC ORDER NUMBER

   Example:

   MENCC-260906-A7F2K
   ========================================================= */

function generateOrderNumber() {

    const now = new Date();

    const year =
        String(now.getFullYear()).slice(-2);

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");


    const randomPart =
        crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();


    return `MENCC-${year}${month}${day}-${randomPart}`;

}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
    "/api/health",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    "SELECT NOW() AS database_time"
                );


            res.json({
                success: true,
                message:
                    "MENCC backend and database are connected.",
                databaseTime:
                    result.rows[0].database_time
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

    }
);


/* =========================================================
   CREATE ORDER

   POST /api/orders

   Expected request body:

   {
       customer: {
           fullName: "John Doe",
           phone: "08012345678",
           email: "john@email.com"
       },

       delivery: {
           type: "home",
           city: "Warri",
           area: "Effurun",
           address: "123 Example Street",
           notes: ""
       },

       items: [
           {
               slug: "50cl",
               quantity: 2
           }
       ]
   }
   ========================================================= */

app.post(
    "/api/orders",
    async (req, res) => {

        let client;


        try {

            /* -------------------------------------------------
               REQUEST DATA
               ------------------------------------------------- */

            const customer =
                req.body.customer || {};

            const delivery =
                req.body.delivery || {};

            const items =
                req.body.items;


            /* -------------------------------------------------
               CUSTOMER DATA
               ------------------------------------------------- */

            const fullName =
                normalizeText(
                    customer.fullName
                );

            const phone =
                normalizeText(
                    customer.phone
                );

            const email =
                normalizeText(
                    customer.email
                ).toLowerCase();


            /* -------------------------------------------------
               DELIVERY DATA
               ------------------------------------------------- */

            const deliveryType =
                normalizeText(
                    delivery.type
                ).toLowerCase();

            const city =
                normalizeText(
                    delivery.city
                );

            const area =
                normalizeText(
                    delivery.area
                );

            const address =
                normalizeText(
                    delivery.address
                );

            const notes =
                normalizeText(
                    delivery.notes
                );


            /* =================================================
               VALIDATE CUSTOMER
               ================================================= */

            if (!fullName) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Customer full name is required."
                });

            }


            if (!phone) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Customer phone number is required."
                });

            }


            /* =================================================
               VALIDATE DELIVERY
               ================================================= */

            const allowedDeliveryTypes = [
                "home",
                "office",
                "business",
                "event"
            ];


            if (
                !allowedDeliveryTypes.includes(
                    deliveryType
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Delivery type must be home, office, business, or event."
                });

            }


            if (!area) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Delivery area is required."
                });

            }


            if (!address) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Delivery address is required."
                });

            }


            /* =================================================
               VALIDATE ITEMS
               ================================================= */

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "At least one product is required."
                });

            }


            /* -------------------------------------------------
               CLEAN ORDER ITEMS
               ------------------------------------------------- */

            const requestedItems =
                items.map(function (item) {

                    const slug =
                        normalizeText(
                            item.slug
                        ).toLowerCase();


                    const quantity =
                        Number(
                            item.quantity
                        );


                    return {
                        slug,
                        quantity
                    };

                });


            /* -------------------------------------------------
               VALIDATE EACH ITEM
               ------------------------------------------------- */

            for (
                const item of requestedItems
            ) {

                if (!item.slug) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Every order item needs a product."
                    });

                }


                if (
                    !Number.isInteger(
                        item.quantity
                    ) ||
                    item.quantity <= 0
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Product quantities must be positive whole numbers."
                    });

                }

            }


            /* =================================================
               COMBINE DUPLICATE PRODUCTS

               Example:

               50cl × 2
               50cl × 3

               becomes:

               50cl × 5
               ================================================= */

            const quantitiesBySlug =
                new Map();


            for (
                const item of requestedItems
            ) {

                const currentQuantity =
                    quantitiesBySlug.get(
                        item.slug
                    ) || 0;


                quantitiesBySlug.set(
                    item.slug,
                    currentQuantity +
                    item.quantity
                );

            }


            const cleanItems =
                Array.from(
                    quantitiesBySlug.entries()
                ).map(function (
                    [slug, quantity]
                ) {

                    return {
                        slug,
                        quantity
                    };

                });


            /* =================================================
               START DATABASE TRANSACTION
               ================================================= */

            client =
                await pool.connect();


            await client.query(
                "BEGIN"
            );


            /* =================================================
               GET PRODUCTS FROM DATABASE

               IMPORTANT:

               We NEVER trust prices from the browser.

               PostgreSQL is the source of truth.
               ================================================= */

            const slugs =
                cleanItems.map(
                    function (item) {

                        return item.slug;

                    }
                );


            const productResult =
                await client.query(
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


            /* -------------------------------------------------
               CHECK PRODUCTS EXIST
               ------------------------------------------------- */

            if (
                productResult.rows.length !==
                slugs.length
            ) {

                await client.query(
                    "ROLLBACK"
                );


                return res.status(400).json({
                    success: false,
                    message:
                        "One or more selected products do not exist."
                });

            }


            /* -------------------------------------------------
               PRODUCT LOOKUP
               ------------------------------------------------- */

            const productsBySlug =
                new Map();


            productResult.rows.forEach(
                function (product) {

                    productsBySlug.set(
                        product.slug,
                        product
                    );

                }
            );


            /* =================================================
               CHECK AVAILABILITY
               AND CALCULATE REAL TOTALS
               ================================================= */

            let subtotalKobo = 0;

            const orderItems = [];


            for (
                const requestedItem of cleanItems
            ) {

                const product =
                    productsBySlug.get(
                        requestedItem.slug
                    );


                if (!product) {

                    throw new Error(
                        "Product lookup failed."
                    );

                }


                if (
                    product.is_available !== true
                ) {

                    await client.query(
                        "ROLLBACK"
                    );


                    return res.status(400).json({
                        success: false,
                        message:
                            `${product.name} is currently unavailable.`
                    });

                }


                const unitPriceKobo =
                    Number(
                        product.price_kobo
                    );


                const lineTotalKobo =
                    unitPriceKobo *
                    requestedItem.quantity;


                subtotalKobo +=
                    lineTotalKobo;


                orderItems.push({

                    productId:
                        product.id,

                    slug:
                        product.slug,

                    name:
                        product.name,

                    quantity:
                        requestedItem.quantity,

                    unitPriceKobo,

                    lineTotalKobo

                });

            }


            /* =================================================
               DELIVERY FEE

               Currently:

               FREE DELIVERY = 0

               Later we can build a proper delivery pricing
               engine based on city, area, distance, etc.
               ================================================= */

            const deliveryFeeKobo = 0;


            const totalKobo =
                subtotalKobo +
                deliveryFeeKobo;


            /* =================================================
               FIND OR CREATE CUSTOMER
               ================================================= */

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


            if (
                existingCustomer.rows.length > 0
            ) {

                customerId =
                    existingCustomer.rows[0].id;


                /* ---------------------------------------------
                   UPDATE CUSTOMER DETAILS
                   --------------------------------------------- */

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
                        email || null,
                        customerId
                    ]
                );


            } else {

                /* ---------------------------------------------
                   CREATE NEW CUSTOMER
                   --------------------------------------------- */

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
                        (
                            $1,
                            $2,
                            $3
                        )

                        RETURNING id
                        `,
                        [
                            fullName,
                            phone,
                            email || null
                        ]
                    );


                customerId =
                    customerResult.rows[0].id;

            }


            /* =================================================
               CREATE UNIQUE MENCC ORDER
               ================================================= */

            let orderNumber;

            let createdOrder;


            for (
                let attempt = 0;
                attempt < 5;
                attempt++
            ) {

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
                                subtotal_kobo,
                                delivery_fee_kobo,
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


                    createdOrder =
                        orderResult.rows[0];


                    break;


                } catch (error) {

                    /*
                     * PostgreSQL unique constraint collision.
                     *
                     * Extremely unlikely, but if the generated
                     * order number already exists, try again.
                     */

                    if (
                        error.code !== "23505" ||
                        attempt === 4
                    ) {

                        throw error;

                    }

                }

            }


            /* =================================================
               SAVE ORDER ITEMS
               ================================================= */

            for (
                const item of orderItems
            ) {

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
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    `,
                    [
                        createdOrder.id,

                        item.productId,

                        item.quantity,

                        item.unitPriceKobo,

                        item.lineTotalKobo
                    ]
                );

            }


            /* =================================================
               COMMIT TRANSACTION

               Everything succeeded.

               Save permanently.
               ================================================= */

            await client.query(
                "COMMIT"
            );


            /* =================================================
               SUCCESS RESPONSE
               ================================================= */

            return res.status(201).json({

                success: true,

                message:
                    "MENCC order created successfully.",


                order: {

                    id:
                        createdOrder.id,

                    orderNumber:
                        createdOrder.order_number,

                    status:
                        createdOrder.order_status,

                    paymentStatus:
                        createdOrder.payment_status,

                    subtotalKobo:
                        Number(
                            createdOrder.subtotal_kobo
                        ),

                    deliveryFeeKobo:
                        Number(
                            createdOrder.delivery_fee_kobo
                        ),

                    totalKobo:
                        Number(
                            createdOrder.total_kobo
                        ),

                    createdAt:
                        createdOrder.created_at

                }

            });


        } catch (error) {

            /* =================================================
               ROLLBACK

               Something failed.

               Undo everything from this transaction.
               ================================================= */

            if (client) {

                try {

                    await client.query(
                        "ROLLBACK"
                    );

                } catch (rollbackError) {

                    console.error(
                        "Rollback error:",
                        rollbackError
                    );

                }

            }


            console.error(
                "Create order error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to create MENCC order."

            });


        } finally {

            if (client) {

                client.release();

            }

        }

    }
);


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, function () {

    console.log(
        `MENCC server running at http://localhost:${PORT}`
    );

});