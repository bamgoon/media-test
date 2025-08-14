import { ComponentPropsWithoutRef } from "react";

function Select({ ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      {...props}
      className="peer truncate rounded border border-grey-400 bg-white py-[6px] pl-[10px] pr-[30px] outline-none placeholder:text-grey-500 disabled:bg-grey-100 disabled:text-grey-500 typo-2xs400 mt-[4px] w-full text-start "
    />
  );
}

export default Select;
