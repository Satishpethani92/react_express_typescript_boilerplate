import React, { useEffect, useState } from "react";

import { Navigate, useParams } from "react-router-dom";
import { isUUID } from "../../utils/commonUtils";

import LoadingModal from "../../components/Modal/LoadingModal";

type Props = {};

const UserDetails = (props: Props) => {
  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  if (!isUUID(userId!)) {
    <Navigate to="/user" replace />;
  }

  return (
    <div className="mx-3 pt-3">
      <LoadingModal isVisible={isLoading} />

      <h4 className="mb-2">UserDetails Details {userId}</h4>
    </div>
  );
};

export default UserDetails;
