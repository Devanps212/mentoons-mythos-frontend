import MythosCards from "./cards";

const StepsGuide = () => {
  const Steps = [
    {
      img: "/assets/icons/steps/id.png",
      description: "GIve your Birth Details",
    },
    {
      img: "/assets/icons/steps/paste.png",
      description: "Get your Personology Report",
    },
    {
      img: "/assets/icons/steps/idea lamp with pencil (1).png",
      description: "Approach the Solution",
    },
    {
      img: "/assets/icons/steps/account.png",
      description: "Observe the Changes",
    },
  ];
  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center overflow-hidden bg-black">
      {Steps.map((data, index) => (
        <MythosCards key={index} data={data} index={index + 1} />
      ))}
    </section>
  );
};

export default StepsGuide;
