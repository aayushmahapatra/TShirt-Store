import React, {useState, useEffect} from 'react';
import '../styles.css';
import Base from './Base';
import Card from './Card';
import {getProducts} from './helper/coreapicalls';

const Home = () => {
  const [products, setProducts] = useState([]);

  const loadAllProducts = () => {
    getProducts().then(data => {
      if (data === undefined) {
        console.log('Unexpected error!');
      } else {
        setProducts(data);
      }
    }).catch();
  };

  useEffect(() => {
    loadAllProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Base title='Home Page' description='Welcome to the Tshirt Store'>
      <div className='row text-center'>
        <h1 className='text-white'>All of tshirts</h1>
        <div className='row'>
          {products.map((product, i) => {
            return (
              <div key={i} className='col-4 mb-4'>
                <Card product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default Home;
