import { useCountDown } from "ahooks";
import { useEffect } from "react";

const Countdown = ({ date }) => {
  const [countdown, setTargetDate, format] = useCountDown({
    targetDate: date,
  });

  useEffect(() => {
    setTargetDate(date);
  }, [date]);

  return (
    <div className="grid grid-flow-col gap-5 place-items-end auto-cols-max w-72">
      <div>
        <span className="font-mono text-xl">
          <span>{format.minutes}</span>
        </span>
        min
      </div>
      <div>
        <span className="font-mono text-xl">
          <span>{format.seconds}</span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Countdown;
