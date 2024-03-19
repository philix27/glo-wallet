import { Charity } from "@prisma/client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import CharitySelectorModal from "@/components/Modals/CharitySelectorModal";
import { api, CHARITY_MAP } from "@/lib/utils";

type Props = {
  openModal: (content: JSX.Element) => void;
  yearlyYield: number;
};

export default function CharitySelector({ openModal, yearlyYield }: Props) {
  const { address, isConnected } = useAccount();
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const loggedIn = localStorage.getItem("loggedIn");

  useEffect(() => {
    if (api() && !selectedCharity) {
      getCurrentSelectedCharity();
    }
  }, [api(), selectedCharity]);

  const getCurrentSelectedCharity = async (): void => {
    // console.log(selectedCharity);
    // console.log("api: ", await api());
    await api()
      .get(`/charity`)
      .then((res) => {
        console.log(res.data[0]);
        const currentSelectedCharity = res.data[0].name as Charity;
        setSelectedCharity(Charity[currentSelectedCharity]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateSelectedCharity = (name: Charity): void => {
    api()
      .post(`/charity`, [{ charity: name, percent: 100 }])
      .then((res) => {
        const newSelectedCharity = res.data[0].name as Charity;
        setSelectedCharity(Charity[newSelectedCharity]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="m-1 relative z-0 flex justify-center">
      <button
        className={`flex flex-col bg-white border-2 border-cyan-600 text-impact-fg rounded-[36px] h-[32px] mb-3 px-2 py-5 font-normal items-baseline`}
        onClick={() =>
          openModal(
            <CharitySelectorModal
              monthlyYield={yearlyYield / 12}
              selectedCharity={selectedCharity}
              updateSelectedCharity={updateSelectedCharity}
            />
          )
        }
      >
        <div className="flex w-full justify-center items-center space-y-2">
          <div className="flex items-center">
            <Image
              src={"/gear.svg"}
              width={16}
              height={16}
              alt="choose public good to fund"
            />
            <p className="ml-2 text-sm">
              {selectedCharity ? CHARITY_MAP[selectedCharity].name : "Charity"}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
