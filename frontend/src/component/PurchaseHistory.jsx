import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PurchaseHistory() {
    const [orders, setOrders] = useState([]);

    const userId = localStorage.getItem('userid')

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const res = await axios.post('http://localhost:8004/purchasehistory', { userId });
            setOrders(res.data);
        } catch (err) {
            setError('Failed to fetch purchase history');
        } 
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

   
    return (
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
            {
                orders.length>0 ? (
                    <>
                                <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="border-b">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                    src={`http://localhost:8004/${order.photo}`}
                                    alt="Product"
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    </>
                ) : 
                (
                    <div>
                        No record fround
                        </div>
                )
            }
        </div>
    );
}

export default PurchaseHistory;