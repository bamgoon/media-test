import { ComponentPropsWithoutRef } from "react";

function Switch({ ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <label className="inline-block cursor-pointer">
      <input type="checkbox" className="peer sr-only" {...props} />
      <div className="relative h-[20px] w-[40px] rounded-full bg-grey-400 after:absolute after:left-[4px] after:top-[3px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-grey-500 after:transition-all peer-checked:bg-primary-600 peer-checked:after:left-[22px] peer-checked:after:bg-white peer-disabled:cursor-default peer-disabled:peer-checked:bg-primary-400" />
    </label>
  );
}

export default Switch;
