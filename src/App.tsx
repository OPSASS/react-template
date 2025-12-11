import CounterInput from "./components/CounterInput";

const App = () => {
  return (
    <div className="w-screen h-screen bg-neutral-800 flex items-center justify-center text-neutral-100 ">
      <div className="w-72 bg-bg-default p-4 rounded-lg text-xs">
        <CounterInput
          defaultValue={"56px"}
          showUnit
          unitOptions={["%", "px"]}
          step={1}
          onChange={(value) => console.log(value)}
        />
      </div>
    </div>
  );
};

export default App;
