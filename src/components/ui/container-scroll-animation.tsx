"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // offset: ["start start", "end start"] means animation progresses as the container scrolls from the top to out of view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = React.useState(false);
  const [isSafari, setIsSafari] = React.useState(true);

  React.useEffect(() => {
    const checkEnvironment = () => {
      setIsMobile(window.innerWidth <= 768);
      const isBrowserSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      setIsSafari(isBrowserSafari);
    };
    checkEnvironment();
    window.addEventListener("resize", checkEnvironment);
    return () => {
      window.removeEventListener("resize", checkEnvironment);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [1, 0.85] : [1, 0.9];
  };

  // Start flat (0), tilt away (15) as we scroll down. Disable on non-Safari (Chrome) to save CPU/GPU.
  const disableAnimation = isMobile || !isSafari;
  
  const rotate = useTransform(scrollYProgress, [0, 1], disableAnimation ? [0, 0] : [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 1], disableAnimation ? [1, 1] : scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], disableAnimation ? [0, 0] : [0, -50]);

  return (
    <div
      className="w-full flex items-start justify-center relative p-2 md:p-8"
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{
          perspective: disableAnimation ? "none" : "1200px",
        }}
      >
        {titleComponent && <Header translate={translate} titleComponent={titleComponent} />}
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center mb-10"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate: _translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate?: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="w-full mx-auto relative z-10 origin-top"
    >
      {children}
    </motion.div>
  );
};
