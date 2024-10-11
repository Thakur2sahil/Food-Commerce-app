const express = require('express')
const cors = require('cors')
const {Client} = require('pg')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';
const nodemailer = require('nodemailer');
const { sendEmail } = require('./emailService');
const fs = require('fs')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));

const db = new Client({
    host:'192.168.1.6',
    user:'postgres',
    port:5432,
    password:'mawai123',
    database:'php_training'
})

db.connect()
.then(res=>{
    console.log(res)
    console.log('Connect to database')
})
.catch(err=>{
    console.error(err)
    console.log("Can't connect to Database")
})

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,'./uploads')
    },
    filename: function (req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})



app.post('/signup', upload.single('image'), async(req, res) => {
    const imgpath = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    const { name, user, email, password, role } = req.body;

    // Check if the email and username already exist
    const checkEmailQuery = 'SELECT * FROM sahil.users WHERE email=$1 ';
    
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.rows.length > 0) {
            // If email or username already exists, return an error
            const existingUser = result.rows[0];
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            if (existingUser.username === user) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }

        // Insert the user data if the email and username do not exist
        const insert = 'INSERT INTO sahil.users (full_name, username, email, password, role, image) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

        db.query(insert, [name, user, email, password, role, imgpath], async(err, data) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database insertion error' });
            }

            const newUser = data.rows[0];

            // Create a JWT token with the user's role
            const payload = {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role // 'admin' or 'user'
            };

            // Sign the token with a secret key and set an expiration time (e.g., 1 hour)
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            // Send registration confirmation email
           

          await sendEmail(
        email,
        'Registration Details',
        `Hello ${name},<br><br>You have successfully registered with the following details`
      );
// Call the email function here

            res.json({
                success: 'User registered successfully',
                user: newUser,
                token: token // Return the token with the response
            });
        });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists with the provided email and password
    const select = 'SELECT * FROM sahil.users WHERE email=$1 AND password=$2';

    db.query(select, [email, password], (err, data) => {
        if (err) {
            console.error({ err: "Database error" });
            return res.status(500).json('Database error');
        }

        if (data.rows.length > 0) {
            const user = data.rows[0];

            // Create a JWT payload with user's role (admin/user)
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role // 'admin' or 'user'
            };

            // Sign the token with the secret key
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            return res.status(200).json({
                message: "Successful Login",
                user: user,
                token: token // Return the JWT token
            });
        } else {
            return res.status(404).json({ error: 'Invalid email or password' });
        }
    });
});


app.post("/newproduct",upload.single('image'),(req,res)=>{
    // const imgpath = req.file.path.replace(/\\/g, "/");

    const imgpath = `uploads/${req.file.filename}`;
    
    const {name , price , discount  , category,description} = req.body;

    const insert = 'INSERT into sahil.products(name,price, discount,photo,category,description) VALUES ($1,$2,$3,$4,$5,$6)'

    db.query(insert,[name , price , discount , imgpath , category,description],(err,data)=>{
        if(err)
            {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database insertion error' });
            }
            else{
                res.json({ success: 'The Product is register', data });
            }
        })
})


app.get('/ourproduct', (req, res) => {
    const query = 'SELECT id, name, price, description, category, photo FROM sahil.products';

    db.query(query, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    });
});


app.get('/card', (req, res) => {
    const select = 'SELECT id, name, description, price, category, photo, rating FROM sahil.products'; // Ensure rating is included
             
    db.query(select, (err, data) => {
        if (err) {
            console.error({ err: "Database Error" });
            return res.status(400).json("Error due to database");
        }

        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ err: "No data found" });
        }
    });
});


app.get('/updateproduct', (req, res) => {
    const query = 'SELECT id, name, price, description, category, photo FROM sahil.products';

    db.query(query, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    });
});

async function checkexits(value) {
    const select = 'SELECT EXISTS (SELECT 1 FROM sahil.cart WHERE product_id = $1)';
    const result = await db.query(select, [value]);
    return result.rows[0].exists;
}



