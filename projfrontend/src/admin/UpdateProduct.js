import React, {useState, useEffect} from 'react';
import Base from '../core/Base';
import {Link, Redirect} from 'react-router-dom';
import {getCategories, getProduct, updateProduct} from './helper/adminapicall';
import {isAuthenticated} from '../auth/helper';

const UpdateProduct = ({match}) => {
  const {user, token} = isAuthenticated();

  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    photo: '',
    categories: [],
    category: '',
    loading: false,
    error: '',
    createdProduct: '',
    getRedirect: false,
    formData: ''
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    error,
    createdProduct,
    getRedirect,
    formData
  } = values;

  const preload = productId => {
    getProduct(productId).then(data => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          stock: data.stock,
          formData: new FormData(),
        });
        preloadCategories();
      }
    });
  };

  const preloadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setValues({categories: data, formData: new FormData()});
      }
    });
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({...values, [name]: value});
  };

  const performRedirect = () => {
    if (getRedirect) {
      return <Redirect to='/admin/dashboard' />;
    }
  }

  const onSubmit = event => {
    event.preventDefault();
    setValues({...values, error: '', loading: true});
    updateProduct(match.params.productId, user._id, token, formData)
    .then(data => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          price: '',
          photo: '',
          stock: '',
          loading: false,
          createdProduct: data.name
        });
        setTimeout(() => {
          setValues({...values, getRedirect: true});
        }, 2000);
      }
    });
  };


  const successMessage = () => {
    return (
      <div
        className='alert alert-success mt-3'
        style={{display: createdProduct ? '' : 'none'}}
      >
        <h4>{createdProduct} updated successfully</h4>
      </div>
    );
  };

  const warningMessage = () => {
    if (error) {
      return (
        <div
          className='alert alert-success mt-3'
          style={{display: createdProduct ? '' : 'none'}}
        >
          <h4>Failed to update category</h4>
        </div>
      );
    }
  };

  const createProductForm = () => (
    <form >
      <span>Post photo</span>
      <div className="form-group mb-3">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group mb-3">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group mb-3">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group mb-3">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group mb-3">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, i) => (
              <option key={i} value={cate._id}>{cate.name}</option>
            ))
          }
        </select>
      </div>
      <div className="form-group mb-3">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title='Add a product here!'
      description='Welcome to product creation section'
      className='container bg-info p-4'
    >
      <Link className='btn btn-md btn-dark mb-3' to='/admin/dashboard'>
        Admin Home
      </Link>
      <div className='row bg-dark text-white rounded'>
        <div className='col-md-8 offset-md-2'>
          {successMessage()}
          {warningMessage()}
          {createProductForm()}
          {performRedirect()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
