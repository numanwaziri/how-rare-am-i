import "./Fireflies.css";
export const Fireflies = () => {
  const fireflyDivs = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="firefly -z-40" />
  ));

  return <>{fireflyDivs}</>;
};
