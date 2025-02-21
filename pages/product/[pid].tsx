import { GetServerSideProps } from 'next'

//import { useState } from 'react';
import Footer from '../../components/footer';
import Layout from '../../layouts/Main';
import Breadcrumb from '../../components/breadcrumb';
import ProductsFeatured from '../../components/products-featured';
import Gallery from '../../components/product-single/gallery';
import Content from '../../components/product-single/content';
import Description from '../../components/product-single/description';
//import Reviews from '../../components/product-single/reviews';
import { server } from '../../utils/server'; 
import axios from 'axios';

// types
import { ProductType } from 'types';

type ProductPageType = {
  product: ProductType;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pid = query.pid;
  // const res = await fetch(`${server}/api/product/${pid}`);
  // const product = await res.json();

  const product = await axios.get(`${server}/api/product/${pid}`).then(res => res.data)

  return {
    props: {
      product,
    },
  }
}

const Product = ({ product }: ProductPageType) => {
  //const [showBlock, setShowBlock] = useState('description');
  const showBlock = "description"

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images.slice(0,5)} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            {/* <div className="product-single__info-btns">
              <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Descripción</button>
              <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Opiniones (2)</button>
            </div> */}

            <Description show={showBlock === 'description'} description={product.description} />
            {/* <Reviews product={product} show={showBlock === 'reviews'} /> */}
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
}

export default Product
