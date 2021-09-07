import React, {useState, useEffect} from 'react';
import {cartEmpty} from './helper/CartHelper';
import {getMeToken, processMyPayment} from './helper/paymentBHelper';
import {createOrder} from './helper/OrderHelper';
import {isAuthenticated} from '../auth/helper';
import DropIn from 'braintree-web-drop-in-react';

const Payment = ({products, setReload = f => f, reload = undefined}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {}
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getMeToken(userId, token).then(info => {
      if (info.error) {
        setInfo({...info, error: info.error});
      } else {
        const clientToken = info.clientToken;
        setInfo({clientToken});
      }
    });
  };

  const showBTDropIn = () => {
    // Card No. 378282246310005 12/21
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={instance => (info.instance = instance)}
            />
            <div className="d-grid gap-2">
              <button className='btn btn-block btn-success' onClick={onPurchase}>
                Buy
              </button>
            </div>
          </div>
        ) : (
          <h3>Please login or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onPurchase = () => {
    setInfo({loading: true});
    let nonce;
    let getNonce = info.instance
    .requestPaymentMethod((requestPaymentMethodErr, data) => {
      if (requestPaymentMethodErr) {
        console.log(requestPaymentMethodErr);
      }
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount()
      };
      processMyPayment(userId, token, paymentData)
      .then(response => {
        setInfo({...info, success: response.success, loading: false})
        console.log('SUCCESS');
        console.log(response);
        // BUG: not able to save orders in DB
        const orderData = {
          products: products,
          transaction_id: response.transaction.id,
          amount: response.transaction.amount
        };
        createOrder(userId, token, orderData);
        cartEmpty(() => {
          console.log('Crash?');
        });
        setReload(!reload);
      })
      .catch(err => {
        setInfo({loading: false, success: false});
        console.log('FAILED');
      });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map(product => {
      amount = amount + product.price;
      return null;
    });
    return amount;
  };

  return (
    <div>
      <h3>Your bill is {getAmount()} $</h3>
      {showBTDropIn()}
    </div>
  );
};

export default Payment;