app.post('/card1', (req, res) => {
    const { userid, pid, quantity } = req.body;


    const insert = `INSERT INTO sahil.cart(user_id, product_id, quantity) VALUES ($1, $2, $3)`;
    const update = `UPDATE sahil.cart SET quantity = quantity + 1 WHERE product_id = $1`;

    checkexits(pid).then(exists => {
        if (exists) {
            db.query(update, [pid], (err, data) => {
                if (err) {
                    console.error("Error updating quantity: ", err);
                    return res.status(500).json({ error: "Error updating quantity" });
                } else {
                    return res.json({ message: "Quantity updated" });
                }
            });
        } else {
            db.query(insert, [userid, pid, quantity], (err, data) => {
                if (err) {
                    console.error("Error inserting into cart: ", err);
                    return res.status(500).json({ error: "Error inserting into cart" });
                } else {
                    console.log("Insert successful: ", data);
                    return res.status(200).json({ message: "Item added to cart" });
                }
            });
        }
    }).catch(err => {
        console.error("Error checking existence: ", err);
        return res.status(500).json({ error: "Error checking cart" });
    });
});

app.post('/cart/increment',  (req, res) => {
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

    db.query(incrementQuery,[userId, productId ], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    });
});

// Decrement product quantity in the cart
app.post('/cart/decrement', (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'Missing userId or productId' });
    }

    // Query to decrement the product's quantity
    const decrementQuery = `
        UPDATE sahil.cart 
        SET quantity = GREATEST(quantity - 1, 0) 
        WHERE user_id = $1 AND product_id = $2
        RETURNING quantity;
    `;

    db.query(decrementQuery, [userId, productId], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (data.rows.length > 0) {
            const newQuantity = data.rows[0].quantity;

            if (newQuantity === 0) {
                // If quantity becomes 0, remove the product from the cart
                const deleteQuery = `
                    DELETE FROM sahil.cart
                    WHERE user_id = $1 AND product_id = $2;
                `;

                db.query(deleteQuery, [userId, productId], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Failed to delete product from cart' });
                    }

                    return res.json({ message: 'Product removed from cart as quantity is 0', quantity: newQuantity });
                });
            } else {
                // If quantity is updated but not 0, return the updated quantity
                return res.json({ message: 'Quantity updated', quantity: newQuantity });
            }
        } else {
            return res.status(404).json({ error: 'No product found in the cart' });
        }
    });
});

app.get('/cart',(req,res)=>{
   
   const select = `
       SELECT p.photo, c.quantity, p.price, p.discount ,p.id,p.name
FROM sahil.products AS p 
INNER JOIN sahil.cart AS c 
ON p.id = c.product_id 
WHERE c.quantity > 0;
`;

    db.query(select, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ error: 'No products found' });
        }
    });
    
})

function generateRandomOrderId() {
    return Math.floor(Math.random() * 1000000); // Example: Generates a random number between 0 and 999999
  }
  
  // Example usage:
 
  app.post('/orderpage', async (req, res) => {
    const { userId } = req.body;

    const uniqueOrderId = generateRandomOrderId();

    try {
        // Begin transaction
        await db.query('BEGIN');

        // Get all cart items for the user with product details
        const cartItemsResult = await db.query(`
          SELECT cart.id, cart.product_id, cart.quantity, products.name as product_name, products.price
          FROM sahil.cart cart
          JOIN sahil.products products ON cart.product_id = products.id
          WHERE cart.user_id = $1
        `, [userId]);
        
        const cartItems = cartItemsResult.rows;

        // Insert cart items into order_history with the same unique order ID
        for (let item of cartItems) {
            await db.query(
                'INSERT INTO sahil.order_history (order_id, user_id, quantity, status, created_at, product_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [uniqueOrderId, userId, item.quantity, 'pending', new Date(), item.product_id]
            );
        }

        // Update delivered column to false for the user's cart items
        await db.query('UPDATE sahil.cart SET delivered = false WHERE user_id = $1', [userId]);

        // Delete cart items after placing the order
        await db.query('DELETE FROM sahil.cart WHERE user_id = $1', [userId]);

        // Commit transaction
        await db.query('COMMIT');

        res.status(200).json({ message: 'Order placed successfully', orderId: uniqueOrderId });
    } catch (err) {
        // Rollback transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/profile', (req, res) => {
    const { userId } = req.body;
    const select = 'SELECT * FROM sahil.users WHERE id = $1;';

    db.query(select, [userId], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Database error" });
        }

        // Check if data is available
        if (data.rows.length > 0) {
            console.log(data.rows); // Log the data for debugging
            return res.status(200).json(data.rows); // Return the data as response
        } else {
            return res.status(404).json({ message: "No data available" });
        }
    });
});

