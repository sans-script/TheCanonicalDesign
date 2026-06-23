import React from "react";

export default function ColorDemo() {
  return (
    <div className="min-h-screen bg-grey-100 px-2 sm:px-0 pt-6 pb-10 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        {/* Primary & Secondary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-3 md:p-6 bg-white rounded-[10px] border border-dashed border-gray-200">
          {/* Primary */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Primary
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[60vw]  h-[120px] rounded-[8px]  bg-primary-main " />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-primary-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-primary-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-primary-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-primary-darker" />
              </div>
            </div>
          </div>
          {/* Secondary */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Secondary
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[60vw]  h-[120px]  rounded-[8px]  bg-secondary-main" />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-secondary-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-secondary-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-secondary-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-secondary-darker" />
              </div>
            </div>
          </div>
        </div>
        {/* Info, Success, Warning, Error */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-3 md:p-6 bg-white rounded-[10px] border border-dashed border-gray-200">
          {/* Info */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Info
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[32vw]  h-[120px]  rounded-[8px]  bg-info-main" />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-info-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-info-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-info-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-info-darker" />
              </div>
            </div>
          </div>
          {/* Success */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Success
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[32vw]  h-[120px]  rounded-[8px]  bg-success-main" />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-success-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-success-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-success-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-success-darker" />
              </div>
            </div>
          </div>
          {/* Warning */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Warning
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[32vw]  h-[120px]  rounded-[8px]  bg-warning-main" />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-warning-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-warning-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-warning-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-warning-darker" />
              </div>
            </div>
          </div>
          {/* Error */}
          <div className="flex flex-col gap-3 w-full items-center md:items-start">
            <span className="font-bold text-gray-800 text-base mb-1 self-start">
              Error
            </span>
            <div className="flex flex-row items-center gap-3 md:gap-4 w-full justify-center md:justify-start">
              <div className="w-[32vw]  h-[120px]  rounded-[8px]  bg-error-main" />
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-error-lighter" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-error-light" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-error-dark" />
                <div className="w-6 h-6 md:w-7  rounded-[6px]  bg-error-darker" />
              </div>
            </div>
          </div>
        </div>
        {/* Grey */}
        <div className="p-3 md:p-6 bg-white rounded-[10px] border border-dashed border-gray-200">
          <span className="font-bold text-gray-800 text-base mb-3 pl-1 block">
            Grey
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 md:gap-4 w-full justify-between">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-100" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                100
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-200" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                200
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-300" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                300
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-400" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                400
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-500" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                500
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-600" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                600
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-700" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                700
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[8px]  bg-grey-800" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                800
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-16 md:w-16 md:h-16 rounded-[8px]  bg-grey-900" />
              <span className="text-sm text-gray-400 mt-2 font-semibold">
                900
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
