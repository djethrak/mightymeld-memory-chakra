import { Box } from "@chakra-ui/react";
import { React, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

export function Tile({ content: Content, flip, state }) {
  const ref = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [transition, setTransition] = useState("");

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
  const handleFlip = () => {
    setRotateY(180);
    setTransition("all 0.2s ease");
    flip();
    setTimeout(() => {
      setRotateY(0);
      setTransition("");
      flip();
    }, 100);
  };

  switch (state) {
    case "start":
      return (
        <Box
          onClick={handleFlip}
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          borderRadius={10}
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              height: "100%",
              width: "100%",
              transformStyle: "preserve-3d",
              borderRadius: "10px",
              backgroundColor: "#68D391",
              transition: transition,
              backfaceVisibility: "hidden",
            }}
            animate={{
              rotateX,
              rotateY,
            }}
          ></motion.div>
        </Box>
      );
    case "flipped":
      return (
        <Box
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          bg="green.500"
          color="white"
          borderRadius="10%"
          p="10%"
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              height: "100%",
              width: "100%",
              transformStyle: "preserve-3d",
              borderRadius: "10px",
              backgroundColor: "#38A169",
            }}
            animate={{
              rotateX,
              rotateY,
            }}
          >
            <Content
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
                verticalAlign: "top",
                transform: "translateZ(50px)",
                transformStyle: "preserve-3d",
              }}
            />
          </motion.div>
        </Box>
      );
    case "matched":
      return (
        <Box
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          color="green.100"
          p="10%"
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              height: "100%",
              width: "100%",
              transformStyle: "preserve-3d",
              borderRadius: "10px",
            }}
            animate={{
              rotateX,
              rotateY,
            }}
          >
            <Content
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
                verticalAlign: "top",
                transform: "translateZ(50px)",
                transformStyle: "preserve-3d",
              }}
            />
          </motion.div>
        </Box>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}
