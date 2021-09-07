import React, {useState, useEffect} from 'react';
import Base from '../core/Base';
import {isAuthenticated} from '../auth/helper';
import {Link} from 'react-router-dom';
import {getCategory, updateCategory} from './helper/adminapicall';

const UpdateCategories = ({match}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {user, token} = isAuthenticated();

  const goBack = () => {
    return (
      <div className='mt-5'>
        <Link className='btn btn-sm btn-success mb-3' to='/admin/dashboard'>
          Admin Home
        </Link>
      </div>
    );
  };

  const preload = categoryId => {
    getCategory(categoryId).then(data => {
      if (data.error) {
        setError(true);
      } else {
        setName(data.name);
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = event => {
    setError('');
    setName(event.target.value);
  };

  const onSubmit = event => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    //backend request fired
    updateCategory(match.params.categoryId, user._id, token, {name})
    .then(data => {
      if (data.error) {
        setError(true);
      } else {
        setError('');
        setSuccess(true);
        setName('');
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className='text-success'>Category updated successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className='text-success'>Failed to update category</h4>;
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className='form-group'>
          <p className='lead'>Update the category</p>
          <input
            type='text'
            className='form-control my-3'
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder='For Ex. Summer'
          />
        </div>
        <button onClick={onSubmit} className='btn btn-outline-info'>Update Category</button>
      </form>
    );
  };

  return (
    <div>
      <Base
        title='Create a category here'
        description='Add a new category for new tshirts'
        className='container bg-info p-4'
      >
        <div className='row bg-white rounded'>
          <div className='col-md-8 offset-md-2'>
            {successMessage()}
            {warningMessage()}
            {myCategoryForm()}
            {goBack()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default UpdateCategories;
