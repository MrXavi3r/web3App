export const shortenAddress = (address) => {
  console.log(address);
  return (
    address.substring(0, 4) + "...." + address.substring(address.length - 4)
  );
};
