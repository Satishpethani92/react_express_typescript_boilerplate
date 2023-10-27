import React, { useEffect, useState } from "react";

import LoadingModal from "../../components/Modal/LoadingModal";

type Props = {};

const AdminHome = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mx-3 pt-3" style={{ height: "90%" }}>
      <LoadingModal isVisible={isLoading} />

      <h4 className="mb-4">User List</h4>
    </div>
  );
};

export default AdminHome;