app.post('/updateprofile',upload.single('file'),(req,res)=>{
    
    const {userid,username,email} = req.body
   
    const imgpath = `uploads/${req.file.filename.replace(/\\/g, "/")}`;

    const insert = ` UPDATE sahil.users 
        SET username = $1, email = $2, image = $3 
        WHERE id = $4 
        RETURNING username, email, image`
    db.query(insert,[username,email,imgpath,userid] , (err,data)=>{
        if(err)
        {
            console.error(err)
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.rows.length > 0) {
            return res.json(data.rows);
        } else {
            return res.json({ error: 'No data found' });
        }
    })
})


app.post('/selectproduct',(req,res)=>{
    const{productid} = req.body
    
    const select = 'select * from sahil.products where id=$1'

    db.query(select,[productid],(err,data)=>{
        if(err)
        {
            console.error(err)
            return res.status(500).json({err:"Database error"})
        }
        if(data.rows.length>0)
        {
            console.log(data.rows[0])
            return res.status(200).json(data.rows)
        }
        else{
            return res.status(400).json("No data available")
        }
    })
})

app.post('/deleteproduct',(req,res)=>{
    const{productid} = req.body

    const insert= `delete from sahil.products
        where id=$1`
        db.query(insert,[productid],(err,data)=>{
            if (err) {
                console.error(err);
                return res.status(500).json({ err: "Database error" });
            }
            return res.status(200).json({ message: "Data deleted successfully" }); 
        })
})



app.post('/productupdate',(req,res)=>{
    const{productid} = req.body

    const select = 'select * from sahil.products where id=$1'

    db.query(select,[productid],(err,data)=>{
        if(err)
        {
            return res.status(500).json({err:"Database error"})
        }
        if(data.rows.length>0)
        {
            console.log(data.rows)
            return res.status(200).json(data.rows)
        }
        else{
            return res.status(400).json("No data Avialabe")
        }
    })
}) 

app.post('/upproduct',upload.single('image'),(req,res)=>{
    const image = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    const {name,price,description,category,discount,productid} = req.body

    const update = `update  sahil.products 
    set name=$1,price=$2,description=$3,category=$4,discount=$5,photo=$6
    where id=$7`

    db.query(update,[name,price,description,category,discount,image,productid],(err,data)=>{
        if(err)
        {
            return res.status(500).json('Databse Error')
        }
        if (data.rowCount > 0) {
            console.log("Product updated successfully");
            return res.status(200).json(data.rows[0]);  // Return the updated product
        } else {
            return res.status(400).json("No data available");
        }
    })
    
})

app.post('/ordercard',(req,res)=>{
    const { userId } = req.body;
    if (!userId) {
       console.log("No user Id availabe")
      }
      const select = 'SELECT o.order_id, o.user_id, o.product_id, o.quantity, p.photo AS photo, p.name, p.price FROM sahil.order_history o JOIN sahil.products p ON o.product_id = p.id WHERE o.user_id = $1 AND o.status = \'pending\';';


    db.query(select,[userId],(err,data)=>{
        if(err)
        {
            console.error(err)
            return res.status(500).json(err)
        }
        if(data.rows && data.rows.length>0)
        {
            console.log(data.rows)
            return res.status(200).json(data.rows)
        }
        else
        {
            return res.status(400).json('No data found')
        }
    })
    
})


app.post('/orderdel', (req, res) => {
    const { orderId, userId } = req.body;

    const del = 'DELETE FROM sahil.order_history WHERE order_id=$1 AND user_id=$2';

    db.query(del, [orderId, userId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ err: "Error deleting the order" });
        }
        console.log(`Order ID ${orderId} deleted for user ID ${userId}`);
        return res.status(200).json({ message: "Data deleted successfully" });
    });
});


