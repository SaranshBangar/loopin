import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const UserAvatar = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  return (
    <Avatar>
      <AvatarImage src={session?.user?.profilePicture || ""} alt={session?.user?.username || ""} />
      <AvatarFallback>{session?.user?.username?.[0]}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
