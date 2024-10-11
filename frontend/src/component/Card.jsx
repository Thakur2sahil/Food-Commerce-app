import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Card({ searchTerm }) {
  const [products, setProduct] = useState([]);

  const filehandle = async () => {
    try {
      const res = await axios.get('http://localhost:8004/card');
      if (res.data && res.data.length > 0) {
        setProduct(res.data);
      } else {
        alert('No data available');
      }
    } catch (error) {
      console.error({ error: 'Database error' });
    }
  };

  useEffect(() => {
    filehandle();
  }, []);

  const handleAdd = async (pid, name) => {
    try {
      const userid = localStorage.getItem('userid');
      if (!userid) {
        toast.error('User is not logged in');
        return;
      }

      const res = await axios.post('http://localhost:8004/card1', {
        pid,
        quantity: 1,
        userid,
      });

      console.log(res);
      toast.success(`${name} added to the cart`);
    } catch (error) {
      console.error(error);
      alert('Unable to connect');
    }
  };

  // Apply filtering logic based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) // Ensure case-insensitive and trimmed search
  );

 

  return (
    <div className='min-w-full flex flex-wrap justify-between border px-2 py-4'>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id} className='border px-2 py-4 mx-2 my-4 w-full md:w-1/3 lg:w-1/4 shadow-2xl'>
            <div className='flex flex-col items-center h-full justify-between'>
              <img
                src={`http://localhost:8004/${product.photo}`}
                alt={product.name}
                name='photo'
                className='w-full h-40 object-cover'
              />
              <h1 className='mt-2 text-lg font-semibold' name='name'>
                {product.name}
              </h1>
              <p className='mt-1 text-gray-600 text-center' name='description'>
                {product.description}
              </p>

              <div className='flex w-full justify-between mt-4 mb-3 mx-2'>
                <p className='mx-2' name='price'>
                  ₹{product.price}
                </p>
                <p className='mx-2' name='category'>
                  {product.category}
                </p>
              </div>
              <button
                className='mt-auto bg-blue-500 text-white py-1 px-4 rounded'
                onClick={() => handleAdd(product.id, product.name)}
              >
                Add to Cart
              </button>
            </div>
            <ToastContainer position='bottom-right' autoClose={1000} hideProgressBar={false} />
          </div>
        ))
      ) : (
        <div className='w-full text-center'>
          <h1>No products found</h1>
        </div>
      )}
    </div>
  );
}

export default Card;
