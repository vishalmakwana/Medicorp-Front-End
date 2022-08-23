import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNavTabs } from "@medicorp";

const LinkTab = ({ to, ...props }) => {
  const navigate = useNavigate();
  return (
    <Tab
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    />
  );
};

export default function NavTabs() {
  const { tabItems, value, handleChange } = useNavTabs();
  return (
    <>
      {tabItems.length > 0 ? (
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
          >
            {tabItems.map((tab) => (
              <LinkTab
                key={`tab_${tab.id}`}
                label={tab.labelText}
                to={tab.navigate}
              />
            ))}
          </Tabs>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
