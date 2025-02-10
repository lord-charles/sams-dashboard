import React from "react";
import UserModule from "./components/UserModule";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";

const getUsers = async () => {
  const users = await axios.get(`${base_url}user/users/get-all`);
  return users.data;
};

const Page = async () => {
  const users = await getUsers();

  return (
    <div className=" bg-gradient-to-b from-primary/20 to-background">
      <UserModule users={users} />
    </div>
  );
};

export default Page;
