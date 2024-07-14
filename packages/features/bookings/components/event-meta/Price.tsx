import type { EventPrice } from "../../types";
import { formatPrice } from "@sln/lib/price";
import dynamic from "next/dynamic";

const AlbyPriceComponent = dynamic(
  () =>
    import("@sln/app-store/alby/components/AlbyPriceComponent").then(
      (m) => m.AlbyPriceComponent
    ),
  {
    ssr: false,
  }
);

export const Price = ({
  price,
  currency,
  displayAlternateSymbol = true,
}: EventPrice) => {
  if (price === 0) return null;

  const formattedPrice = formatPrice(price, currency);

  return currency !== "BTC" ? (
    <>{formattedPrice}</>
  ) : (
    <AlbyPriceComponent
      displaySymbol={displayAlternateSymbol}
      price={price}
      formattedPrice={formattedPrice}
    />
  );
};
