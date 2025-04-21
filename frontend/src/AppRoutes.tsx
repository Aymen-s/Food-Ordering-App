import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout>HOME PAGE</Layout>} />
      <Route path="/user-profile" element={<div>USER PROFILE PAGE</div>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
