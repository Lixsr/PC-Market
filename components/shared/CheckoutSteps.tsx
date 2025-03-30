import { checkoutSteps } from "@/lib/constants";
import React from "react";
import { cn } from "@/lib/utils";
const CheckoutSteps = ({ currentStep = 0 }) => {
  return (
    <div className="flex-between flex-col md:flex-row mb-10 space-x-2 space-y-2">
      {checkoutSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === currentStep && "bg-secondary"
            )}
          >
            {step}
          </div>
          {step !== "Place Order" && (
            <hr className="w-16 border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
