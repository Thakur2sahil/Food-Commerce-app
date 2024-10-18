// controllers/cartController.js
const db = require('../db');

// Function to check if a product exists in the cart
async function checkExists(productId) {
    const select = 'SELECT EXISTS (SELECT 1 FROM sahil.cart WHERE product_id = $1)';
    const result = await db.query(select, [productId]);
    return result.rows[0].exists;
}

// Add or update item in the cart
const addToCart = async (req, res) => {
    const { userId, pid, quantity } = req.body;

    const insert = `INSERT INTO sahil.cart(user_id, product_id, quantity) VALUES ($1, $2, $3)`;
    const update = `UPDATE sahil.cart SET quantity = quantity + $1 WHERE product_id = $2 AND user_id = $3`;

    try {
        const exists = await checkExists(pid);
        if (exists) {
            await db.query(update, [quantity, pid, userId]);
            return res.json({ message: "Quantity updated" });
        } else {
            await db.query(insert, [userId, pid, quantity]);
            return res.status(200).json({ message: "Item added to cart" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Error processing request" });
    }
};

// Increment product quantity in the cart
const incrementQuantity = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'Missing userId or productId' });
    }

    const incrementQuery = `
        UPDATE sahil.cart 
        SET quantity = quantity + 1 
        WHERE user_id = $1 AND product_id = $2
        RETURNING quantity;
    `;

    try {
        const data = await db.query(incrementQuery, [userId, productId]);
        if (data.rows.length > 0) {
            return res.json({ quantity: data.rows[0].quantity });
        } else {
            return res.status(404).json({ error: 'No products found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query error' });
    }
};

// Decrement product quantity in the cart
const decrementQuantity = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'Missing userId or productId' });
    }

    const decrementQuery = `
        UPDATE sahil.cart 
        SET quantity = GREATEST(quantity - 1, 0) 
        WHERE user_id = $1 AND product_id = $2
        RETURNING quantity;
    `;

    try {
        const data = await db.query(decrementQuery, [userId, productId]);
        if (data.rows.length > 0) {
            const newQuantity = data.rows[0].quantity;

            if (newQuantity === 0) {
                const deleteQuery = `
                    DELETE FROM sahil.cart
                    WHERE user_id = $1 AND product_id = $2;
                `;
                await db.query(deleteQuery, [userId, productId]);
                return res.json({ message: 'Product removed from cart as quantity is 0', quantity: newQuantity });
            } else {
                return res.json({ message: 'Quantity updated', quantity: newQuantity });
            }
        } else {
            return res.status(404).json({ error: 'No product found in the cart' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query error' });
    }
};

// Get all items in the cart for a specific user
const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await db.query(
            `SELECT p.photo, c.quantity, p.price, p.discount, p.id, p.name
            FROM sahil.products AS p 
            INNER JOIN sahil.cart AS c 
            ON p.id = c.product_id 
            WHERE c.user_id = $1`,
            [userId]
        );

        if (cartItems.rows.length > 0) {
            return res.json(cartItems.rows);
        } else {
            return res.json({ error: 'No products found in the cart' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
    }
};

// Get cart item count for a user
const getCartCount = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const result = await db.query(`SELECT COUNT(*) AS itemcount FROM sahil.cart WHERE user_id = $1`, [userId]);

        if (result.rows.length > 0) {
            const { itemcount } = result.rows[0];
            return res.json({ count: parseInt(itemcount, 10) });
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Save customer contact information
const saveCustomerContact = async (req, res) => {
    const { name, email, favorite_food, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const insertQuery = `
        INSERT INTO sahil.customer_contacts (name, email, favorite_food, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;

    try {
        const result = await db.query(insertQuery, [name, email, favorite_food, message]);
        const newContactId = result.rows[0].id;

        return res.status(201).json({
            message: 'Contact information saved successfully!',
            id: newContactId,
        });
    } catch (error) {
        console.error('Error saving contact information:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get user profile data
const getProfileData = async (req, res) => {
    const { userId } = req.query;

    const select = `SELECT * FROM sahil.users WHERE id = $1`;

    try {
        const { rows } = await db.query(select, [userId]);
        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
    }
};

module.exports = { 
    addToCart, 
    incrementQuantity, 
    decrementQuantity, 
    getCartItems, 
    getCartCount, 
    saveCustomerContact, 
    getProfileData 
};
