import React from "react";

type Props = {
  isVisible: boolean;
};

const LoadingModal = ({ isVisible }: Props) => {
  if (isVisible)
    return (
      <div className="position-fixed start-0 top-0 d-flex justify-content-center align-items-center loaderBack">
        <div className="loader"></div>
      </div>
    );
  else return <></>;
};

export default LoadingModal;