app.post('/orderreq',(req,res)=>{

      const select = "SELECT o.order_id, o.user_id, o.product_id, o.quantity, p.photo AS photo, p.name, p.price FROM sahil.order_history o JOIN sahil.products p ON o.product_id = p.id where status = 'pending' "


    db.query(select,(err,data)=>{
        if(err)
        {
            console.error(err)
            return res.status(500).json(err)
        }
        if(data.rows && data.rows.length>0)
        {
           
            return res.status(200).json(data.rows)
        }
        else
        {
            return res.status(400).json('No data found')
        }
    })
})

app.post('/accept', (req, res) => {
    const { orderId } = req.body;
    

    if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
    }

    const updateQuery = "UPDATE sahil.order_history SET status = 'approved' WHERE order_id = $1";

    db.query(updateQuery, [orderId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({ message: "Order is accepted" });
    });
});


app.post('/cancel', (req, res) => {
    const { orderId } = req.body;

    console.log(orderId);
    

    // Validate the orderId input
    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    const deleteQuery = "DELETE FROM sahil.order_history WHERE order_id = $1";

    // Execute the delete query
    db.query(deleteQuery, [orderId], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Log detailed error message for debugging
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Check if the order was found and deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Success response if the order was deleted
        return res.status(200).json({ message: "Order has been cancelled" });
    });
});

app.post('/purchasehistory',(req,res)=>{

    const {userId} = req.body

    const select = "select o.order_id , p.photo as photo, p.id , o.quantity , o.status, o.rating,TO_CHAR(o.created_at, 'YYYY-MM-DD') as date from sahil.order_history as o inner join sahil.products as p on o.product_id = p.id  where user_id =$1  "

        db.query(select,[userId],(err,data)=>{
            if(err)
            {
                return res.status(500).json({err:"Error generate"})
            }
            if(data.rows.length>0)
            {
                console.log(data.rows)
                return res.status(200).json(data.rows)
            }
            else
            {
                return res.status(400).json("No data found")
            }
        })

})

// Update rating for a specific order
app.post('/updaterating', async (req, res) => {
    const { orderId, rating } = req.body;

    try {
        await db.query('BEGIN');

        // Get current rating and rating_count
        const currentQuery = "SELECT rating, rating_count FROM sahil.order_history WHERE order_id = $1 AND status = 'approved'";
        const currentResult = await db.query(currentQuery, [orderId]);

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ err: "Order not found or not approved" });
        }

        const currentRating = currentResult.rows[0].rating || 0;
        const currentCount = currentResult.rows[0].rating_count || 0;

        // Calculate the new average rating
        // If the user has rated before, adjust the rating accordingly
        const newCount = currentCount + 1; // Increment count
        const newRating = (currentRating * currentCount + rating) / newCount; // New average

        // Update the database with the new rating and count
        const updateQuery = "UPDATE sahil.order_history SET rating = $1, rating_count = $2 WHERE order_id = $3 AND status = 'approved'";
        await db.query(updateQuery, [newRating, newCount, orderId]);

        await db.query('COMMIT');

        return res.status(200).json({ message: "Rating updated successfully" });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Failed to update rating', err);
        return res.status(500).json({ err: "Failed to update rating" });
    }
});


app.get('order-history', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          to_char(created_at, 'Month') AS month,
          COUNT(*) AS total_orders
        FROM 
          aman.order_history
        GROUP BY 
          to_char(created_at, 'Month')
        ORDER BY 
          MIN(EXTRACT(MONTH FROM created_at));
      `);
      client.release();
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching order history:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.get('/order-history', async (req, res) => {
    try {
        const query = `
           SELECT 
    DATE_TRUNC('month', created_at) AS month, 
    COUNT(*) AS total_orders 
FROM 
    sahil.order_history 
WHERE 
    status = 'approved' 
GROUP BY 
    month 
ORDER BY 
    month ASC;
        `; // Adjust table and column names as per your database structure

        const { rows } = await db.query(query);
        res.json(rows); // Send back the order data
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Failed to fetch order history' });
    }
});


app.listen(8004, () => {console.log('Listening on port 8004');
}); 