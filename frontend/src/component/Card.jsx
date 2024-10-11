import axios from 'axios'
import  {  useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

function Card() {

    const [products , setProduct] = useState([])

    const filehandle = async () =>{
        try {
            
            const res = await axios.get('http://localhost:8004/card' );
            if(res.data && res.data.length >0)
            {
                setProduct(res.data)

            }
            else
            {
                alert("No data available")
            }

        } catch (error) {
           console.error({error:"Database error"})
        }
    }

    useEffect(()=>{
        filehandle();
    },[])


    const handleadd = async (pid,name) => {
        try {
          // Retrieve the userid from localStorage
          const userid = localStorage.getItem('userid'); // Assuming 'userid' is the key
      
          if (!userid) {
            toast.error("User is not logged in");
            return;
          }
      
          const res = await axios.post('http://localhost:8004/card1', {
            pid, 
            quantity: 1,
            userid  // Add userid in the payload
          });
      
          console.log(res);
          toast.success(`${name} added to the cart`);
      
        } catch (error) {
          console.error(error);
          alert("Unable to connect");
        }
      };
       
    
    return (
<div className='flex flex-wrap justify-between border px-2 py-4'>
    {products.length > 0 ? (
        products.map((product) => (
            <div key={product.id} className='border px-2 py-4 mx-2 my-4 w-full md:w-1/3 lg:w-1/4 shadow-2xl'>
                <div className='flex flex-col items-center h-full justify-between'>
                    <img 
                        src={`http://localhost:8004/${product.photo}`} 
                        alt={product.name} 
                        name ='photo'
                        
                        className='w-full h-40 object-cover' // Adjust size as needed
                    />
                    <h1 className='mt-2 text-lg font-semibold' name='name'   >{product.name}</h1>
                    <p className='mt-1 text-gray-600 text-center' name='description'  >{product.description}</p>
                    
                    {/* Display Price and Category in a Row */}
                    <div className='flex  w-full justify-between mt-4 mb-3 mx-2'>
                        <p className='mx-2' name='price'    >₹{product.price}</p> {/* Adjust price style as needed */}
                        <p className='mx-2' name='category'  >{product.category}</p>
                    </div>
                    
                    <div className="flex-grow"></div> {/* Pushes the button to the bottom */}
                    <button className='mt-auto bg-blue-500 text-white py-1 px-4 rounded' onClick={(e)=> handleadd(product.id,product.name)} >
                        Add to Cart
                    </button>
                </div>
               
                <ToastContainer position='bottom-right' autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pasuseOnFocusLoss draggable pauseOnHover />
            </div>
        ))
    ) : (
        <div className='w-full text-center'>
            <h1>No image found</h1>
        </div>
    )}
</div>

    
    )
}

export default Card










