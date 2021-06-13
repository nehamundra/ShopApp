import Product from "../../models/Product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const response = await fetch(
        "https://rn-shop-app-01-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!!");
      }

      const resData = await response.json();
      const loadedProducts = [];
      for (const key in resData) {
        const { title, description, imageURL, price, ownerId } = { ...resData[key] };
        loadedProducts.push(
          new Product(key, ownerId, title, imageURL, description, price)
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};
export const deleteProduct = (productId) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://rn-shop-app-01-default-rtdb.firebaseio.com/products/${productId}.json`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageURL, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;
    const response = await fetch(
      `https://rn-shop-app-01-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageURL,
          price,
          ownerId,
        }),
      }
    );

    const resData = await response.json();
    dispatch({
      type: CREATE_PRODUCT,
      prodData: {
        id: resData.name,
        title,
        description,
        imageURL,
        price,
        ownerId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageURL) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shop-app-01-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, imageURL }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      prodData: { title, description, imageURL },
    });
  };
};
