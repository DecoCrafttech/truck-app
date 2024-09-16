import React, { createContext, useState } from "react";

export const LoadNeedsContext = createContext();

export const LoadNeedsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState()

  const [aadhaarOTP, setAadhaarOTP] = useState("")

  // const [messageReceiver, setMessageReceiver] = useState({
  //   personId : "1",
  //   personName : "Marshal",
  //   personImage : require("../assets/images/apple.png"),
  //   lastMessage : "heloo"
  // })
  const [messageReceiver, setMessageReceiver] = useState(null)
  const [pageRefresh, setPageRefresh] = useState(false)
  const [userStatesFromProfile, setUserStatesFromProfile] = useState([])



  const toggleLoading = () => {
    setIsLoading((prevLoading) => !prevLoading);
  };

  return (
    <LoadNeedsContext.Provider
      value={{
        isLoading,
        setIsLoading,
        toggleLoading,
        currentUser,
        setCurrentUser,
        aadhaarOTP,
        setAadhaarOTP,
        messageReceiver,
        setMessageReceiver,
        pageRefresh,
        setPageRefresh,
        userStatesFromProfile,
        setUserStatesFromProfile
      }}
    >
      {children}
    </LoadNeedsContext.Provider>
  );
};
