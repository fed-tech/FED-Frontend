import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import skeletonStyles from "./styles/Carousel.module.scss";

const CarouselSkeleton = ({ customStyles = {} }) => (
  <SkeletonTheme baseColor="#525252" highlightColor="#313131">
    <div classname={skeletonStyles.carousel_skeleton} style={customStyles.carousel_skeleton}>
      <div classname={skeletonStyles.inner_skeleton} style={customStyles.inner_skeleton}>
        <div classname={skeletonStyles.carousel_outer} style={customStyles.carousel_outer}>
          <Skeleton classname={skeletonStyles.carousel} style={customStyles.carousel} />
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default CarouselSkeleton;
