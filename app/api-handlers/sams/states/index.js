export const getStates = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/v1/states`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
