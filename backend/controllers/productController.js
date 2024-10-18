const { sendEmail } = require('../emailService');

const addProduct = async (req, res) => {
    try {
        const imgpath = `uploads/${req.file.filename}`;
        const { name, price, discount, category, description } = req.body;

        const insert = 'INSERT INTO sahil.products(name, price, discount, photo, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

        const result = await db.query(insert, [name, price, discount, imgpath, category, description]);

        return res.json({ success: 'The product is registered', data: result.rows[0] });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database insertion error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const query = 'SELECT id, name, price, description, category, photo FROM sahil.products';
        const result = await db.query(query);

        if (result.rows.length > 0) {
            return res.json(result.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query error' });
    }
};


const getCardProducts = async (req, res) => {
    try {
        const select = 'SELECT id, name, description, price, category, photo, rating FROM sahil.products';
        const result = await db.query(select);

        if (result.rows.length > 0) {
            return res.json(result.rows);
        } else {
            return res.json({ error: 'No data found' });
        }
    } catch (err) {
        console.error({ err: "Database Error" });
        return res.status(400).json("Error due to database");
    }
};


const getUpdateProducts = async (req, res) => {
    try {
        const query = 'SELECT id, name, price, description, category, photo FROM sahil.products';
        const result = await db.query(query);

        if (result.rows.length > 0) {
            return res.json(result.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query error' });
    }
};
const db = require('../db');

const selectProduct = (req, res) => {
    const { productid } = req.body;
    const select = 'SELECT * FROM sahil.products WHERE id = $1';

    db.query(select, [productid], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ err: "Database error" });
        }
        if (data.rows.length > 0) {
            return res.status(200).json(data.rows[0]);
        } else {
            return res.status(400).json("No data available");
        }
    });
};

const deleteProduct = (req, res) => {
    const { productid } = req.body;
    const deleteQuery = 'DELETE FROM sahil.products WHERE id = $1';

    db.query(deleteQuery, [productid], (err) => {
        if (err) {
            return res.status(500).json({ err: "Database error" });
        }
        return res.status(200).json({ success: true, message: "Data deleted successfully" });
    });
};

const productUpdate = (req, res) => {
    const { productid } = req.body;
    const select = 'SELECT * FROM sahil.products WHERE id = $1';

    db.query(select, [productid], (err, data) => {
        if (err) {
            return res.status(500).json({ err: "Database error" });
        }
        if (data.rows.length > 0) {
            return res.status(200).json(data.rows[0]);
        } else {
            return res.status(400).json("No data available");
        }
    });
};

const updateProduct = (req, res) => {
    const { name, price, description, category, discount, productid } = req.body;
    const updates = [];
    const values = [];

    if (name) {
        updates.push(`name = $${updates.length + 1}`);
        values.push(name);
    }
    if (price) {
        updates.push(`price = $${updates.length + 1}`);
        values.push(price);
    }
    if (description) {
        updates.push(`description = $${updates.length + 1}`);
        values.push(description);
    }
    if (category) {
        updates.push(`category = $${updates.length + 1}`);
        values.push(category);
    }
    if (discount) {
        updates.push(`discount = $${updates.length + 1}`);
        values.push(discount);
    }
    if (req.file) {
        const image = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
        updates.push(`photo = $${updates.length + 1}`);
        values.push(image);
    }

    if (updates.length === 0) {
        return res.status(400).json("No fields to update");
    }

    const updateQuery = `UPDATE sahil.products SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`;
    values.push(productid);

    db.query(updateQuery, values, (err) => {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json('Database Error');
        }
        return res.status(200).json({ success: true, message: 'Product updated successfully' });
    });
};


module.exports = { selectProduct,    deleteProduct,    productUpdate,    updateProduct, addProduct, getProducts, getCardProducts, getUpdateProducts };