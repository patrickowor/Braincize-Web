"use client";

import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/api";

/** Navy "Sign Up Newsletter" band that sits above the footer. Desktop only; no mobile frame exists. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const { run, status, error, pending } = useAsyncAction(api.newsletter.subscribe);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await run({ email });
    if (result) setEmail("");
  }

  return (
    <section aria-label="Newsletter" className="relative hidden h-[19.625rem] bg-[#040a40] lg:block">
      <div className="relative mx-auto h-full w-[90rem]">
        <h2 className="absolute top-[5.9375rem] left-[4.50875rem] w-[24.01719rem] text-center font-montserrat text-[3rem] leading-[normal] font-medium tracking-[-0.006rem] text-white capitalize">
          Sign Up Newsletter
        </h2>

        <form onSubmit={onSubmit} className="absolute top-[6.8125rem] left-[37.875rem] h-[6rem] w-[42.24988rem]">
          <div className="absolute inset-0 bg-white" />
          <label className="absolute inset-y-0 left-0 w-[27.875rem]">
            <span className="sr-only">Your e-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer absolute inset-0 bg-transparent pt-[1rem] pr-[1rem] pl-[1.71rem] font-poppins text-[1.25rem] text-[rgba(4,10,64,0.85)] outline-none"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-[1rem] left-[1.71rem] w-[4.39619rem] font-poppins text-[1.25rem] leading-[normal] text-[rgba(4,10,64,0.85)] capitalize peer-not-placeholder-shown:hidden"
            >
              your e-mail
            </span>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="absolute top-0 left-[27.875rem] h-[6rem] w-[14.3455rem] cursor-pointer bg-brand font-poppins text-[1.5rem] leading-[normal] font-medium text-white capitalize disabled:opacity-60"
          >
            <span className="mx-auto block w-[9.34775rem]">subscribe now</span>
          </button>
        </form>

        <p role="status" className="absolute top-[13.5625rem] left-[37.875rem] font-poppins text-[0.875rem] text-white">
          {status === "success" && "Thanks for subscribing."}
          {status === "error" && error}
        </p>
      </div>
    </section>
  );
}
