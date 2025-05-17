"use client";

import { useState } from "react";
import { Stepper } from "@/components/Stepper";
import { useAccount } from "wagmi";
import { VerticalStepper } from "@/components/VerticalStepper";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { lensAccountOnly } from "@lens-chain/storage-client";
import { group } from "@lens-protocol/metadata";
import { createGroup, fetchGroup } from "@lens-protocol/client/actions";
import { uri as URI } from "@lens-protocol/client";
import { useSession } from "@/components/SessionContext";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicClient, walletClient } from "@/lib/client";
import { ClashOfLensABI } from "@/lib/abis/ClashOfLens";
import { CLASH_OF_LENS_ADDRESS } from "@/lib/const";

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
  { label: "Creating Lens group" },
  { label: "Registering clan" },
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
  const { sessionClient } = useSession();
  const signer = useEthersSigner();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleNext = async () => {
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
    if (!signer || !address) {
      return;
    }
    setProcessing(true);
    setProcessStep(0);
    setCompletedSteps([]);

    try {
      // Step 1: Upload image
      if (imageFile) {
        const acl = lensAccountOnly(address, chains.testnet.id);
        const response = await storageClient.uploadFile(imageFile, { acl });
        setClanData((prev) => ({ ...prev, icon: response.uri }));
        setCompletedSteps([0]);
        setProcessStep(1);
      }

      // Step 2: Create Lens group
      const metadata = group({
        name: clanData.name,
        description: clanData.description,
        icon: clanData.icon,
      });

      const { uri } = await storageClient.uploadAsJson(metadata);
      console.log("Metadata URI:", uri);

      const result: any = await createGroup(sessionClient, {
        metadataUri: URI(uri),
      })
        .andThen(handleOperationWith(signer!))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchGroup(sessionClient, { txHash }));

      console.log("Group created:", result);
      setCompletedSteps([0, 1]);
      setProcessStep(2);

      // Step 3: Register clan
      const tx = await walletClient?.writeContract({
        address: CLASH_OF_LENS_ADDRESS,
        abi: ClashOfLensABI,
        functionName: "registerClan",
        args: [result.value.address],
        account: address!,
      });

      console.log("Registration transaction:", tx);

      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: tx!,
      });

      console.log("Transaction receipt:", txReceipt);
      setCompletedSteps([0, 1, 2]);
    } catch (error) {
      console.error("Error creating clan:", error);
      setProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#a3ff12] mb-2">
                Clan Name
              </label>
              <Input
                type="text"
                value={clanData.name}
                onChange={(e) =>
                  setClanData({ ...clanData, name: e.target.value })
                }
                className="bg-black border-[#a3ff12] text-white placeholder:text-gray-500 focus:ring-[#a3ff12] focus:border-[#a3ff12]"
                placeholder="Enter clan name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#a3ff12] mb-2">
                Description
              </label>
              <textarea
                value={clanData.description}
                onChange={(e) =>
                  setClanData({ ...clanData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-[#a3ff12] text-white rounded-lg focus:ring-2 focus:ring-[#a3ff12] focus:border-[#a3ff12] placeholder:text-gray-500 min-h-[120px]"
                rows={4}
                placeholder="Enter clan description"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#a3ff12] mb-2">
                Clan Icon
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#a3ff12] border-dashed rounded-lg cursor-pointer bg-black hover:bg-[#a3ff12]/10 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-[#a3ff12]"
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
                    <p className="mb-2 text-sm text-[#a3ff12]">
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
                <div className="mt-4 text-sm text-[#a3ff12]">
                  Selected: {imageFile.name}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-black bg-opacity-80 border border-[#a3ff12] p-6 rounded-lg">
              <h3 className="text-lg font-bold text-[#a3ff12] mb-4">
                Review Clan Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[#a3ff12] font-bold">Clan Name:</span>
                  <p className="text-white">{clanData.name}</p>
                </div>
                <div>
                  <span className="text-[#a3ff12] font-bold">Description:</span>
                  <p className="text-white">{clanData.description}</p>
                </div>
                <div>
                  <span className="text-[#a3ff12] font-bold">Icon:</span>
                  {clanData.icon && (
                    <img
                      src={clanData.icon}
                      alt="Clan icon"
                      className="w-16 h-16 rounded-full mt-2 border-2 border-[#a3ff12]"
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
    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header */}
      <div className="mt-12 mb-8 flex flex-col items-center">
        <h1 className="text-[#a3ff12] font-extrabold text-4xl md:text-5xl tracking-tighter mb-2">
          CREATE CLAN
        </h1>
        <p className="text-gray-400">
          Create your own clan and start battling for supremacy
        </p>
        <Button
          asChild
          className="mt-6 bg-[#a3ff12] text-black font-bold hover:bg-opacity-90 transition-all relative group overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)" }}
          variant="default"
        >
          <Link href="/clans">
            <span className="relative z-10">BACK TO DIRECTORY</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Link>
        </Button>
      </div>
      <div className="bg-black bg-opacity-60 border border-gray-800 rounded-lg p-8">
        {!processing ? (
          <>
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
            />
            <div className="mt-8">{renderStepContent()}</div>
            <div className="mt-8 flex justify-between gap-4">
              <Button
                onClick={handleBack}
                className="min-w-[120px] border border-[#a3ff12] text-[#a3ff12] bg-transparent hover:bg-[#a3ff12] hover:text-black font-bold"
                variant="outline"
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleCreateClan}
                  className="min-w-[120px] bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                  variant="default"
                >
                  Create Clan
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="min-w-[120px] bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
                  variant="default"
                >
                  Next
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="mt-8 bg-black bg-opacity-80 border border-gray-800 p-8 rounded-xl flex flex-col items-center">
            <VerticalStepper
              steps={processSteps}
              currentStep={processStep}
              completedSteps={completedSteps}
            />
            {completedSteps.length === processSteps.length && (
              <div className="mt-8 text-[#a3ff12] text-xl font-bold">
                Clan Created Successfully!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
