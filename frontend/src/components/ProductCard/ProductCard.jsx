import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import useCart from "../../context/useCart";
import { FiShoppingCart, FiPlus } from "react-icons/fi"; // Dùng icon dấu cộng hoặc giỏ hàng

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__media">
        <img src={product.img} alt={product.name} />
      </Link>

      <div className="product-card__body">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        <div className="product-card__footer">
          <span className="product-card__price">
            {Number(product.price).toLocaleString()} đ
          </span>

          <button
            className="btn-icon"
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id, 1);
            }}
            title="Thêm vào giỏ hàng"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
