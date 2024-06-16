import React from 'react'

import ProductList from './ProductList .jsx'
import CarouselPage from './CasousalPages.jsx'
import Footer from './Footer.jsx'

import Banner from './Banner.jsx'
import Banner2 from './Banner2.jsx'
import FloatingChatbot from '../Bot/flottingchatbot.jsx'
import ProductListx from './Productslist2.jsx'




const Home = () => {
  return (
   
    <div>
  
   <div className='mt-4'>
   <CarouselPage/>
   </div>
   <div className='mt-3'>
    <Banner/>
   </div>
   <div className='font-bold text-center text-white text-3xl'>
    <h1>Products</h1>
   </div>
  


 <div className='mt-4'>
<ProductList/>
 </div>
 <div className='mt-2 hover:transition-opacity hover:opacity-75'>
  <Banner2/>
 </div>


<div className='mt-5'>
  <ProductListx/>
</div>








   

   
<FloatingChatbot/>


<div>
 
</div>




<div className='mt-5'>
< Footer/>
</div>

   
    </div>
  )
}

export default Home