import constants from "./constants";
const { DISCOUNT_UNIT_PERCENTAGE, CURRENCY } = constants;

const calculateProductPriceAndDiscount = product => {
  if (!product)
    return {
      currency: CURRENCY,
      originalPrice: 0,
      discountedPrice: 0,
      discount: 0,
      offerValidUntil: null
    };

  const productBasePrice = product.price;
  //  product.pricing[0].basePrice;

  if (
    !productBasePrice ||
    product.productDiscount === undefined ||
    product.productDiscount?.length === 0
  ) {
    return {
      currency: CURRENCY,
      originalPrice: productBasePrice,
      discountedPrice: productBasePrice,
      discount: 0,
      offerValidUntil: null
    };
  }

  const discountValue =
    product.productDiscount.length > 0 &&
    product.productDiscount[0].discountedValue;
  const discountUnit =
    product.productDiscount.length > 0 &&
    product.productDiscount[0].discountedUnit;

  let productPriceAfterDiscount = productBasePrice;

  if (discountUnit === DISCOUNT_UNIT_PERCENTAGE) {
    productPriceAfterDiscount =
      productBasePrice - (discountValue / 100) * productBasePrice;
  } else {
    productPriceAfterDiscount = productBasePrice - discountValue;
  }

  const discountValueToShow =
    discountUnit === DISCOUNT_UNIT_PERCENTAGE
      ? `${discountValue}%`
      : `${CURRENCY}${discountValue}`;

  const payload = {
    originalPrice: product.price,
    discountedPrice: productPriceAfterDiscount.toFixed(2),
    discountAmt: discountValue,
    discountUnit: discountUnit === DISCOUNT_UNIT_PERCENTAGE ? "%" : "$",
    discount: discountValueToShow,
    offerValidUntil: product.productDiscount.validUntil
  };

  return payload;
};

export default calculateProductPriceAndDiscount;
