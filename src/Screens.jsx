import { useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import {
  Box,
  Button,
  VStack,
  Spacer,
  Text,
  Grid,
  HStack,
} from "@chakra-ui/react";

import { Tile } from "./Tile";
import Lottie from "react-lottie";

import ballonsJson from "../src/ballons.json";
import menuJson from "../src/menuanim.json";
import forestJson from "../src/forest.json";
import birdsJson from "../src/birds.json";
import cupJson from "../src/cup.json";
import styled, { css, keyframes } from "styled-components";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];
const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

export function StartScreen({ start }) {
  const getDefaultOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });
  const ballonsAnim = getDefaultOptions(ballonsJson);
  const menuAnim = getDefaultOptions(menuJson);

  const ref = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = mouseX / width - HALF_ROTATION_RANGE;
    const rY = mouseY / height - HALF_ROTATION_RANGE;

    setRotateX(rX);
    setRotateY(rY);
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    setRotateX(0);
    setRotateY(0);
  };
  return (
    <div
      className="absolute flex"
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lottie options={ballonsAnim} height="100%" width="100%" />
        <div
          bg="teal.50"
          style={{
            height: "400px",
            width: "400px",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "2",
          }}
        >
          <Box
            w="400px"
            h="400px"
            borderRadius={10}
            position="relative"
            overflow="hidden"
          >
            <Lottie options={menuAnim} height="100%" width="100%"></Lottie>
          </Box>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "1",
            }}
          >
            <motion.div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                height: "400px",
                width: "400px",

                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateX,
                rotateY,
              }}
            >
              <VStack
                spacing="24px"
                mx="auto"
                h="380px"
                color="teal.500"
                fontWeight="bold"
                fontSize="4xl"
                mb="20px"
                style={{
                  transform: "translateZ(75px)",
                  transformStyle: "preserve-3d",
                }}
                borderRadius="10px"
              >
                <Spacer />
                <Text
                  style={{
                    transform: "translateZ(50px)",
                  }}
                >
                  Memory
                </Text>
                <Text
                  fontSize="lg"
                  mb="20px"
                  fontWeight="normal"
                  style={{
                    transform: "translateZ(50px)",
                  }}
                >
                  Flip over tiles looking for pairs
                </Text>
                <Button
                  onClick={start}
                  color="white"
                  w="130px"
                  h="50px"
                  mb="20px"
                  borderRadius="full"
                  bgGradient="linear(teal.400 30%, teal.500 70%)"
                  _hover={{
                    bgGradient: "linear(teal.500 30%, teal.600 70%)",
                  }}
                  size="lg"
                  boxShadow="2xl"
                  style={{
                    transform: "translateZ(50px)",
                  }}
                >
                  Play
                </Button>
                <Spacer />
              </VStack>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [showFinished, setFinished] = useState(false);

  const getDefaultOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });
  const forestAnim = getDefaultOptions(forestJson);
  const birdsAnim = getDefaultOptions(birdsJson);
  const cupAnim = getDefaultOptions(cupJson);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti();
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setFinished(true);
            setTimeout(end, 4000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };
  const rotateAnimation = keyframes`
  0%{
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
  }
  `;
  const animationStyle = css`
    animation: ${rotateAnimation} 2s linear infinite;
  `;

  const AnimatedDiv = styled.div`
    height: 200%;
    width: 50%;
    position: "absolute";
    background: linear-gradient(90deg, #8a2be2, #ffffff);
    borderradius: "5px";
    ${animationStyle};
  `;
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie options={forestAnim} height="100%" width="100%" />
      <Lottie
        options={birdsAnim}
        height="100%"
        width="100%"
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "3",
          pointerEvents: "none",
        }}
      />
      {showFinished && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "4",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flexDirection: "column",
          }}
        >
          <Text color="white" as="b" fontSize="8xl" mb="20px">
            Congratulations
          </Text>
          <Lottie options={cupAnim} height="70%" width="70%" />
        </div>
      )}
      <div
        style={{
          height: "390px",
          width: "390px",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "2",
        }}
      >
        <Box py="40px">
          <HStack mb="20px" color="green">
            <Spacer />
            <Text>Tries</Text>
            <Text bg="green.200" px="2" borderRadius="5px">
              {tryCount}
            </Text>
            <Spacer />
          </HStack>
          <Box
            h="390px"
            w="390px"
            bg="black"
            borderRadius="10px"
            justifyContent="center"
            alignItems="center"
            display="flex"
            margin="auto"
            overflow="hidden"
          >
            <AnimatedDiv />
            <Grid
              h="380px"
              w="380px"
              bg="black"
              p="10px"
              borderRadius="10px"
              m="auto"
              gap="3"
              templateColumns="repeat(4, 1fr)"
              position="absolute"
              margin="auto"
            >
              {getTiles(16).map((tile, i) => (
                <Tile key={i} flip={() => flip(i)} {...tile} />
              ))}
            </Grid>
          </Box>
        </Box>
      </div>
    </div>
  );
}
