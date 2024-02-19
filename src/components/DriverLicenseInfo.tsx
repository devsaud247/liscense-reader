import React from "react";

interface DriverLicense {
  name: string;
  address: string;
  dlNumber: string;
}

const DriverLicenseInfo: React.FC<DriverLicense> = ({
  name,
  address,
  dlNumber,
}) => {
  return (
    <div className="max-w-md mt-4 mx-auto bg-white shadow-md overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Driver's License Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Personal details of the license holder.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{name}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {address}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Driver's License Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {dlNumber}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DriverLicenseInfo;
