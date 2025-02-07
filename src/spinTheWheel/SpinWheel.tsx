import { Box, Center, Image, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import logo from "../assets/awaed.png";
import bgGreen from "../assets/bg-green.png";

import appleLogo from "../assets/spin-prizes/apple.png";
import aramcoLogo from "../assets/spin-prizes/aramco.png";
import googleLogo from "../assets/spin-prizes/google.png";
import lucidLogo from "../assets/spin-prizes/lucid.png";
import nvidiaLogo from "../assets/spin-prizes/nvidia.png";
import sabicLogo from "../assets/spin-prizes/sabic.png";
import snapLogo from "../assets/spin-prizes/snap.png";
import stcLogo from "../assets/spin-prizes/stc.png";
import WinModal from "../components/modals/WinModal";

const SEGMENTS = [
  { image: appleLogo, weight: 1, currentPrice: "900", stockName: "AAPL" },
  { image: googleLogo, weight: 1, currentPrice: "787.5", stockName: "GOOG" },
  { image: nvidiaLogo, weight: 2, currentPrice: "450", stockName: "NVDA" },
  { image: sabicLogo, weight: 11, currentPrice: "68", stockName: "SABIC" },
  { image: stcLogo, weight: 27, currentPrice: "84", stockName: "STC" },
  { image: snapLogo, weight: 27, currentPrice: "86.25", stockName: "SNAP" },
  { image: aramcoLogo, weight: 25, currentPrice: "87", stockName: "ARAMCO" },
  { image: lucidLogo, weight: 5, currentPrice: "97.875", stockName: "LCID" },
];

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningIdx, setWinningIdx] = useState<number | null>(null);
  const [bg] = useState<string>(bgGreen);
  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Determine which segment is chosen using weighted selection
    const totalWeight = SEGMENTS.reduce((acc, seg) => acc + seg.weight, 0);
    const random = Math.random() * totalWeight;
    let accumulator = 0;
    let selectedIndex = 0;
    for (let i = 0; i < SEGMENTS.length; i++) {
      accumulator += SEGMENTS[i].weight;
      if (random < accumulator) {
        selectedIndex = i;
        break;
      }
    }
    console.log("Winning segment index:", selectedIndex);

    const segmentAngle = 360 / SEGMENTS.length;

    const segCenter = selectedIndex * segmentAngle + segmentAngle / 2;

    const currentRotationEffective = rotation % 360;

    let additionalRotation = 90 - (currentRotationEffective + segCenter);

    additionalRotation = ((additionalRotation % 360) + 360) % 360;

    const fullRotations = (Math.floor(Math.random() * 3) + 3) * 360;

    // The target rotation is the current rotation plus full spins plus the additional rotation needed.
    const targetRotation = rotation + fullRotations + additionalRotation + 90;

    setRotation(targetRotation);

    // Reset spinning state after the animation (duration: 3 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setWinningIdx(selectedIndex);
      onOpen();
    }, 3000);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Center
      h="100vh"
      bg="gray.900"
      backgroundImage={`url(${bg})`}
      bgSize={"cover"}
    >
      <Box position="relative" overflow={"hidden"}>
        <motion.div
          style={{
            width: "90vh",
            height: "90vh",
            borderRadius: "50%",
            background: "black",
            border: "4vh solid #EDFDE1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            boxShadow: "inset 0 0 24.5px 11.5px #1ed760",
          }}
          animate={{ rotate: rotation }}
          transition={{ type: "tween", duration: 3, ease: "easeOut" }}
        >
          {Array.from({ length: SEGMENTS.length / 2 }).map((_, i) => (
            <Box
              key={`line-${i}`}
              position="absolute"
              w="100%"
              h="2vh"
              bg="#EDFDE1"
              transform={`rotate(${(360 / SEGMENTS.length) * i}deg)`}
            />
          ))}

          {SEGMENTS.map((seg, i) => {
            // Calculate the angle for placing each segment’s content.
            const angle =
              (360 / SEGMENTS.length) * i + 360 / SEGMENTS.length / 2;
            return (
              <Box
                key={`outer-text-${i}`}
                position="absolute"
                w="100%"
                h="2vh"
                transform={`rotate(${angle}deg) `}
                transformOrigin="bottom center"
              >
                <Image
                  src={seg.image}
                  w="18vh"
                  h="18vh"
                  transform={"rotate(180deg) translate(-4vh, 10vh)"}
                  objectFit="contain"
                  borderRadius="full"
                />
              </Box>
            );
          })}
        </motion.div>

        <Box
          position="absolute"
          top={"38%"}
          right={"38%"}
          onClick={spinWheel}
          w="20vh"
          h="20vh"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#1ED760"
          color="white"
          fontWeight="bold"
          fontSize="2xl"
          zIndex={100}
          cursor={isSpinning ? "not-allowed" : "pointer"}
          opacity={isSpinning ? 0.7 : 1}
          transition="opacity 0.2s"
        >
          <Image src={logo} />
        </Box>

        {/* The pointer (arrow) is drawn on the right side (3 o’clock) */}
        <Box
          width={"10vh"}
          height={"10vh"}
          position={"absolute"}
          top={"43%"}
          right={"0%"}
          zIndex={"100"}
          bgColor={"#FFB800"}
          clipPath="polygon(0 50%, 100% 0, 100% 100%)"
        ></Box>
      </Box>
      {winningIdx && (
        <WinModal
          isOpen={isOpen}
          onClose={onClose}
          currentPrice={SEGMENTS[winningIdx!].currentPrice}
          stockName={SEGMENTS[winningIdx!].stockName}
        />
      )}
    </Center>
  );
};

export default SpinWheel;
