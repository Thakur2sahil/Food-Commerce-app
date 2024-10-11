import React, { useState } from 'react';

function OrderPage() {
  // Dynamic order data
  const [order, setOrder] = useState({
    orderId: 169923,
    products: [
      {
        id: 1,
        name: 'Fried Rice',
        price: 80.00,
        quantity: 2,
        img: 'https://example.com/fried-rice.jpg', // replace with actual image link
      },
      {
        id: 2,
        name: 'Halva',
        price: 50.00,
        quantity: 2,
        img: 'https://example.com/halva.jpg', // replace with actual image link
      },
    ],
  });

  // Function to delete the order
  const deleteOrder = () => {
    setOrder(null);
  };

  if (!order) {
    return <p className="text-center text-lg font-bold mt-10">Order Deleted</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Product Processing</h1>
        <p className="text-center text-xl mb-6">Order ID: {order.orderId}</p>
        
        <table className="min-w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-left">Product</th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-right">Price</th>
              <th className="px-4 py-2 border text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map(product => (
              <tr key={product.id}>
                <td className="px-4 py-2 border">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border text-right">&#8377;{product.price.toFixed(2)}</td>
                <td className="px-4 py-2 border text-center">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-6">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition"
            onClick={deleteOrder}
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
