"use client";

import { useState } from "react";
import { Stepper } from "@/components/Stepper";
import { useAccount } from "wagmi";
import { VerticalStepper } from "@/components/VerticalStepper";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { lensAccountOnly } from "@lens-chain/storage-client";
import { group } from "@lens-protocol/metadata";
import { createGroup } from "@lens-protocol/client/actions";
import { uri as URI } from "@lens-protocol/client";
import { client } from "@/lib/client";

const steps = [
  {
    title: "Basic Info",
    description: "Clan name and description",
  },
  {
    title: "Clan Image",
    description: "Upload clan icon",
  },
  {
    title: "Review",
    description: "Review and create",
  },
];

const processSteps = [
  { label: "Uploading image" },
  { label: "Saving metadata" },
  { label: "Registering on chain" },
];

export default function CreateClan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [clanData, setClanData] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const { address } = useAccount();
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const storageClient = StorageClient.create();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleNext = async () => {
    // If on the image step, upload the image before proceeding
    if (currentStep === 1 && imageFile && address) {
      const acl = lensAccountOnly(address, chains.testnet.id);
      const response = await storageClient.uploadFile(imageFile, { acl });

      console.log("Image upload response:", response);
      setClanData((prev) => ({ ...prev, icon: response.uri }));
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateClan = async () => {
    console.log("Creating clan with data:", clanData);

    const metadata = group({
      name: clanData.name,
      description: clanData.description,
      icon: clanData.icon,
    });

    const { uri } = await storageClient.uploadAsJson(metadata);

    console.log(uri); // e.g., lens://4f91ca…

    // const result = await createGroup(sessionClient, {
    //   metadataUri: URI(uri),
    // });

    // Simulate: Uploading image
    await new Promise((res) => setTimeout(res, 1000));
    setCompletedSteps((prev) => [...prev, 0]);
    setProcessStep(1);

    // Simulate: Saving metadata
    await new Promise((res) => setTimeout(res, 1000));
    setCompletedSteps((prev) => [...prev, 1]);
    setProcessStep(2);

    // Simulate: Registering on chain
    await new Promise((res) => setTimeout(res, 1000));
    setCompletedSteps((prev) => [...prev, 2]);
    setProcessStep(2);

    // Optionally: Show success message or redirect
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clan Name
              </label>
              <input
                type="text"
                value={clanData.name}
                onChange={(e) =>
                  setClanData({ ...clanData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter clan name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={clanData.description}
                onChange={(e) =>
                  setClanData({ ...clanData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows={4}
                placeholder="Enter clan description"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clan Icon
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {imageFile && (
                <div className="mt-4 text-sm text-lime-400">
                  Selected: {imageFile.name}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-4">
                Review Clan Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Clan Name:</span>
                  <p className="text-white">{clanData.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white">{clanData.description}</p>
                </div>
                <div>
                  <span className="text-gray-400">Icon:</span>
                  {clanData.icon && (
                    <img
                      src={clanData.icon}
                      alt="Clan icon"
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Your Clan
        </h1>
        <div className="max-w-3xl mx-auto">
          {!processing ? (
            <>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => setCurrentStep(step)}
              />
              <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                {renderStepContent()}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === 0
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  disabled={currentStep === 0}
                >
                  Back
                </button>
                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleCreateClan}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    Create Clan
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-8 bg-gray-900 p-8 rounded-xl flex flex-col items-center">
              <VerticalStepper
                steps={processSteps}
                currentStep={processStep}
                completedSteps={completedSteps}
              />
              {completedSteps.length === processSteps.length && (
                <div className="mt-8 text-lime-400 text-xl font-bold">
                  Clan Created Successfully!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
